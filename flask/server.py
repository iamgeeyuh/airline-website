# TODO: HASH PASSWORDS!!!!!!!!

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
import datetime
import random
import uuid
from datetime import datetime

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
        # get the first_name of the customer
        query = (
            "SELECT fname, email FROM Customer WHERE email = %s and password"
            " = %s"
        )

    else:
        # get the airline_name of the staff
        query = (
            "SELECT fname, airline_name FROM Staff WHERE username = %s and"
            " password = %s"
        )

    cursor.execute(query, (username, password))

    data = cursor.fetchone()
    cursor.close()
    if data:
        # creates a session for the user
        # session is a built-in Flask variable
        session["user"] = True
        if isCustomer == "true":
            return {
                "user": True,
                "firstName": data["fname"],
                "email": data["email"],
                "airlineName": None,
            }  # TODO:redirect to the home page in front end for testing
        else:
            return {
                "user": True,
                "firstName": data["fname"],
                "email": None,
                "airlineName": data["airline_name"],
            }  # TODO:redirect to the home page in front end for testing
    else:
        return {
            "user": False,
            "firstName": None,
            "email": None,
            "airlineName": None,
        }


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
            "departure_date": str(data["departure_datetime"].date()).replace(
                "00:00:00 GMT", ""
            ),
            "departure_time": data["departure_datetime"]
            .time()
            .strftime("%H:%M:%S"),
            "airline_name": data["airline_name"],
            "arrival_date": str(data["arrival_datetime"].date()).replace(
                "00:00:00 GMT", ""
            ),
            "arrival_time": data["arrival_datetime"]
            .time()
            .strftime("%H:%M:%S"),
            "arr_airport_name": data["airport_name"],
            "arr_city": data["city"],
            "dep_airport_name": data["dep_airport.airport_name"],
            "dep_city": data["dep_airport.city"],
            "price": data["base_price"],
        }
        flights.append(flight)
    if isOneWay == "true":
        cursor.close()
        print(flights)
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
                "departure_date": str(
                    data["departure_datetime"].date()
                ).replace("00:00:00 GMT", ""),
                "departure_time": data["departure_datetime"]
                .time()
                .strftime("%H:%M:%S"),
                "airline_name": data["airline_name"],
                "arrival_date": str(data["arrival_datetime"].date()).replace(
                    "00:00:00 GMT", ""
                ),
                "arrival_time": data["arrival_datetime"]
                .time()
                .strftime("%H:%M:%S"),
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
    cursor.close()
    print(data)
    if data:
        return {"status": data["status"]}
    else:
        return {"status": "empty"}


# staff
# TODO: 1, 6, 7, 8, 9, 10, testings for all


@app.route("/view_passengers", methods=["GET", "POST"])
def view_passengers():
    flight_num = request.form["flight_num"]
    airline_name = request.form["airline_name"]
    departure_datetime = request.form["dep_datetime"]
    print(departure_datetime)

    cursor = conn.cursor()

    query = (
        "SELECT Customer.fname as fname,"
        " Customer.email as email FROM Customer INNER JOIN Ticket ON"
        " Ticket.email = Customer.email INNER JOIN Flight ON"
        " Flight.airline_name = Ticket.airline_name AND Flight.flight_num ="
        " Ticket.flight_num AND Flight.departure_datetime ="
        " Ticket.departure_datetime WHERE Flight.flight_num = %s AND"
        " Flight.airline_name = %s AND Flight.departure_datetime = %s;"
    )

    print(flight_num, airline_name, departure_datetime)

    cursor.execute(query, (flight_num, airline_name, departure_datetime))
    data = cursor.fetchall()
    names =[]
    for elem in data:
        names.append(elem)

    cursor.close()

    return jsonify(names)


