#TODO: HASH PASSWORDS!!!!!!!!

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
        query = "SELECT fname, email FROM Customer WHERE email = %s and password = %s"

    else:
        # get the airline_name of the staff
        query = "SELECT fname, airline_name FROM Staff WHERE username = %s and password = %s"

    cursor.execute(query, (username, password))

    data = cursor.fetchone()
    cursor.close()
    if data:
        # creates a session for the user
        # session is a built-in Flask variable
        session['user'] = True
        if isCustomer == "true": 
            return {
                "user": True,
                "firstName": data['fname'],
                "email": data['email'],
                "airlineName": None
            }  # TODO:redirect to the home page in front end for testing
        else:
            return {
                "user": True,
                "firstName": data['fname'],
                "email": None,
                "airlineName": data['airline_name']
            }  # TODO:redirect to the home page in front end for testing
    else:
        return {"user": False, "firstName": None, "email": None, "airlineName": None}

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
            "departure_date": str(data["departure_datetime"].date()).replace("00:00:00 GMT", ""),
            "departure_time": data["departure_datetime"].time().strftime('%H:%M:%S'),
            "airline_name": data["airline_name"],
            "arrival_date": str(data["arrival_datetime"].date()).replace("00:00:00 GMT", ""),
            "arrival_time": data["arrival_datetime"].time().strftime('%H:%M:%S'),
            "arr_airport_name": data["airport_name"],
            "arr_city": data["city"],
            "dep_airport_name": data["dep_airport.airport_name"],
            "dep_city": data["dep_airport.city"],
            "price": data["base_price"],
        }
        flights.append(flight)
    if isOneWay == "true":
        print(flights)
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
                "departure_date": str(data["departure_datetime"].date()).replace("00:00:00 GMT", ""),
                "departure_time": data["departure_datetime"].time().strftime('%H:%M:%S'),
                "airline_name": data["airline_name"],
                "arrival_date": str(data["arrival_datetime"].date()).replace("00:00:00 GMT", ""),
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


#staff
#TODO: 1, 6, 7, 8, 9, 10, testings for all

#1 View flights done include key in output
# return all flights that are departing within 30 days
@app.route("/view_flights", methods=["GET", "POST"])
def view_flights():
    airline_name = request.form["airline_name"]
    cursor = conn.cursor() 
    #check if the airline exists
    query = "SELECT airline_name FROM Airline WHERE airline_name = %s"
    cursor.execute(query, (airline_name))
    data = cursor.fetchone()
    if not data:
        return jsonify([])
    
    #display flights
    query1 = (
            "SELECT flight_num, departure_datetime, airline_name,"
            +" arrival_datetime, "
            + "arr_airport.airport_name, arr_airport.city,"
            +" dep_airport.airport_name, dep_airport.city, base_price "
            + "FROM Flight INNER JOIN Airport as arr_airport ON"
            +" Flight.arrival_airport_code = arr_airport.airport_code "
            + "INNER JOIN Airport as dep_airport ON"
            +" Flight.departure_airport_code = dep_airport.airport_code "
            + "WHERE departure_datetime > CURRENT_TIMESTAMP AND "
            + "TIMESTAMPDIFF(SECOND, departure_datetime, NOW()) <= (30 * 60)"
            + "AND airline_name = %s"
    )

    cursor.execute(query1, (airline_name))
    flights = cursor.fetchall()
    conn.commit()
    cursor.close()
    return jsonify(flights)

