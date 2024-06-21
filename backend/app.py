from flask import Flask, request, jsonify
from flask_cors import CORS
from urllib.parse import urlparse
import mysql.connector
import os
import logging

app = Flask(__name__)
CORS(app)


logging.basicConfig(level=logging.INFO)


def get_db_connection():
    try:
        database_url = os.environ.get('DATABASE_URL')
        if database_url is None:
            raise EnvironmentError("DATABASE_URL environment variable is not set.")

        url = urlparse(database_url)

        host = url.hostname
        username = url.username
        password = url.password
        database = url.path[1:]
        port = url.port

        connection = mysql.connector.connect(
            host=host,
            user=username,
            password=password,
            database=database,
            port=port
        )
        return connection
    except mysql.connector.Error as err:
        logging.error(f"Error connecting to the database: {err}")
        return None
    except Exception as e:
        logging.error(f"Error: {e}")
        return None


@app.route('/')
def index():
    return "Welcome to the Banking System"

@app.route('/customers')
def get_customers():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Customers")
        customers = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(customers)
    except mysql.connector.Error as e:
        logging.error(f"Database error: {e}")
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return jsonify({"error": "Unexpected error"}), 500

@app.route('/customer/<int:id>')
def get_customer(id):
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Customers WHERE id = %s", (id,))
        customer = cursor.fetchone()
        cursor.close()
        connection.close()
        if customer:
            return jsonify(customer)
        else:
            return jsonify({"error": "Customer not found"}), 404
    except mysql.connector.Error as e:
        logging.error(f"Database error: {e}")
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return jsonify({"error": "Unexpected error"}), 500

@app.route('/transfer', methods=['POST'])
def transfer():
    try:
        data = request.get_json()
        sender_id = data.get('sender_id')
        receiver_id = data.get('receiver_id')
        amount = float(data.get('amount'))

        if not sender_id or not receiver_id or not amount:
            return jsonify({"error": "Invalid request data"}), 400

        connection = get_db_connection()
        if connection is None:
            return jsonify({"error": "Database connection failed"}), 500
        
        cursor = connection.cursor()

        
        cursor.execute("SELECT current_balance FROM Customers WHERE id = %s", (sender_id,))
        sender_balance = cursor.fetchone()

        if not sender_balance:
            cursor.close()
            connection.close()
            return jsonify({"error": f"Sender with id {sender_id} not found"}), 404

        if sender_balance[0] < amount:
            cursor.close()
            connection.close()
            return jsonify({"error": "Insufficient balance"}), 400

        cursor.execute("SELECT current_balance FROM Customers WHERE id = %s", (receiver_id,))
        receiver_exists = cursor.fetchone()
        if not receiver_exists:
            cursor.close()
            connection.close()
            return jsonify({"error": f"Receiver with id {receiver_id} not found"}), 404

        
        cursor.execute("UPDATE Customers SET current_balance = current_balance - %s WHERE id = %s", (amount, sender_id))
        cursor.execute("UPDATE Customers SET current_balance = current_balance + %s WHERE id = %s", (amount, receiver_id))
        
        
        cursor.execute("INSERT INTO Transactions (sender_id, receiver_id, amount) VALUES (%s, %s, %s)", (sender_id, receiver_id, amount))
        
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({"message": "Transfer successful"}), 200

    except mysql.connector.Error as e:
        connection.rollback()
        logging.error(f"Database error: {e}")
        return jsonify({"error": "Database error"}), 500

    except Exception as e:
        logging.error(f"Error in transfer function: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500


@app.route('/customer/<int:id>/transactions')
def get_customer_transactions(id):
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT t.amount, t.transaction_date, 
                   sender.name as sender_name, 
                   receiver.name as receiver_name 
            FROM Transactions t
            JOIN Customers sender ON t.sender_id = sender.id
            JOIN Customers receiver ON t.receiver_id = receiver.id
            WHERE t.sender_id = %s OR t.receiver_id = %s
            ORDER BY t.transaction_date DESC
        """, (id, id))
        transactions = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(transactions)
    except mysql.connector.Error as e:
        logging.error(f"Database error: {e}")
        return jsonify({"error": "Database error"}), 500

if __name__ == '__main__':
    app.run(debug=True)