# 1 View flights done include key in output
# return all flights that are departing within 30 days
@app.route("/view_flights", methods=["GET", "POST"])
def view_flights():
    airline_name = request.form["airline_name"]
    cursor = conn.cursor()
    # check if the airline exists
    query = "SELECT airline_name FROM Airline WHERE airline_name = %s"
    cursor.execute(query, (airline_name))
    data = cursor.fetchone()
    if not data:
        return jsonify([])

    # display flights
    query1 = (
        "SELECT flight_num, departure_datetime, airline_name,"
        + " arrival_datetime, "
        + "arr_airport.airport_name, arr_airport.city,"
        + " dep_airport.airport_name, dep_airport.city, base_price "
        + "FROM Flight INNER JOIN Airport as arr_airport ON"
        + " Flight.arrival_airport_code = arr_airport.airport_code "
        + "INNER JOIN Airport as dep_airport ON"
        + " Flight.departure_airport_code = dep_airport.airport_code "
        + "WHERE departure_datetime > CURRENT_TIMESTAMP AND "
        + "TIMESTAMPDIFF(SECOND, departure_datetime, NOW()) <= (30 * 60)"
        + "AND airline_name = %s"
    )

    cursor.execute(query1, (airline_name))
    data_array2 = cursor.fetchall()
    flights = []
    for data in data_array2:
        flight = {
            "flight_num": data["flight_num"],
            "departure_date": str(data["departure_datetime"].date()).replace(
                "00:00:00 GMT", ""
            ),
            "departure_time": data["departure_datetime"]
            .time()
            .strftime("%H:%M:%S"),
            "airline_name": data["airline_name"],
            "arrival_date": str(data["arrival_datetime"].date()).replace(
                "00:00:00 GMT", ""
            ),
            "arrival_time": data["arrival_datetime"]
            .time()
            .strftime("%H:%M:%S"),
            "arr_airport_name": data["airport_name"],
            "arr_city": data["city"],
            "dep_airport_name": data["dep_airport.airport_name"],
            "dep_city": data["dep_airport.city"],
            "price": data["base_price"],
        }
        flights.append(flight)
    conn.commit()
    cursor.close()

    return jsonify(flights)


@app.route("/staff_view_flights", methods=["GET", "POST"])
def staff_view_flights():
    src_city = request.form["src_city"]
    src_airport = request.form["src_airport"]
    dst_city = request.form["dst_city"]
    dst_airport = request.form["dst_airport"]
    start = request.form["start"]
    end = request.form["end"]
    airline_name = request.form["airline_name"]

    cursor = conn.cursor()

    query = (
        "SELECT f.flight_num, f.departure_datetime, f.airline_name,"
        " f.arrival_datetime, a1.airport_name as arrival_airport_name, a1.city"
        " as arrival_city, a2.airport_name as departure_airport_name, a2.city"
        " as departure_city, f.base_price as price FROM Flight f JOIN Airport"
        " a1 ON f.departure_airport_code = a1.airport_code AND a1.airport_name"
        " = %s AND a1.city = %s JOIN Airport a2 ON f.arrival_airport_code ="
        " a2.airport_code AND a2.airport_name = %s AND a2.city = %s WHERE"
        " f.departure_datetime BETWEEN %s AND %s AND airline_name = %s"
    )

    cursor.execute(
        query,
        (
            src_airport,
            src_city,
            dst_airport,
            dst_city,
            start,
            end,
            airline_name,
        ),
    )

    data_array = cursor.fetchall()
    flights = []
    print(data_array)

    for data in data_array:
        flight = {
            "flight_num": data["flight_num"],
            "departure_date": str(data["departure_datetime"].date()).replace(
                "00:00:00 GMT", ""
            ),
            "departure_time": data["departure_datetime"]
            .time()
            .strftime("%H:%M:%S"),
            "airline_name": data["airline_name"],
            "arrival_date": str(data["arrival_datetime"].date()).replace(
                "00:00:00 GMT", ""
            ),
            "arrival_time": data["arrival_datetime"]
            .time()
            .strftime("%H:%M:%S"),
            "arr_airport_name": data["arrival_airport_name"],
            "arr_city": data["arrival_city"],
            "dep_airport_name": data["departure_airport_name"],
            "dep_city": data["departure_city"],
            "price": data["price"],
        }
        flights.append(flight)

    conn.commit()
    cursor.close()

    return jsonify(flights)


# 2 Create flight
# return all flights that will depart within 30 days
@app.route("/create_flight", methods=["GET", "POST"])
def create_flight():
    cursor = conn.cursor()

    airline_name = request.form["airline_name"]
    flight_num = request.form["flight_num"]
    airplane_id = request.form["airplane_id"]
    departure_datetime = request.form["departure_datetime"]
    departure_airport_code = request.form["departure_airport_code"]
    arrival_datetime = request.form["arrival_datetime"]
    arrival_airport_code = request.form["arrival_airport_code"]
    base_price = request.form["base_price"]
    status = request.form["status"]

    query = (
        "SELECT * FROM Flight WHERE flight_num = %s AND airline_name = %s AND"
        " departure_datetime = %s;"
    )

    cursor.execute(query, (flight_num, airline_name, departure_datetime))
    flight = cursor.fetchone()

    query2 = "SELECT * FROM Airplane WHERE airplane_id = %s"
    cursor.execute(query2, (airplane_id))
    airplane = cursor.fetchone()

    query3 = "SELECT * FROM Airport WHERE airport_code = %s;"
    cursor.execute(query3, (arrival_airport_code))
    airport1 = cursor.fetchone()

    query4 = "SELECT * FROM Airport WHERE airport_code = %s;"
    cursor.execute(query4, (departure_airport_code))
    airport2 = cursor.fetchone()

    if (
        flight
        or airplane == None
        or airport1 == None
        or airport2 == None
        or departure_airport_code == arrival_airport_code
        or int(base_price) < 0
    ):
        return {"valid": False}

    # insert new data. if the value(s) is invalid, return the flights info
    # that will be displayed

    # check if both airports exist

    query2 = "INSERT INTO Flight VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    cursor.execute(
        query2,
        (
            flight_num,
            departure_datetime,
            airline_name,
            arrival_datetime,
            arrival_airport_code,
            departure_airport_code,
            airplane_id,
            base_price,
            status,
        ),
    )

    conn.commit()
    cursor.close()

    return {"valid": True}