#2 Create flight
# return all flights that will depart within 30 days
@app.route("/create_flight", methods=["GET", "POST"])
def create_flight():
    airline_name = request.form["airline_name"]
    cursor = conn.cursor() 
    #check if the airline exists
    query = "SELECT airline_name FROM Airline WHERE airline_name = %s"
    cursor.execute(query, (airline_name))
    data = cursor.fetchone()
    if not data:
        return jsonify([])
    
    #display flights
    #cursor = conn.cursor() 
    query1 = (
            "SELECT flight_num, departure_datetime, airline_name,"
            +" arrival_datetime, "
            + "arr_airport.airport_name, arr_airport.city,"
            +" dep_airport.airport_name, dep_airport.city, base_price "
            + "FROM Flight INNER JOIN Airport as arr_airport ON"
            +" Flight.arrival_airport_code = arr_airport.airport_code "
            + "INNER JOIN Airport as dep_airport ON"
            +" Flight.departure_airport_code = dep_airport.airport_code "
            + "WHERE departure_datetime > CURRENT_TIMESTAMP AND "
            + "TIMESTAMPDIFF(SECOND, departure_datetime, NOW()) <= (30 * 60)"
            + "AND airline_name = %s"
    )

    cursor.execute(query1, (airline_name))
    flights = cursor.fetchall()


    flight_num = request.form["flight_num"]
    airplane_id = request.form["airplane_id"]
    departure_datetime = request.form["departure_datetime"]
    departure_airport_code = request.form["departure_airport_code"]
    arrival_datetime = request.form["arrival_datetime"]
    arrival_airport_code = request.form["arrival_airport_code"]
    base_price = request.form["base_price"]
    status = request.form["status"]

    if(departure_airport_code == arrival_airport_code):
        return jsonify([])

    # insert new data. if the value(s) is invalid, return the flights info
    # that will be displayed

    #check if both airports exist
    query2 = "SELECT airport_code FROM Airport WHERE airport_code = %s"
    cursor.execute(query2, (departure_airport_code))
    data2 = cursor.fetchone()
    if not data2:
        return jsonify(flights)
    
    query3 = "SELECT airport_code FROM Airport WHERE airport_code = %s"
    cursor.execute(query3, (arrival_airport_code))
    data3 = cursor.fetchone()
    if not data3:
        return jsonify(flights)
    
    #check if airplane id exists
    query4 = "SELECT airplane_id FROM Airplane WHERE airplane_id = %s"
    cursor.execute(query4, (airplane_id))
    data4 = cursor.fetchone()
    if not data4:
        return jsonify(flights)
    
    query5 = "SELECT flight_num, departure_datetime, departure_airport_code, arrival_datetime, arrival_airport_code FROM Flight WHERE flight_num = %s, departure_datetime = %s, departure_airport_code = %s, arrival_datetime = %s, arrival_airport_code = %s "
    cursor.execute(query5, (flight_num, departure_datetime, departure_airport_code, arrival_datetime, arrival_airport_code))
    data5 = cursor.fetchone()
    if not data5:
        return jsonify(flights)
    
    query5 = "INSERT INTO Flight VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    cursor.execute(query5, (
        flight_num, 
        departure_datetime, 
        airline_name,
        arrival_datetime,
        arrival_airport_code,
        departure_airport_code,
        airplane_id,
        base_price,
        status
        ))
    
    conn.commit()
    cursor.close()

    return jsonify(flights)
    

#3 change flight status works
# return if change_status is successful
@app.route("/change_status", methods=["GET", "POST"])
def change_status():
    flight_num = request.form["flight_num"]
    airline_name = request.form["airline_name"]
    departure_datetime = request.form["departure_datetime"]
    new_status = request.form["new_status"]
    cursor = conn.cursor()
    #check if flight exists
    query = "SELECT airline_name, flight_num FROM Flight WHERE airline_name = %s AND flight_num = %s AND departure_datetime = %s"
    cursor.execute(query, (airline_name, flight_num, departure_datetime))
    data = cursor.fetchone()
    if not data:
        return {"change_status": False}
    query = "UPDATE Flight SET status = %s"+\
        "WHERE flight_num = %s AND departure_datetime = %s AND airline_name = %s"
    cursor.execute(query, (new_status, flight_num, departure_datetime, airline_name))
    conn.commit()
    cursor.close()
    return {"change_status": True}

