# this is server.py
# just typing
import pymysql.cursors
from flask import Flask, render_template, request, session, url_for, redirect
from flask_cors import CORS

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
    ]  # TODO: needs to be fetched in front end
    password = request.form["password"]  # TODO:needs to be fetched in front end
    isCustomer = request.form[
        "isCustomer"
    ]  # TODO:needs to be fetched in front end

    cursor = conn.cursor()

    if isCustomer:
        query = (  # get the username and password
            "SELECT * FROM Customer WHERE email = %s and password = %s"
        )
    else:
        query = "SELECT * FROM Staff WHERE username = %s and password = %s"
    cursor.execute(query, (username, password))

    data = cursor.fetchone()
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
    email = request.form["email"]
    password = request.form["password"]
    isCustomer = request.form["isCustomer"]
    fname = request.form["fname"]
    lname = request.form["lname"]
    date_of_birth = request.form["date_of_birth"]
    if isCustomer:
        bldg_num = request.form["bldg_num"]
        apt = request.form["apt"]
        street = request.form["street"]
        city = request.form["city"]
        state = request.form["state"]
        phone_num = request.form["phone_num"]
        passport_num = request.form["passport_num"]
        passport_exp = request.form["passport_exp"]
        passport_contry = request.form["passport_country"]
    else:
        username = request.form["username"]
        airline_name = request.form["airline_name"]
        phone_num = request.form["phone_num"]

    # cursor used to send queries
    cursor = conn.cursor()
    # executes query
    if isCustomer:
        query = "SELECT * FROM Customer WHERE username = %s"
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
        if isCustomer:
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
                    password,
                    bldg_num,
                    street,
                    apt,
                    city,
                    state,
                    phone_num,
                    passport_num,
                    passport_exp,
                    passport_contry,
                    date_of_birth,
                ),
            )
        else:
            ins = "INSERT INTO Staff VALUES(%s, %s, %s, %s, %s, %s)"
            cursor.execute(
                ins,
                (username, password, airline_name, fname, lname, date_of_birth),
            )
            ins = "INSERT INTO Staff_Email VALUES(%s, %s)"
            cursor.execute(ins, (username, email))
            ins = "INSERT INTO Staff_Phone VALUES(%s, %s)"
            cursor.execute(ins, (username, phone_num))
        conn.commit()
        cursor.close()
        return {"register": True}


# home page for testing
@app.route("/home", methods=["GET", "POST"])
def home():
    return {"members": ["success"]}


if __name__ == "__main__":
    app.run(debug=True)