# 3 change flight status works
# return if change_status is successful
@app.route("/change_status", methods=["GET", "POST"])
def change_status():
    flight_num = request.form["flight_num"]
    airline_name = request.form["airline_name"]
    departure_datetime = request.form["departure_datetime"]
    new_status = request.form["new_status"]
    cursor = conn.cursor()
    # check if flight exists
    query = (
        "SELECT airline_name, flight_num FROM Flight WHERE airline_name = %s"
        " AND flight_num = %s AND departure_datetime = %s"
    )
    cursor.execute(query, (airline_name, flight_num, departure_datetime))
    data = cursor.fetchone()
    if not data:
        return {"change_status": False}
    query = (
        "UPDATE Flight SET status = %s"
        + "WHERE flight_num = %s AND departure_datetime = %s AND airline_name"
        " = %s"
    )
    cursor.execute(
        query, (new_status, flight_num, departure_datetime, airline_name)
    )
    conn.commit()
    cursor.close()
    return {"change_status": True}


# 4 Add new airplane in the system works
# return all airplanes owned by the airline
@app.route("/add_airplane", methods=["GET", "POST"])
def add_airplane():
    cursor = conn.cursor()
    airline_name = request.form["airline_name"]
    airplane_id = request.form["airplane_id"]
    manufacturer = request.form["manufacturer"]
    manufacturing_date = request.form["manufacturing_date"]
    seats = request.form["seats"]
    current_year = int(datetime.now().year)

    # check if the airplane exists. If it exists, do not insert again

    query1 = "SELECT airline_name FROM Airplane WHERE airplane_id = %s"
    cursor.execute(query1, (airplane_id))
    data1 = cursor.fetchone()
    if data1:
        return jsonify([])

    query2 = "INSERT INTO Airplane VALUES(%s, %s, %s, %s, %s, %s)"
    cursor.execute(
        query2,
        (
            airplane_id,
            airline_name,
            seats,
            manufacturing_date,
            manufacturer,
            str(current_year - int(manufacturing_date[0:4])),
        ),
    )
    query3 = "SELECT * FROM Airplane WHERE airline_name = %s"
    cursor.execute(query3, (airline_name))
    airplanes = cursor.fetchall()
    conn.commit()
    cursor.close()

    return jsonify(airplanes)


# 5 Add a new airport in the system works
# return if the addition is successful
@app.route("/add_airport", methods=["GET", "POST"])
def add_airport():
    airport_code = request.form["airport_code"]
    airport_name = request.form["airport_name"]
    airport_type = request.form["airport_type"]
    city = request.form["city"]
    country = request.form["country"]

    cursor = conn.cursor()

    query = "SELECT airport_code FROM Airport WHERE airport_code = %s"
    cursor.execute(query, (airport_code))
    data = cursor.fetchone()
    if data:
        return {"add_airport": False}  # Duplicate data

    query2 = "INSERT INTO Airport VALUES(%s, %s, %s, %s, %s)"
    cursor.execute(
        query2, (airport_code, airport_name, city, country, airport_type)
    )

    conn.commit()
    cursor.close()

    return {"add_airport": True}


