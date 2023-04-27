# this is server.py
# just typing
import pymysql.cursors
from flask import Flask, render_template, request, session, url_for, redirect
from flask_cors import CORS
import hashlib

app = Flask(__name__)
CORS(app)

app.secret_key = "secret_key"

conn = pymysql.connect(
    host="localhost",
    user="root",
    password="",
    db="airline",
    charset="utf8mb4",
    cursorclass=pymysql.cursors.DictCursor,
)


# Members API route
@app.route("/login", methods=["POST"])
def login():
    username = request.form[
        "username"
    ]
    password = request.form["password"]
    isCustomer = request.form[
        "isCustomer"
    ]

    cursor = conn.cursor()

    if isCustomer == True:
        # get the username and password
        query = "SELECT * FROM Customer WHERE email = %s and password = %s"

    else:
        query = "SELECT * FROM Staff WHERE username = %s and password = %s"

    cursor.execute(query, (username, hashlib.md5(password.encode('utf-8'))))

    data = cursor.fetchone()
    print(data)
    cursor.close()
    if data:
        # creates a session for the the user
        # session is a built in
        session["username"] = username
        return {
            "user": True
        }  # TODO:redirect to the home page in front end for testing
    else:
        return {"user": False}


# Authenticates the register
@app.route("/registerAuth", methods=["GET", "POST"])
def registerAuth():
    # grabs information from the forms #TODO: needs to be fetched in front end
    # email = request.form["email[0]"]
    # print(request.form["email[0]"])
    # print(request.form["email[1]"])

    num_of_emails = request.form["num_of_emails"]
    password = request.form["password"]
    isCustomer = request.form["isCustomer"]
    fname = request.form["fname"]
    lname = request.form["lname"]
    date_of_birth = request.form["date_of_birth"]
    phone_num = request.form["phone_num"]
    if isCustomer == True:
        bldg_num = request.form["bldg_num"]
        apt = request.form["apt"]
        street = request.form["street"]
        city = request.form["city"]
        state = request.form["state"]
        print(request.form["phone_num[0]"])
        print(request.form["phone_num[1]"])
        num_of_phones = request.form["num_of_phones"]
        passport_num = request.form["passport_num"]
        passport_exp = request.form["passport_exp"]
        passport_country = request.form["passport_country"]
        email = request.form["email[0]"]
    else:
        username = request.form["username"]
        airline_name = request.form["airline_name"]
        email = request.form["email"]

    # cursor used to send queries
    cursor = conn.cursor()
    # executes query
    if isCustomer == True:
        query = "SELECT * FROM Customer WHERE email = %s"
        cursor.execute(query, (email))
    else:
        query = "SELECT * FROM Staff WHERE username = %s"
        cursor.execute(query, (username))

    # stores the results in a variable
    data = cursor.fetchone()
    # use fetchall() if you are expecting more than 1 data row
    if data:
        # If the previous query returns data, then user exists
        return {
            "register": False
        }  # TODO: display an error message (according to page6 3B)
    else:
        if isCustomer == True:
            ins = (
                "INSERT INTO Customer VALUES(%s, %s, %s, %s, %d, %s, %s, %s,"
                " %s, %s, %s, %s, %s)"
            )
            cursor.execute(
                ins,
                (
                    email,
                    fname,
                    lname,
                    hashlib.md5(password),
                    bldg_num,
                    street,
                    apt,
                    city,
                    state,
                    phone_num,
                    passport_num,
                    passport_exp,
                    passport_country,
                    date_of_birth,
                ),
            )
            for p in phone_num:
                # TODO: need a table for Customer_Phone
                ins = "INSERT INTO Customer_Phone VALUES(%s, %s)"
                cursor.execute(ins, (email, p))
        else:
            ins = "INSERT INTO Staff VALUES(%s, %s, %s, %s, %s, %s)"
            cursor.execute(
                ins,
                (username, hashlib.md5(password),
                 airline_name, fname, lname, date_of_birth),
            )

            for e in email:
                ins = "INSERT INTO Staff_Email VALUES(%s, %s)"
                cursor.execute(ins, (username, e))

            for p in phone_num:
                ins = "INSERT INTO Staff_Phone VALUES(%s, %s)"
                cursor.execute(ins, (username, p))

        conn.commit()
        cursor.close()
        return {"register": True}


# home page for testing
@app.route("/home", methods=["GET", "POST"])
def home():
    return {"members": ["success"]}


@app.route("/flight_status", methods=["GET", "POST"])
def public_info():
    dep_city = session['dep_city']
    dep_airport_name = session['dep_airport_name']
    arr_city = session['arr_city']
    arr_airport_name = session['arr_airport_name']
    departure_datetime = session['departure_datetime']

    cursor = conn.cursor()
    query = 'SELECT flight_num, departure_datetime, airline_name, arrival_datetime, ' +\
            'arr_airport_name, arr_city, dep_airport_name, dep_city' +\
            'FROM Flight NATURAL JOIN' +\
            '(SELECT airport_name AS arr_airport_name, city AS arr_city FROM Airport) NATURAL JOIN' +\
            '(SELECT airport_name AS dep_airport_name, city AS dep_city FROM Airport)' +\
            'WHERE departure_datetime > CURRENT_TIMESTAMP'

    params = ()
    if dep_city != "":
        query += ' and dep_city = %s and'
        params += (dep_city,)
    if dep_airport_name != "":
        query += ' and arr_airport = %s'
        params += (dep_airport_name,)
    if arr_city != "":
        query += ' and arr_city = %s'
        params += (arr_city,)
    if arr_airport_name != "":
        query += ' and arr_airport_name = %s'
        params += (arr_airport_name,)
    if departure_datetime != "":
        query += ' and DATE(departure_datetime) = %s and'
        params += (departure_datetime,)

    cursor.execute(query, params)
    data = cursor.fetchall()

    cursor.close()

    return {"flight_status": True}


if __name__ == "__main__":
    app.run(debug=True)