#4 Add new airplane in the system works
# return all airplanes owned by the airline
@app.route("/add_airplane", methods=["GET", "POST"])
def add_airplane():
    airline_name = request.form["airline_name"]
    cursor = conn.cursor()
    #check if airline exists
    query = "SELECT airline_name FROM Airline WHERE airline_name = %s"
    cursor.execute(query, (airline_name))
    data = cursor.fetchone()
    if not data:
        return jsonify([])
    
    #find all airplanes
    query = "SELECT * FROM Airplane WHERE airline_name = %s"
    cursor.execute(query, (airline_name))
    airplanes = cursor.fetchall()
    
    airplane_id = request.form["airplane_id"]
    manufacturer = request.form["manufacturer"]
    manufacturing_date = request.form["manufacturing_date"]
    seats = request.form["seats"]
    current_year = int(datetime.datetime.now().year)

    #check if the airplane exists. If it exists, do not insert again
    
    query1 = "SELECT airline_name FROM Airplane WHERE airplane_id = %s"
    cursor.execute(query1, (airplane_id))
    data1 = cursor.fetchone()
    if data1:
        return jsonify(airplanes)
    
    query2 = "INSERT INTO Airplane VALUES(%s, %s, %s, %s, %s, %s)"
    cursor.execute(query2, (airplane_id, airline_name, seats, manufacturing_date, manufacturer, str(current_year-int(manufacturing_date[0:4]))))
    data2 = cursor.fetchone()
    if not data2:
        return jsonify([])
    query3 = "SELECT * FROM Airplane WHERE airline_name = %s"
    cursor.execute(query3, (airline_name))
    airplanes = cursor.fetchall()
    conn.commit()
    cursor.close()

    return jsonify(airplanes)


#5 Add a new airport in the system works
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
        return {"add_airport": False} #Duplicate data

    query2 = "INSERT INTO Airport VALUES(%s, %s, %s, %s, %s)"
    cursor.execute(query2, (airport_code, airport_name, city, country, airport_type))

    conn.commit()
    cursor.close()

    return {"add_airport": True}

#6. View flight ratings:
@app.route("/view_flight_ratings", methods=["GET"])
def view_flight_ratings():
    flight_number = request.form["flight_number"]
    cursor = conn.cursor()
    query = "SELECT AVG(Reviews.rating) AS avg_rate, Reviews.comment AS comment FROM Reviews INNER JOIN Ticket ON Reviews.ticket_id  = Ticket.ticketid WHERE flight_number = %s"
    cursor.execute(query, (flight_number))
    data = cursor.fetchall()
    
    if data:
        return {"average_rating": round(data['avg_rate'], 1), "comments": data['comment']}
    
    conn.commit()
    cursor.close()

    return {"average_rating": None, "comments": None}

#7. View frequent customers partially done query is not correct.... needs to be modified
@app.route("/view_frequent_customers", methods=["GET"])
def view_frequent_customers():
    cursor = conn.cursor()
    query = "SELECT Customer.email, Customer.fname, COUNT(*) AS frequency FROM Customer INNER JOIN Ticket ON Customer.email = Ticket.email WHERE DATE_SUB(CURDATE(), INTERVAL 1 YEAR) <= Booking.booking_date GROUP BY Customer.email ORDER BY frequency DESC LIMIT 1"
    cursor.execute(query)
    data = cursor.fetchone()
    
    if data:
        return {"customer_id": data[0], "first_name": data[1], "frequency": data[2]}
    
    conn.commit()
    cursor.close()
    return {"customer_id": None, "first_name": None, "frequency": None}

#10 logout
@app.route("/logout")
def logout():
    session.pop("user", None)
    return jsonify([])

#Customer use cases 