# 6. View flight ratings:
@app.route("/view_flight_ratings", methods=["POST"])
def view_flight_ratings():
    cursor = conn.cursor()
    flight_num = request.form["flight_num"]
    airline_name = request.form["airline_name"]
    departure_datetime = request.form["dep_datetime"]

    query = (
    "SELECT Customer.fname, Customer.lname, Reviews.rating, Reviews.comment FROM Customer INNER JOIN Ticket ON Customer.email = Ticket.email INNER JOIN Reviews ON Ticket.ticket_id = Reviews.ticket_id WHERE Ticket.flight_num = %s AND Ticket.airline_name = %s AND Ticket.departure_datetime = %s AND Reviews.rating IS NOT NULL OR Reviews.comment IS NOT NULL;"
    )

    cursor.execute(query, (flight_num, airline_name, departure_datetime))
    datas = cursor.fetchall()
    rates = []
    for data in datas:
        rate = {
            "name": data["fname"],
            "review": data["comment"],
            "rating": data["rating"],
        }
        rates.append(rate)

    query2 = (
        "SELECT AVG(rating) AS avg_rating FROM Reviews INNER JOIN Ticket ON"
        " Reviews.ticket_id = Ticket.ticket_id INNER JOIN Flight ON"
        " Ticket.flight_num = Flight.flight_num AND Ticket.airline_name ="
        " Flight.airline_name AND Ticket.departure_datetime ="
        " Flight.departure_datetime WHERE Flight.flight_num = %s AND"
        " Flight.airline_name = %s AND Flight.departure_datetime = %s"
    )

    cursor.execute(query2, (flight_num, airline_name, departure_datetime))
    data2 = cursor.fetchall()
    conn.commit()
    cursor.close()
    if data2[0]["avg_rating"] == None:
        data2[0]["avg_rating"] = 0

    return jsonify({"rates": rates, "avg_rating": data2[0]["avg_rating"]})


# 7. View frequent customers partially done query is not correct.... needs to be modified
@app.route("/frequent_customers", methods=["POST"])
def frequent_customers():
    cursor = conn.cursor()
    airline_name = request.form["airline_name"]
    # Get most frequent customer
    query_frequent_customer = (
        "SELECT Customer.fname, Customer.lname,"
        " COUNT(Ticket.ticket_id) AS num_tickets FROM Customer INNER JOIN"
        " Ticket ON Customer.email = Ticket.email WHERE Ticket.airline_name ="
        " %s AND Ticket.purchase_datetime >= DATE_SUB(NOW(), INTERVAL 1 YEAR)"
        " GROUP BY Customer.email, Customer.fname, Customer.lname ORDER BY"
        " num_tickets DESC LIMIT 1;"
    )

    cursor.execute(query_frequent_customer, (airline_name))
    customer_flights = cursor.fetchone()

    cursor.close()
    return {
        "fname": customer_flights["fname"],
        "lname": customer_flights["lname"],
    }


@app.route("/view_customers", methods=["POST"])
def view_customers():
    email = request.form["email"]
    airline_name = request.form["airline_name"]

    cursor = conn.cursor()

    query = (
        "SELECT Flight.flight_num, Flight.departure_datetime, dep_airport.city"
        " as dep_city, dep_airport.airport_name as dep_airport,"
        " Flight.arrival_datetime, arr_airport.city as arr_city,"
        " arr_airport.airport_name as arr_airport, Ticket.sold_price FROM"
        " Flight INNER JOIN Ticket ON Flight.flight_num = Ticket.flight_num AND"
        " Flight.airline_name = Ticket.airline_name AND"
        " Flight.departure_datetime = Ticket.departure_datetime INNER JOIN"
        " Airport as dep_airport ON Flight.departure_airport_code ="
        " dep_airport.airport_code INNER JOIN Airport as arr_airport ON"
        " Flight.arrival_airport_code = arr_airport.airport_code WHERE"
        " Ticket.email = %s AND Flight.airline_name = %s"
    )

    cursor.execute(query, (email, airline_name))
    data_array = cursor.fetchall()
    flights = []
    for data in data_array:
        flight = {
            "flight_num": data["flight_num"],
            "departure_date": str(data["departure_datetime"].date()).replace(
                "00:00:00 GMT", ""
            ),
            "departure_time": data["departure_datetime"]
            .time()
            .strftime("%H:%M:%S"),
            "airline_name": airline_name,
            "arrival_date": str(data["arrival_datetime"].date()).replace(
                "00:00:00 GMT", ""
            ),
            "arrival_time": data["arrival_datetime"]
            .time()
            .strftime("%H:%M:%S"),
            "arr_airport_name": data["arr_airport"],
            "arr_city": data["arr_city"],
            "dep_airport_name": data["dep_airport"],
            "dep_city": data["dep_city"],
            "price": data["sold_price"],
        }
        flights.append(flight)
    conn.commit()
    cursor.close()

    return jsonify(flights)


@app.route("/revenue", methods=["POST"])
def revenue():
    airline_name = request.form["airline_name"]
    cursor = conn.cursor()

    query1 = (
        "SELECT SUM(sold_price) AS total_revenue FROM Ticket WHERE airline_name"
        " = %s AND departure_datetime BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH)"
        " AND NOW();"
    )
    cursor.execute(query1, (airline_name))
    month = cursor.fetchone()

    query2 = (
        "SELECT SUM(sold_price) AS total_revenue FROM Ticket WHERE airline_name"
        " = %s AND departure_datetime BETWEEN DATE_SUB(NOW(), INTERVAL 1 YEAR)"
        " AND NOW();"
    )
    cursor.execute(query2, (airline_name))
    year = cursor.fetchone()

    return {"year": year["total_revenue"], "month": month["total_revenue"]}


