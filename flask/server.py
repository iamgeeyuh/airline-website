import pymysql.cursors
from flask import Flask, render_template, request, session, url_for, redirect

app = Flask(__name__)

conn = pymysql.connect(host='localhost',
                       user='root',
                       password='',
                       db='blog',
                       charset='utf8mb4',
                       cursorclass=pymysql.cursors.DictCursor)


#Members API route
@app.route("/login", methods=['GET', 'POST'])
def login():
  username = request.form['username'] #TODO: needs to be fetched in front end
  password = request.form['password'] #TODO:needs to be fetched in front end

  cursor = conn.cursor

  query = 'SELECT * FROM user WHERE username = %s and password = %s' #get the username and password
  cursor.execute(query, (username, password))

  data = cursor.fetchone()
  cursor.close()

  if(data):
		#creates a session for the the user
		#session is a built in
    session['username'] = username
    return {"user": True} #TODO:redirect to the home page in front end for testing
  else:
    return {"user": False}


#home page for testing
@app.route("/home", methods=['GET', 'POST'])
def home():
  return {"members": ["Member1", "Member2", "Member3"]}

if __name__== "__main__":
  app.run(debug = True)