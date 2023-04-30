import pymysql.cursors
from flask import (
    Flask,
    render_template,
    request,
    session,
    url_for,
    redirect,
    jsonify,
)
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
    print(request.form)
    username = request.form["username"]
    password = request.form["password"]
    isCustomer = request.form["isCustomer"]

    cursor = conn.cursor()

    if isCustomer == "true":
        # get the username and password
        query = "SELECT * FROM Customer WHERE email = %s and password = %s"

    else:
        query = "SELECT * FROM Staff WHERE username = %s and password = %s"

    # cursor.execute(query, (username, hashlib.md5(password.encode('utf-8'))))
    print(username)
    print(password)
    print(isCustomer)
    cursor.execute(query, (username, password))

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
    password = request.form["password"]
    isCustomer = request.form["isCustomer"]
    fname = request.form["fname"]
    lname = request.form["lname"]
    date_of_birth = request.form["date_of_birth"]

    num_of_phones = request.form["num_of_phones"]
    phone_num = []
    for i in range(int(num_of_phones)):
        phone_num.append(request.form["phone_num[" + str(i) + "]"])

    if isCustomer == "true":
        bldg_num = request.form["bldg_num"]
        apt = request.form["apt"]
        street = request.form["street"]
        city = request.form["city"]
        state = request.form["state"]

        passport_num = request.form["passport_num"]
        passport_exp = request.form["passport_exp"]
        passport_country = request.form["passport_country"]
        email = request.form["email"]
    else:
        username = request.form["username"]
        airline_name = request.form["airline_name"]
        email = []
        num_of_emails = request.form["num_of_emails"]
        for i in range(int(num_of_emails)):
            email.append(request.form["email[" + str(i) + "]"])

    # cursor used to send queries
    cursor = conn.cursor()
    # executes query

    if isCustomer == "true":
        print("hi")
        query = "SELECT * FROM Customer WHERE email = %s"
        cursor.execute(query, (email))
    else:
        query = "SELECT * FROM Staff WHERE username = %s"
        cursor.execute(query, (username))

    # stores the results in a variable
    data = cursor.fetchone()
    if data:
        # If the previous query returns data, then user exists
        return {
            "register": False
        }  # TODO: display an error message (according to page6 3B)
    else:
        if isCustomer == "true":
            ins = (
                "INSERT INTO Customer VALUES(%s, %s, %s, %s, %s, %s, %s, %s,"
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
                    passport_num,
                    passport_exp,
                    passport_country,
                    date_of_birth,
                ),
            )
            for p in phone_num:
                ins = "INSERT INTO Customer_Phone VALUES(%s, %s)"
                cursor.execute(ins, (email, p))
        else:
            print("hi")
            ins = "INSERT INTO Staff VALUES(%s, %s, %s, %s, %s, %s)"
            cursor.execute(
                ins,
                (username, password, airline_name, fname, lname, date_of_birth),
            )

            for e in email:
                ins = "INSERT INTO Staff_Email VALUES(%s, %s)"
                cursor.execute(ins, (username, e))

            for p in phone_num:
                print(p)
                ins = "INSERT INTO Staff_Phone VALUES(%s, %s)"
                cursor.execute(ins, (username, p))
        conn.commit()
        cursor.close()
        return {"register": True}


# home page for testing
@app.route("/home", methods=["GET", "POST"])
def home():
    return {"members": ["success"]}