# Use case 8... sales report
@app.route("/total_tickets", methods=["GET", "POST"])
def view_ticket_sales_report():
    airline_name = request.form["airline_name"]
    start = request.form["start"]
    end = request.form["end"]
    print(start, end)

    # cursor used to send queries
    cursor = conn.cursor()

    query = (
        "SELECT COUNT(*) as total_tickets_sold FROM Ticket WHERE airline_name ="
        " %s AND purchase_datetime BETWEEN %s AND %s;"
    )
    cursor.execute(query, (airline_name, start, end))
    tickets = cursor.fetchone()

    query2 = ("SELECT CONCAT(MONTH(purchase_datetime), '/', YEAR(purchase_datetime))"
        " as label, COUNT(*) as tickets FROM Ticket WHERE airline_name = %s AND"
        " purchase_datetime BETWEEN %s AND %s GROUP BY YEAR(purchase_datetime),"
        " MONTH(purchase_datetime) ORDER BY YEAR(purchase_datetime),"
        " MONTH(purchase_datetime);"
    )
    cursor.execute(query2, (airline_name, start, end))
    data = cursor.fetchall()
    return {"tickets": tickets["total_tickets_sold"], "months": data}


# 10 logout
@app.route("/logout")
def logout():
    session.pop("user", None)
    return jsonify([])


# Customer use cases

# # Use case 1. my_flights
# @app.route("/myflights", methods=["GET", "POST"])
# def my_flights():
#     print(request.form)
#     customer_email = request.form["customer_email"]
#     cursor = conn.cursor()
#     query = (
#         "SELECT flight_num, departure_datetime, airline_name,"
@app.route("/prev_flights", methods=["GET", "POST"])
def prev_flights():
    customer_email = request.form["customer_email"]
    cursor = conn.cursor()
    query = (
        "SELECT Flight.flight_num, Flight.departure_datetime, dep_airport.city"
        " AS departure_city, dep_airport.airport_name AS departure_airport,"
        " Flight.airline_name, Flight.arrival_datetime, arr_airport.city AS"
        " arrival_city, arr_airport.airport_name AS arrival_airport,"
        " Ticket.sold_price, Ticket.ticket_id FROM Ticket INNER JOIN Flight ON"
        " Ticket.airline_name = Flight.airline_name AND Ticket.flight_num ="
        " Flight.flight_num AND Ticket.departure_datetime ="
        " Flight.departure_datetime INNER JOIN Airport AS dep_airport ON"
        " Flight.departure_airport_code = dep_airport.airport_code INNER JOIN"
        " Airport AS arr_airport ON Flight.arrival_airport_code ="
        " arr_airport.airport_code WHERE Ticket.email = %s AND"
        " Flight.arrival_datetime <= CURRENT_TIMESTAMP;"
    )
    cursor.execute(query, (customer_email))
    data_array = cursor.fetchall()
    flights = []
    for data in data_array:
        flight = {
            "flight_num": data["flight_num"],
            "departure_date": str(data["departure_datetime"].date()).replace(
                "00:00:00 GMT", ""
            ),
            "departure_time": data["departure_datetime"]
            .time()
            .strftime("%H:%M:%S"),
            "airline_name": data["airline_name"],
            "arrival_date": str(data["arrival_datetime"].date()).replace(
                "00:00:00 GMT", ""
            ),
            "arrival_time": data["arrival_datetime"]
            .time()
            .strftime("%H:%M:%S"), "arr_airport_name": data["arrival_airport"],
            "arr_city": data["arrival_city"],
            "dep_airport_name": data["departure_airport"],
            "dep_city": data["departure_city"],
            "price": data["sold_price"],
            "ticket_id": data["ticket_id"],
        }
        flights.append(flight)
    cursor.close()
    return jsonify(flights)


