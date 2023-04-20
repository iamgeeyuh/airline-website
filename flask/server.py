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
  isCustomer = request.form['isCustomer'] #TODO:needs to be fetched in front end

  cursor = conn.cursor

  if (isCustomer):
    query = 'SELECT * FROM Customer WHERE email = %s and password = %s' #get the username and password
  else:
    query = 'SELECT * FROM Staff WHERE username = %s and password = %s'
  cursor.execute(query, (username, password))

  data = cursor.fetchone()
  cursor.close()

  if(data):
		#creates a session for the the user
		#session is a built in
    session['username'] = username
    return {"user": True} #TODO:redirect to the home page in front end for testing
  else:
    return {"user": False} #TODO: display an error message (according to page6 3B)

#Authenticates the register
@app.route('/registerAuth', methods=['GET', 'POST'])
def registerAuth():
	#grabs information from the forms
	username = request.form['username']
	password = request.form['password']

	#cursor used to send queries
	cursor = conn.cursor()
	#executes query
	query = 'SELECT * FROM user WHERE username = %s'
	cursor.execute(query, (username))
	#stores the results in a variable
	data = cursor.fetchone()
	#use fetchall() if you are expecting more than 1 data row
	error = None
	if(data):
		#If the previous query returns data, then user exists
		error = "This user already exists"
		return render_template('register.html', error = error)
	else:
		ins = 'INSERT INTO user VALUES(%s, %s)'
		cursor.execute(ins, (username, password))
		conn.commit()
		cursor.close()
		return render_template('index.html')

#home page for testing
@app.route("/home", methods=['GET', 'POST'])
def home():
  return {"members": ["success"]}

if __name__== "__main__":
  app.run(debug = True)