@app.route("/search_flight", methods=["GET", "POST"])
def search_flight():
    print(request.form)
    dep_city = request.form["src_city"]
    dep_airport_name = request.form["src_airport"]
    arr_city = request.form["dst_city"]
    arr_airport_name = request.form["dst_airport"]
    # departure_date = request.form["dep_date"].replace("T", " ") + ":00"
    departure_date = request.form["dep_date"]
    

    isOneWay = request.form["isOneWay"]
    return_date = request.form["return_date"]

    cursor = conn.cursor()

    query = (
        "SELECT flight_num, departure_datetime, airline_name,"
        " arrival_datetime, "
        + "arr_airport.airport_name, arr_airport.city,"
        " dep_airport.airport_name, dep_airport.city, base_price "
        + "FROM Flight INNER JOIN Airport as arr_airport ON"
        " Flight.arrival_airport_code = arr_airport.airport_code "
        + "INNER JOIN Airport as dep_airport ON Flight.departure_airport_code ="
        " dep_airport.airport_code "
        + "WHERE departure_datetime > CURRENT_TIMESTAMP"
    )


    params = ()
    if dep_city != "":
        query += " and dep_airport.city = %s"
        params += (dep_city,)
    if dep_airport_name != "":
        query += " and dep_airport.airport_name = %s"
        params += (dep_airport_name,)
    if arr_city != "":
        query += " and arr_airport.city = %s"
        params += (arr_city,)
    if arr_airport_name != "":
        query += " and arr_airport.airport_name = %s"
        params += (arr_airport_name,)
    if departure_date != "":
        query += " and departure_datetime = %s"
        params += (departure_date,)

    # print(query)
    cursor.execute(query, params)
    data_array = cursor.fetchall()

    flights = []  # a 2D array that stores flights and their info
    for data in data_array:
        flight = {
            "flight_num": data["flight_num"],
            "departure_date": data["departure_datetime"].date().strftime('%M:%D:%Y'),
            "departure_time": data["departure_datetime"].time().strftime('%H:%M:%S'),
            "airline_name": data["airline_name"],
            "arrival_date": data["arrival_datetime"].date().strftime('%M:%D:%Y'),
            "arrival_time": data["arrival_datetime"].time().strftime('%H:%M:%S'),
            "arr_airport_name": data["airport_name"],
            "arr_city": data["city"],
            "dep_airport_name": data["dep_airport.airport_name"],
            "dep_city": data["dep_airport.city"],
            "price": data["base_price"],
        }
        flights.append(flight)
    if isOneWay == "true":
        cursor.close()
        return jsonify(flights)
    else:
        return_date = request.form["return_date"]
        query2 = (
            "SELECT flight_num, departure_datetime, airline_name,"
            " arrival_datetime, "
            + "arr_airport.airport_name, arr_airport.city,"
            " dep_airport.airport_name, dep_airport.city, base_price "
            + "FROM Flight INNER JOIN Airport as arr_airport ON"
            " Flight.arrival_airport_code = arr_airport.airport_code "
            + "INNER JOIN Airport as dep_airport ON"
            " Flight.departure_airport_code = dep_airport.airport_code "
            + "WHERE departure_datetime > CURRENT_TIMESTAMP"
        )
        params2 = ()

        if dep_city != "":
            query2 += " and arr_airport.city = %s"
            params2 += (dep_city,)
        if dep_airport_name != "":
            query2 += " and arr_airport.airport_name = %s"
            params2 += (dep_airport_name,)
        if arr_city != "":
            query2 += " and dep_airport.city = %s"
            params2 += (arr_city,)
        if arr_airport_name != "":
            query2 += " and dep_airport.airport_name = %s"
            params2 += (arr_airport_name,)
        if departure_date != "":
            query2 += " and departure_datetime = %s"
            params2 += (return_date,)

        cursor.execute(query2, params2)

        data_array2 = cursor.fetchall()
        for data in data_array2:
            flight = {
                "flight_num": data["flight_num"],
                "departure_date": data["departure_datetime"].date().strftime('%M:%D:%Y'),
                "departure_time": data["departure_datetime"].time().strftime('%H:%M:%S'),
                "airline_name": data["airline_name"],
                "arrival_date": data["arrival_datetime"].date().strftime('%M:%D:%Y'),
                "arrival_time": data["arrival_datetime"].time().strftime('%H:%M:%S'),
                "arr_airport_name": data["airport_name"],
                "arr_city": data["city"],
                "dep_airport_name": data["dep_airport.airport_name"],
                "dep_city": data["dep_airport.city"],
                "price": data["base_price"],
            }
            flights.append(flight)

        cursor.close()
        print(flights)
        return jsonify(flights)


@app.route("/check_flight_status", methods=["GET", "POST"])
def check_flight_status():
    airline_name = request.form["airline_name"]
    flight_num = request.form["flight_num"]
    dep_date = request.form["dep_date"].replace("T", " ") + ":00"
    cursor = conn.cursor()

    query = (
        "SELECT status FROM Flight "
        + "WHERE airline_name = %s AND flight_num = %s AND departure_datetime"
        " = %s"
    )

    cursor.execute(query, (airline_name, int(flight_num), dep_date))
    data = cursor.fetchone()
    print(data)
    if data:
        return {"status": data["status"]}
    else:
        return {"status": "empty"}


if __name__ == "__main__":
    app.run(debug=True)
