from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import base64
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

def get_db_connection():  #For accessing user database 
    conn = sqlite3.connect('users.db')
    conn.row_factory = sqlite3.Row  # This allows you to access the columns by name
    return conn

def get_db_connection_1(db_name='products.db'):
    conn = sqlite3.connect(db_name)
    conn.row_factory = sqlite3.Row  # Allows you to access columns by name
    return conn

def get_db_connection_cartItem(db_name='cartItem.db'):
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

@app.route('/cart', methods=['POST'])
def add_to_cart():
    # Get data
    user_id = request.json.get('user_id')
    product_id = request.json.get('product_id')
    quantity = request.json.get('quantity')

    # Validate input
    if not user_id or not product_id or not quantity:
        return jsonify({"error": "Invalid input"}), 400

    conn = get_db_connection_cartItem('cartItem.db')
    cursor = conn.cursor()

    # Insert new cart item into the database
    cursor.execute('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
                   (user_id, product_id, quantity))
    conn.commit()
    conn.close()

    return jsonify({"message": "Item added to cart successfully"}), 201

@app.route('/cart/<int:user_id>', methods=['GET'])
def get_cart_items(user_id):
    conn = get_db_connection('cartItem.db')
    cursor = conn.cursor()

    # Query to fetch data
    cursor.execute('''
        SELECT 
            cart_items.id AS cart_item_id,
            cart_items.quantity,
            products.id AS product_id,
            products.product_name,
            products.product_qty,
            products.product_desc,
            products.product_img,
            products.product_price,
            products.product_type
        FROM cart_items
        JOIN products ON cart_items.product_id = products.id
        WHERE cart_items.user_id = ?
    ''', (user_id,))

    cart_items = cursor.fetchall()

    conn.close()

    cart_items_list = []
    for item in cart_items:
        # Convert BLOB to base64 encoded string
        product_img_base64 = base64.b64encode(item["product_img"]).decode('utf-8') if item["product_img"] else None
        
        cart_items_list.append({
            "cart_item_id": item["cart_item_id"],
            "quantity": item["quantity"],
            "product": {
                "product_id": item["product_id"],
                "product_name": item["product_name"],
                "product_qty": item["product_qty"],
                "product_desc": item["product_desc"],
                "product_img": product_img_base64,  # Base64 encoded string
                "product_price": item["product_price"],
                "product_type": item["product_type"]
            }
        })

    return jsonify({"cart_items": cart_items_list})

@app.route('/recommendations/<string:current_product_name>', methods=['GET'])
def get_recommendations(current_product_name):
    conn = get_db_connection_1('products.db')
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM products WHERE product_name != ?', (current_product_name,))
    products = cursor.fetchall()

    conn.close()

    recommendations = []
    for product in products:
        # Convert BLOB to base64 encoded string
        product_img_base64 = base64.b64encode(product["product_img"]).decode('utf-8') if product["product_img"] else None

        recommendations.append({
            "product_name": product["product_name"],
            "product_price": product["product_price"],
            "product_img": product_img_base64  # Base64 encoded string
        })

    return jsonify({"recommendations": recommendations})

@socketio.on('get_recommendations')
def handle_get_recommendations(data):
    current_product_name = data.get('current_product_name')
    
    conn = get_db_connection_1('products.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM products WHERE product_name != ?', (current_product_name,))
    products = cursor.fetchall()

    conn.close()

    recommendations = []
    for product in products:
        # Convert BLOB to base64 encoded string
        product_img_base64 = base64.b64encode(product["product_img"]).decode('utf-8') if product["product_img"] else None

        recommendations.append({
            "product_name": product["product_name"],
            "product_price": product["product_price"],
            "product_img": product_img_base64,  # Base64 encoded string
            "product_qty" : product["product_qty"],
            "product_desc" : product["product_desc"],
            "product_type" : product["product_type"],
        })

    emit('recommendations', recommendations)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=3000, debug=True)
