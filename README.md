# How to setup <server>
1st - type <sqlite movies.db>
2nd - in the sqlite terminal
   <CREATE TABLE movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    releaseYear TEXT NOT NULL
   );

      INSERT INTO movies (title, releaseYear) VALUES ('The Shawshank Redemption', '1994');
      INSERT INTO movies (title, releaseYear) VALUES ('The Godfather', '1972');
      INSERT INTO movies (title, releaseYear) VALUES ('The Dark Knight', '2008');
      INSERT INTO movies (title, releaseYear) VALUES ('Pulp Fiction', '1994');
   >
3rd   - open a python file and type in this following 
   <from flask import Flask, jsonify
   from flask_cors import CORS
   import sqlite3

   app = Flask(__name__)
   CORS(app)

   def get_db_connection():
      conn = sqlite3.connect('movies.db')
      conn.row_factory = sqlite3.Row  # This allows you to access the columns by name
      return conn

   @app.route('/movies', methods=['GET'])
   def get_movies():
      conn = get_db_connection()
      cursor = conn.cursor()
      
      cursor.execute('SELECT * FROM movies')
      movies = cursor.fetchall()
      
      conn.close()

      # Convert rows to a list of dictionaries
      movies_list = []
      for movie in movies:
         movies_list.append({"id": movie["id"], "title": movie["title"], "releaseYear": movie["releaseYear"]})

      return jsonify({"movies": movies_list})

   if __name__ == '__main__':
      app.run(host='127.0.0.1', port=3000, debug=True)
   >

4th - python server.py 
5th - You will see something as "This is a development server with the IP listed "
6th - run the App  ! 
7th - Can't connect ? Try this => go to terminal and type  <adb devices> then try this <adb reverse tcp:3000 tcp:3000>