# Use case 1. my_flights
@app.route("/myflights", methods=["GET", "POST"])
def my_flights():
    print(request.form)
    customer_email = request.form["customer_email"]
    cursor = conn.cursor()
    query = (
        "SELECT flight_num, departure_datetime, airline_name,"
        " arrival_datetime, "
        + "arr_airport.airport_name, arr_airport.city,"
        " dep_airport.airport_name, dep_airport.city, base_price "
        + "FROM Flight INNER JOIN Airport as arr_airport ON"
        " Flight.arrival_airport_code = arr_airport.airport_code "
        + "INNER JOIN Airport as dep_airport ON Flight.departure_airport_code ="
        " dep_airport.airport_code INNER JOIN Ticket ON Ticket.flight_num = Flight.flight_num"
        + "WHERE departure_datetime > CURRENT_TIMESTAMP AND TIMESTAMPDIFF(SECOND, departure_datetime, NOW()) <= (30 * 60) AND email = %s"
    )

    cursor.execute(query, (customer_email))
    data_array = cursor.fetchall()

    for data in data_array:
        flight = {
            "flight_num": data["flight_num"],
            "departure_date": str(data["departure_datetime"].date()).replace("00:00:00 GMT", ""),
            "departure_time": data["departure_datetime"].time().strftime('%H:%M:%S'),
            "airline_name": data["airline_name"],
            "arrival_date": str(data["arrival_datetime"].date()).replace("00:00:00 GMT", ""),
            "arrival_time": data["arrival_datetime"].time().strftime('%H:%M:%S'),
            "arr_airport_name": data["airport_name"],
            "arr_city": data["city"],
            "dep_airport_name": data["dep_airport.airport_name"],
            "dep_city": data["dep_airport.city"],
            "price": data["base_price"],
            "purchased": False
        }
        
        query3 = (
            "SELECT DISTINCT flight_num FROM Ticket WHERE email = %s"
        )
        cursor.execute(query3, (customer_email))
        data3 = cursor.fetchall()
        for elem in flight:
                if (elem in data3['flight_num']):
                   elem['purchased'] = True
        cursor.close()
        print(flight)
        return jsonify(flight)
    
# queries database to find all of customer's previous flights
@app.route('/user_prev_flights', methods=['GET', 'POST'])
def prev_flights():
	customer_email = request.form["customer_email"]
	cursor = conn.cursor()
	query = 'SELECT distinct airline_name, flight_num, departure_datetime, arrival_datetime, ' + \
			'status, dep_airport, dep_city, arr_airport, arr_city FROM flight NATURAL JOIN ' + \
			'(SELECT airport_name as arr_airport, city as arr_city FROM Airport) as arrival NATURAL JOIN ' + \
			'(SELECT airport_name as dep_airport, city as dep_city FROM Airport) as departure NATURAL JOIN ' + \
			'( Ticket natural join Customer) WHERE email = %s and departure_datetime < CURRENT_TIMESTAMP'
    
	cursor.execute(query, (customer_email))
	data1 = cursor.fetchall() 

	cursor.close()
	return jsonify(data1)

# #Use case 2. search_flights
# @app.route("/search_flights", methods=["POST"])
# def search_flights():
#     source = request.form["source"]
#     destination = request.form["destination"]
#     departure_date = request.form["departure_date"]
#     return_date = request.form["return_date"]
#     trip_type = request.form.get["trip_type"]
#     if not (source and destination and departure_date):
#         return {"error": "source, destination and departure_date are required"}
#     cursor = conn.cursor()
#     if trip_type == "one_way":
#         query = """
#             SELECT *
#             FROM Flight INNER JOIN Airport AS dep_airport ON dep_airport.airport_code = Flight.airtport_code INNER JOIN Airport as arr_airport ON arr_airport.airport_code = Flight.airtport_code
#             WHERE dep_airport.airport_name = %s AND arr_airport.airport_name = %s
#                 AND departure_time >= %s
#             ORDER BY departure_time ASC
#         """
#         cursor.execute(query, (source, destination, departure_date))
#     else:
#         if not return_date:
#             return {"error": "return_date is required for round trip"}
#         query = """
#             SELECT *
#             FROM Flight f1 JOIN Flight f2
#                 ON f1.arrival_airport_name = f2.departure_airport_name
#                 AND f1.departure_airport_name = %s
#                 AND f2.arrival_airport_name = %s
#                 AND f1.departure_time >= %s
#                 AND f2.departure_time >= %s
#             ORDER BY f1.departure_time ASC
#         """
#         cursor.execute(query, (source, destination, departure_date, return_date))
#     data = cursor.fetchall()
#     conn.commit()
#     cursor.close()
#     return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
