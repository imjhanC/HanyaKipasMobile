from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_session import Session  # Import Flask-Session
import sqlite3
import base64
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'  # Use filesystem for storing session data
Session(app)  # Initialize the Flask-Session extension

CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

def get_db_connection():
    conn = sqlite3.connect('users.db')
    conn.row_factory = sqlite3.Row
    return conn

def get_db_connection_1(db_name='products.db'):
    conn = sqlite3.connect(db_name)
    conn.row_factory = sqlite3.Row
    return conn

def get_db_connection_cart(db_name='cart.db'):
    conn = sqlite3.connect(db_name)
    conn.row_factory = sqlite3.Row
    return conn

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
    
    # Store the username in the session
    session['username'] = username
    return jsonify({"message": "Login successful"}), 200

@app.route('/change-password', methods=['POST'])
def changePassword():
    username = session.get('username')
    oldPassword = request.json['oldPassword']

    if not username:
        return jsonify({"error": "No user logged in"}), 401
    
    conn = get_db_connection_cart('users.db')
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, oldPassword))
    user = cursor.fetchone()

    conn.close()

    if user is None:
        return jsonify({"error": "Invalid username or password"}), 401
    elif oldPassword is not user['password']:
        return jsonify({"error": "Invalid password"}), 403
    else:
        newPassword = request.json['newPassword']
        conn = get_db_connection_cart('users.db')
        cursor = conn.cursor()

        cursor.execute('UPDATE users.db SET password = ? WHERE username = ? ', (newPassword, username))
        conn.commit()

        conn.close()

        return jsonify({"message": "Password Changed Succesfully"}), 201

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('username', None)  # Remove the username from the session
    return jsonify({"message": "Logout successful"}), 200

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
        product_img_base64 = base64.b64encode(product["product_img"]).decode('utf-8') if product["product_img"] else None
        
        products_list.append({
            "id": product["id"],
            "product_name": product["product_name"],
            "product_qty": product["product_qty"],
            "product_desc": product["product_desc"],
            "product_img": product_img_base64,
            "product_price": product["product_price"],
            "product_type": product["product_type"]
        })

    return jsonify({"products": products_list})

@app.route('/products/random', methods=['GET'])
def get_random_products():
    conn = get_db_connection_1('products.db')
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM products ORDER BY RANDOM() LIMIT 5;')
    products = cursor.fetchall()

    conn.close()

    products_list = []
    for product in products:
        product_img_base64 = base64.b64encode(product["product_img"]).decode('utf-8') if product["product_img"] else None

        products_list.append({
            "id": product["id"],
            "product_name": product["product_name"],
            "product_qty": product["product_qty"],
            "product_desc": product["product_desc"],
            "product_img": product_img_base64,
            "product_price": product["product_price"],
            "product_type": product["product_type"]
        })

    return jsonify({"products": products_list})

@app.route('/recommendations/<string:current_product_name>', methods=['GET'])
def get_recommendations(current_product_name):
    conn = get_db_connection_1('products.db')
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM products WHERE product_name != ?', (current_product_name,))
    products = cursor.fetchall()

    conn.close()

    recommendations = []
    for product in products:
        product_img_base64 = base64.b64encode(product["product_img"]).decode('utf-8') if product["product_img"] else None

        recommendations.append({
            "product_name": product["product_name"],
            "product_price": product["product_price"],
            "product_img": product_img_base64
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
        product_img_base64 = base64.b64encode(product["product_img"]).decode('utf-8') if product["product_img"] else None

        recommendations.append({
            "product_name": product["product_name"],
            "product_price": product["product_price"],
            "product_img": product_img_base64,
            "product_qty" : product["product_qty"],
            "product_desc" : product["product_desc"],
            "product_type" : product["product_type"],
        })

    emit('recommendations', recommendations)

@app.route('/cart/count', methods=['GET'])
def get_cart_count():
    # Fetch the username from the session
    username = session.get('username')

    if not username:
        return jsonify({"error": "No user logged in"}), 401

    conn = get_db_connection_cart('cart.db')
    cursor = conn.cursor()

    cursor.execute('SELECT COUNT(*) as count FROM carts WHERE cusname = ?', (username,))
    count = cursor.fetchone()['count']

    conn.close()

    return jsonify({"count": count})


@app.route('/current_user', methods=['GET'])
def get_current_user():
    # Fetch the username from the session
    username = session.get('username')

    if username:
        return jsonify({"username": username}), 200
    else:
        return jsonify({"error": "No user logged in"}), 401
    

@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    data = request.json
    cusname = data.get('cusname')
    productname = data.get('productname')
    cartqty = data.get('cartqty')
    totalprice = data.get('totalprice')
    producttype = data.get('producttype')

    conn = get_db_connection_cart('cart.db')
    cursor = conn.cursor()

    try:
        cursor.execute('INSERT INTO carts (cusname, productname, cartqty, totalprice, producttype) VALUES (?, ?, ?, ?, ?)', 
                       (cusname, productname, cartqty, totalprice, producttype))
        conn.commit()
    except sqlite3.IntegrityError as e:
        conn.close()
        return jsonify({"error": str(e)}), 400

    conn.close()
    return jsonify({"message": "Item added to cart successfully"}), 201

@app.route('/cart/<string:username>', methods=['GET'])
def get_cart_items(username):
    conn_cart = get_db_connection_cart('cart.db')
    conn_products = get_db_connection_1('products.db')
    
    cursor_cart = conn_cart.cursor()
    cursor_products = conn_products.cursor()

    # Fetch cart items along with the product image
    cursor_cart.execute('''
        SELECT id, productname, cartqty, totalprice, producttype
        FROM carts
        WHERE cusname = ?
    ''', (username,))
    cart_items = cursor_cart.fetchall()

    cart_list = []
    for item in cart_items:
        # Fetch the product image from the products.db
        cursor_products.execute('''
            SELECT product_img
            FROM products
            WHERE product_name = ? AND product_type = ?
        ''', (item['productname'], item['producttype']))
        product = cursor_products.fetchone()
        
        product_img_base64 = base64.b64encode(product['product_img']).decode('utf-8') if product and product['product_img'] else None
        
        cart_list.append({
            "id": item["id"],
            "productname": item["productname"],
            "cartqty": item["cartqty"],
            "totalprice": item["totalprice"],
            "producttype": item["producttype"],
            "product_img": product_img_base64  # Include the product image
        })

    conn_cart.close()
    conn_products.close()

    return jsonify({"cartItems": cart_list})

@app.route('/products', methods=['GET'])
def get_product_by_name():
    product_name = request.args.get('name')

    conn = get_db_connection_1('products.db')
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM products WHERE product_name = ?', (product_name,))
    product = cursor.fetchone()

    conn.close()

    if product:
        product_img_base64 = base64.b64encode(product["product_img"]).decode('utf-8') if product["product_img"] else None
        return jsonify({
            "product_name": product["product_name"],
            "product_qty": product["product_qty"],
            "product_desc": product["product_desc"],
            "product_img": product_img_base64,
            "product_price": product["product_price"],
            "product_type": product["product_type"]
        }), 200
    else:
        return jsonify({"error": "Product not found"}), 404
    
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=3000, debug=True)