# queries database to find all of customer's future flights
@app.route("/future_flights", methods=["GET", "POST"])
def future_flights():
    customer_email = request.form["customer_email"]
    cursor = conn.cursor()
    query = (
        "SELECT Flight.flight_num, Flight.departure_datetime, dep_airport.city"
        " AS departure_city, dep_airport.airport_name AS departure_airport,"
        " Flight.airline_name, Flight.arrival_datetime, arr_airport.city AS"
        " arrival_city, arr_airport.airport_name AS arrival_airport,"
        " Ticket.sold_price, Ticket.ticket_id FROM Ticket INNER JOIN Flight ON"
        " Ticket.airline_name = Flight.airline_name AND Ticket.flight_num ="
        " Flight.flight_num AND Ticket.departure_datetime ="
        " Flight.departure_datetime INNER JOIN Airport AS dep_airport ON"
        " Flight.departure_airport_code = dep_airport.airport_code INNER JOIN"
        " Airport AS arr_airport ON Flight.arrival_airport_code ="
        " arr_airport.airport_code WHERE Ticket.email = %s AND"
        " Flight.departure_datetime > CURRENT_TIMESTAMP;"
    )
    cursor.execute(query, (customer_email))
    data_array = cursor.fetchall()
    flights = []
    for data in data_array:
        flight = {
            "flight_num": data["flight_num"],
            "departure_date": str(data["departure_datetime"].date()).replace(
                "00:00:00 GMT", ""
            ),
            "departure_time": data["departure_datetime"]
            .time()
            .strftime("%H:%M:%S"),
            "airline_name": data["airline_name"],
            "arrival_date": str(data["arrival_datetime"].date()).replace(
                "00:00:00 GMT", ""
            ),
            "arrival_time": data["arrival_datetime"]
            .time()
            .strftime("%H:%M:%S"),"arr_airport_name": data["arrival_airport"],
            "arr_city": data["arrival_city"],
            "dep_airport_name": data["departure_airport"],
            "dep_city": data["departure_city"],
            "price": data["sold_price"],
            "ticket_id": data["ticket_id"],
        }
        flights.append(flight)
    cursor.close()
    return jsonify(flights)


@app.route("/search_flight_customer", methods=["GET", "POST"])
def search_flight_customer():
    cursor = conn.cursor()
    params = request.form
    flights = []
    query = (
        "SELECT flight_num, departure_datetime, airline_name,"
        " arrival_datetime, "
        + "arr_airport.airport_name, arr_airport.city,"
        " dep_airport.airport_name, dep_airport.city, base_price "
        + "FROM Flight INNER JOIN Airport as arr_airport ON"
        " Flight.arrival_airport_code = arr_airport.airport_code "
        + "INNER JOIN Airport as dep_airport ON Flight.departure_airport_code ="
        " dep_airport.airport_code "
        + "WHERE departure_datetime > CURRENT_TIMESTAMP and"
    )
    queries = ()
    if params["source city"]:
        query += " dep_airport.city = %s and"
        queries += (params["source city"],)
    if params["destination city"]:
        query += " arr_airport.city = %s and"
        queries += (params["destination city"],)
    if params["source airport"]:
        query += " dep_airport.airport_name = %s and"
        queries += (params["source airport"],)
    if params["destination airport"]:
        query += " arr_airport.airport_name = %s and"
        queries += (params["destination airport"],)
    if params["departure date"]:
        query += " DATE(departure_datetime) = %s and"
        queries += (params["departure date"],)
    if query[-4:] == " and":
        query = query[:-4]  # cut the trailing ' and'\

    cursor.execute(query, queries)
    data_array = cursor.fetchall()
    for data in data_array:
        flight = {
            "flight_num": data["flight_num"],
            "departure_date": str(data["departure_datetime"].date()).replace(
                "00:00:00 GMT", ""
            ),
            "departure_time": data["departure_datetime"]
            .time()
            .strftime("%H:%M:%S"),
            "airline_name": data["airline_name"],
            "arrival_date": str(data["arrival_datetime"].date()).replace(
                "00:00:00 GMT", ""
            ),
            "arrival_time": data["arrival_datetime"]
            .time()
            .strftime("%H:%M:%S"),
            "arr_airport_name": data["airport_name"],
            "arr_city": data["city"],
            "dep_airport_name": data["dep_airport.airport_name"],
            "dep_city": data["dep_airport.city"],
            "price": data["base_price"],
        }
        flights.append(flight)

    ret_data = None
    if params[
        "return date"
    ]:  # I assume a return date means the user wants to come back to the airport from which they departed
        return_query = (
            "SELECT flight_num, departure_datetime, airline_name,"
            " arrival_datetime, "
            + "arr_airport.airport_name, arr_airport.city,"
            " dep_airport.airport_name, dep_airport.city, base_price "
            + "FROM Flight INNER JOIN Airport as arr_airport ON"
            " Flight.arrival_airport_code = arr_airport.airport_code "
            + "INNER JOIN Airport as dep_airport ON"
            " Flight.departure_airport_code = dep_airport.airport_code "
            + "WHERE departure_datetime > CURRENT_TIMESTAMP and"
        )
        ret_queries = ()
        if params["source city"]:
            return_query += " arr_airport.city = %s and"
            ret_queries += (params["source city"],)
        if params["destination city"]:
            return_query += " dep_airport.city = %s and"
            ret_queries += (params["destination city"],)
        if params["source airport"]:
            return_query += "arr_airport.airport_name = %s and"
            ret_queries += (params["source airport"],)
        if params["destination airport"]:
            return_query += " dep_airport.airport_name = %s and"
            ret_queries += (params["destination airport"],)
        return_query += " DATE(departure_datetime) = %s"
        ret_queries += (params["return date"],)
        cursor.execute(return_query, ret_queries)
        ret_data = cursor.fetchall()
        for data in ret_data:
            flight = {
                "flight_num": data["flight_num"],
                "departure_date": str(
                    data["departure_datetime"].date()
                ).replace("00:00:00 GMT", ""),
                "departure_time": data["departure_datetime"]
                .time()
                .strftime("%H:%M:%S"),
                "airline_name": data["airline_name"],
                "arrival_date": str(data["arrival_datetime"].date()).replace(
                    "00:00:00 GMT", ""
                ),
                "arrival_time": data["arrival_datetime"]
                .time()
                .strftime("%H:%M:%S"),
                "arr_airport_name": data["airport_name"],
                "arr_city": data["city"],
                "dep_airport_name": data["dep_airport.airport_name"],
                "dep_city": data["dep_airport.city"],
                "price": data["base_price"],
            }
        flights.append(flight)
        # print(return_query, ret_data)
    cursor.close()
    print(flights)
    return jsonify(flights)


