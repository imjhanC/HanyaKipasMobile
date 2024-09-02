from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import base64

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('users.db')
    conn.row_factory = sqlite3.Row  # This allows you to access the columns by name
    return conn

def get_db_connection_1(db_name='products.db'):
    conn = sqlite3.connect(db_name)
    conn.row_factory = sqlite3.Row  # Allows you to access columns by name
    return conn

# Route to register a new user
@app.route('/register', methods=['POST'])
def register():
    username = request.json['username']
    password = request.json['password']

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, password))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"error": "Username already exists"}), 409

    conn.close()
    return jsonify({"message": "User registered successfully"}), 201

# Route to authenticate a user (login)
@app.route('/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, password))
    user = cursor.fetchone()

    conn.close()

    if user is None:
        return jsonify({"error": "Invalid username or password"}), 401
    
    return jsonify({"message": "Login successful"}), 200

# Route to get all users (similar to how you retrieved movies)
@app.route('/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM users')
    users = cursor.fetchall()
    
    conn.close()

    users_list = []
    for user in users:
        users_list.append({"id": user["id"], "username": user["username"]})

    return jsonify({"users": users_list})


@app.route('/products', methods=['GET'])
def get_products():
    conn = get_db_connection_1('products.db')
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM products')
    products = cursor.fetchall()

    conn.close()

    products_list = []
    for product in products:
        # Convert BLOB to base64 encoded string
        product_img_base64 = base64.b64encode(product["product_img"]).decode('utf-8') if product["product_img"] else None
        
        products_list.append({
            "id": product["id"],
            "product_name": product["product_name"],
            "product_qty": product["product_qty"],
            "product_desc": product["product_desc"],
            "product_img": product_img_base64,  # Base64 encoded string
            "product_price": product["product_price"],
            "product_type": product["product_type"]
        })

    return jsonify({"products": products_list})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=3000, debug=True)