@app.route("/purchase_tickets", methods=["GET", "POST"])
def purchase_tickets():
    print(request.form)
    cursor = conn.cursor()

    # Get data from form
    customer_email = request.form["email"]
    flight_num = request.form["flight_num"]
    airline_name = request.form["airline_name"]
    dep_timestamp = request.form["dep_timestamp"]
    card_type = request.form["card_type"]
    card_num = request.form["card_num"]
    card_name = request.form["card_name"]
    # sold_price = request.form["price"]
    # ticket_id = request.form['ticket_id']
    exp_date = request.form["card_exp"]

    # Check if ticket has already been purchased
    query = (
        "SELECT * FROM Ticket WHERE flight_num = %s AND airline_name = %s AND"
        " departure_datetime = %s AND email = %s"
    )
    cursor.execute(
        query, (flight_num, airline_name, dep_timestamp, customer_email)
    )
    data = cursor.fetchone()

    if data:
        return jsonify({"valid": False})


    # Calculate price of ticket
    query = (
        "SELECT seats, base_price FROM Airplane NATURAL JOIN Flight WHERE"
        " flight_num = %s AND airline_name = %s AND departure_datetime = %s"
    )
    cursor.execute(query, (flight_num, airline_name, dep_timestamp))
    data = cursor.fetchone()


    if not data:
        return jsonify({"valid": False})

    total_seats = data["seats"]
    base_price = float(data["base_price"])

    # Check if the tickets were sold out
    query = (
        "SELECT COUNT(ticket_id) as total FROM Ticket WHERE flight_num = %s AND"
        " departure_datetime = %s AND airline_name = %s"
    )
    cursor.execute(query, (flight_num, dep_timestamp, airline_name))

    tix_purchased = cursor.fetchone()["total"]

    if tix_purchased >= total_seats:
        return jsonify(
            {"valid": False}
        )

    if tix_purchased / total_seats >= 0.6:
        sold_price = base_price * 1.25
    else:
        sold_price = base_price


    query = "SELECT DISTINCT ticket_id FROM Ticket"
    cursor.execute(query,())
    data = cursor.fetchall()
    if not data:
        ticket_id = 0
    else:
        ticket_id = max([dct["ticket_id"] for dct in data])+1
    

    # Insert purchase into database
    ins = (
        "INSERT INTO Ticket VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP, %s)"
    )
    cursor.execute(
        ins,
        (
            ticket_id,
            airline_name,
            flight_num,
            dep_timestamp,
            sold_price,
            card_type,
            card_name,
            card_num,
            exp_date,
            customer_email,
        ),
    )

    conn.commit()
    cursor.close()

    return jsonify({"valid": True})



@app.route("/display_cancel_trip", methods=["GET", "POST"])
def display_cancel_trip():
    cursor = conn.cursor()
    customer_email = request.form["email"]
    flight_num = request.form["flight_num"]
    airline_name = request.form["airline_name"]
    dep_timestamp = request.form["dep_timestamp"]
    ticket_id = request.form["ticket_id"]

    # only shows flights more than 24 hours in the future so a user cannot cancel a flight that occurs in under 24 hours
    query = (
        "DELETE FROM Ticket WHERE ticket_id = %s AND flight_num = %s AND departure_datetime = %s AND airline_name = %s AND email = %s"
    )
    cursor.execute(query, (ticket_id, flight_num, dep_timestamp, airline_name, customer_email))
    
    if cursor.rowcount > 0:
        conn.commit()
        return jsonify({'success': True})   
    else:
        return jsonify({'success': False})

@app.route("/view_rate_comment", methods=["POST"])
def view_rate_comment():
    customer_email = request.form['customer_email']
    ticket_id = request.form['ticket_id']
    # validate user and flight details
    cursor = conn.cursor()
    query = "SELECT rating, comment FROM Reviews WHERE ticket_id = %s AND email = %s"
    cursor.execute(query, (ticket_id, customer_email))
    data = cursor.fetchall()
    if data:
        return jsonify({"rating":data['rating'], "comment": data['comment']})
    else: 
        return jsonify({"rating": None, "comment": None})
        
@app.route("/rate_comment", methods=["POST"])
def rate_comment():
    # get parameters from request body
    customer_email = request.form['customer_email']
    rating = request.form['rating']
    comment = request.form['comment']
    ticket_id = request.form['ticket_id']
    # validate user and flight details
    cursor = conn.cursor()
    
    # if rating == "" and comment == "":
    #     query = "SELECT rating, comment FROM Reviews WHERE ticket_id = %s AND email = %s"
    #     cursor.execute(query, (ticket_id, customer_email))
    #     data = cursor.fetchall()
    #     if data:
    #         return jsonify({"rating":data['rating'], "comment": data['comment']})
    #     else: 
    #         return jsonify({"rating": None, "comment": None})
        
    query = 'SELECT * FROM Ticket WHERE email = %s and ticket_id = %s'
    cursor.execute(query, (customer_email, ticket_id))
    data = cursor.fetchone()
    
    if not data:
        return jsonify({})
    
    query = 'SELECT * FROM Ticket INNER JOIN Reviews ON Ticket.email = Reviews.email WHERE Ticket.email = %s and Ticket.ticket_id = %s'
    cursor.execute(query, (customer_email, ticket_id))
    data = cursor.fetchone()
    
    if data:
        query = "DELETE FROM Reviews WHERE ticket_id = %s AND email = %s"
        cursor.execute(query, (ticket_id, customer_email))
        conn.commit()
    
    # insert rating and comment
    query = 'INSERT INTO Reviews VALUES (%s, %s, %s, %s)'
    cursor.execute(query, (customer_email, ticket_id, rating, comment))
    conn.commit()
    cursor.close()
    return jsonify({})


@app.route("/track_spend", methods=["GET", "POST"])
def track_spend():
    cursor = conn.cursor()
    customer_email = request.form["customer_email"]
    start = request.form["start"]
    end = request.form["end"]

    query1="SELECT SUM(sold_price) AS total_spent FROM Ticket WHERE email = %s AND purchase_datetime BETWEEN %s AND %s;"
    cursor.execute(query1, (customer_email, start, end))
    spending = cursor.fetchone()

    query = "SELECT CONCAT(MONTH(purchase_datetime), '/', YEAR(purchase_datetime)) AS label, SUM(sold_price) AS tickets FROM Ticket WHERE email = %s AND purchase_datetime BETWEEN %s AND %s GROUP BY MONTH(purchase_datetime), YEAR(purchase_datetime) ORDER BY YEAR(purchase_datetime), MONTH(purchase_datetime)"
    cursor.execute(query, (customer_email, start, end))
    data = cursor.fetchall()

    print({"spending": spending["total_spent"], "months": data})

    return {"spending": spending["total_spent"], "months": data}

@app.route("/default_spending", methods=["POST"])
def default_spending():
    cursor = conn.cursor()
    customer_email = request.form["customer_email"]

    query1="SELECT SUM(sold_price) AS total_spent FROM Ticket WHERE email = %s AND purchase_datetime BETWEEN DATE_SUB(NOW(), INTERVAL 1 YEAR) AND NOW();"
    cursor.execute(query1, (customer_email))
    spending = cursor.fetchone()

    query = "SELECT CONCAT(MONTH(purchase_datetime), '/', YEAR(purchase_datetime)) AS label, SUM(sold_price) AS tickets FROM Ticket WHERE email = %s AND purchase_datetime BETWEEN DATE_SUB(NOW(), INTERVAL 6 MONTH) AND NOW() GROUP BY MONTH(purchase_datetime), YEAR(purchase_datetime) ORDER BY YEAR(purchase_datetime), MONTH(purchase_datetime)"
    cursor.execute(query, (customer_email))
    data = cursor.fetchall()

    return {"spending": spending["total_spent"], "months": data}

if __name__ == "__main__":
    app.run(debug=True)
