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
import random
import uuid

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
        " arrival_datetime, ticket_id, "
        + "arr_airport.airport_name, arr_airport.city,"
        " dep_airport.airport_name, dep_airport.city, base_price "
        + "FROM Flight INNER JOIN Airport as arr_airport ON"
        " Flight.arrival_airport_code = arr_airport.airport_code "
        + "INNER JOIN Airport as dep_airport ON Flight.departure_airport_code ="
        " dep_airport.airport_code INNER JOIN Ticket ON Flight.flight_num = Ticket.flight_num"
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
            "ticket_id": data["Ticket.ticket_id"]
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
            " arrival_datetime, ticket_id, "
            + "arr_airport.airport_name, arr_airport.city,"
            " dep_airport.airport_name, dep_airport.city, base_price "
            + "FROM Flight INNER JOIN Airport as arr_airport ON"
            " Flight.arrival_airport_code = arr_airport.airport_code "
            + "INNER JOIN Airport as dep_airport ON"
            " Flight.departure_airport_code = dep_airport.airport_code INNER JOIN Ticket ON Flight.flight_num = Ticket.flight_num "
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
                "ticket_id": data["Ticket.ticket_id"]
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
    
    query5 = "SELECT flight_num, departure_datetime, departure_airport_code, arrival_datetime, arrival_airport_code FROM Flight WHERE flight_num = %s AND departure_datetime = %s AND departure_airport_code = %s AND arrival_datetime = %s AND arrival_airport_code = %s "
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
    
    # check if airline exists
    query = "SELECT airline_name FROM Airline WHERE airline_name = %s"
    cursor.execute(query, (airline_name,))
    data = cursor.fetchone()
    if not data:
        return jsonify([])
    
    airplane_id = request.form["airplane_id"]
    
    # check if the airplane exists. If it exists, do not insert again
    query1 = "SELECT airplane_id FROM Airplane WHERE airplane_id = %s"
    cursor.execute(query1, (airplane_id,))
    data1 = cursor.fetchone()
    if data1:
        return jsonify({"error": "Plane already exists"})
    
    manufacturer = request.form["manufacturer"]
    manufacturing_date = request.form["manufacturing_date"]
    seats = request.form["seats"]
    current_year = int(datetime.datetime.now().year)

    query2 = "INSERT INTO Airplane VALUES(%s, %s, %s, %s, %s, %s)"
    cursor.execute(query2, (airplane_id, airline_name, seats, manufacturing_date, manufacturer, str(current_year-int(manufacturing_date[0:4]))))
    if cursor.rowcount == 0:
        return jsonify([])
    
    query3 = "SELECT * FROM Airplane WHERE airline_name = %s"
    cursor.execute(query3, (airline_name,))
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
@app.route("/view_flight_ratings", methods=["POST"])
def view_flight_ratings():
    cursor = conn.cursor()
    flight_number = request.form["flight_number"]
   
    query = "SELECT Customer.fname as name, Customer.lname as lastname, AVG(Reviews.rating) AS avg_rate, Reviews.comment AS comment FROM Reviews INNER JOIN Ticket ON Reviews.ticket_id  = Ticket.ticketid INNER JOIN Customer ON Reviews.email = Customer.email WHERE flight_number = %s"
    cursor.execute(query, (flight_number))
    data = cursor.fetchall()
    rates = []
    if data:
       rate = {"first name": data['name'], "last name": data['lastnamename'], "average_rating": round(data['avg_rate'], 1), "comments": data['comment']}
       rates.append(rate)
    conn.commit()
    cursor.close()

    return {rates}

#7. View frequent customers partially done query is not correct.... needs to be modified
@app.route('/frequent_customers', methods=['GET', "POST"])
def frequent_customers():
    cursor = conn.cursor()
    
    customer_email = request.form["customer_email"]
    airline_name = request.form["airline_name"]
    # Get most frequent customer
    query_frequent_customer = '''
        SELECT Customer.email, Customer.fname, Customer.lname, COUNT(*) AS num_flights
        FROM Ticket INNER JOIN Customer ON Customer.email = Ticket.email
        WHERE Ticket.purchase_datetime > (CURRENT_TIMESTAMP - INTERVAL '1' YEAR) AND Customer.email = %s AND Ticket.airline_name = %s
        GROUP BY Customer.email
        ORDER BY num_flights DESC
        LIMIT 1;
    '''
    cursor.execute(query_frequent_customer, (customer_email, airline_name))
    customer_flights = cursor.fetchone()


    cursor.close()
    return jsonify({"first name" : customer_flights['fname'], "last name" : customer_flights['lname']})

#Use case 8... sales report
@app.route('/view_ticket_sales_report', methods=['GET', 'POST'])
def view_ticket_sales_report():
    airline_name = request.form["airline_name"]
    start_date = request.form["start"]
    end_date = request.form["end"]

    # cursor used to send queries
    cursor = conn.cursor()

    # query to get total ticket sold
    query1 = 'SELECT COUNT(ticket_id) AS num_tickets, SUM(sold_price) AS total_revenue FROM Ticket WHERE airline_name = %s'
    
    if start_date and end_date:
        query1 += ' AND purchase_datetime BETWEEN %s AND %s'
        cursor.execute(query1, (airline_name, start_date, end_date))
    else:
        # last month
        query1 += ' AND YEAR(purchase_datetime) = YEAR(CURRENT_TIMESTAMP - INTERVAL 1 MONTH) AND MONTH(purchase_datetime) = MONTH(CURRENT_TIMESTAMP - INTERVAL 1 MONTH)'
        cursor.execute(query1, (airline_name))
        ticket_month = cursor.fetchone()
        
        # last year
        query2 = 'SELECT COUNT(ticket_id) AS num_tickets, SUM(sold_price) AS total_revenue FROM Ticket WHERE airline_name = %s AND YEAR(purchase_datetime) = YEAR(CURRENT_TIMESTAMP - INTERVAL 1 YEAR)'
        cursor.execute(query2, (airline_name))
        ticket_year = cursor.fetchone()

    # query to get month wise ticket sold
    query3 = 'SELECT MONTHNAME(purchase_datetime) AS month, YEAR(purchase_datetime) AS year, COUNT(ticket_id) AS num_tickets, SUM(sold_price) AS revenue FROM Ticket WHERE airline_name = %s'
    
    if start_date and end_date:
        query3 += ' AND purchase_datetime BETWEEN %s AND %s'
        cursor.execute(query3 + ' GROUP BY month, year ORDER BY purchase_datetime DESC', (airline_name, start_date, end_date))
    else:
        query3 += ' GROUP BY month, year ORDER BY purchase_datetime DESC'
        cursor.execute(query3, (airline_name))
        
    monthwise_tickets = cursor.fetchall()
    
    cursor.close()
    
    # prepare response
    response = {}
    
    if start_date and end_date:
        response['start_date'] = start_date
        response['end_date'] = end_date
    else:
        response['last_month_tickets'] = ticket_month['num_tickets']
        response['last_month_revenue'] = ticket_month['total_revenue']
        response['last_year_tickets'] = ticket_year['num_tickets']
        response['last_year_revenue'] = ticket_year['total_revenue']
        
    response['monthwise_tickets'] = monthwise_tickets
    
    return jsonify(response)

#10 logout
@app.route("/logout")
def logout():
    session.pop("user", None)
    return jsonify([])


# queries database to find all of customer's previous flights
@app.route('/prev_flights', methods=['GET', 'POST'])
def prev_flights():
    customer_email = request.form["customer_email"]
    cursor = conn.cursor()
    query = "SELECT flight_num, departure_datetime, airline_name,"
    " arrival_datetime, ticket_id, "
    + "arr_airport.airport_name, arr_airport.city,"
    " dep_airport.airport_name, dep_airport.city, base_price "
    + "FROM Flight INNER JOIN Airport as arr_airport ON"
    " Flight.arrival_airport_code = arr_airport.airport_code "
    + "INNER JOIN Airport as dep_airport ON Flight.departure_airport_code ="
    " dep_airport.airport_code INNER JOIN Ticket ON Flight.flight_num = Ticket.flight_num"
    + "WHERE departure_datetime < CURRENT_TIMESTAMP and email = %s"
    cursor.execute(query, (customer_email))
    data_array = cursor.fetchall()
    flights = []
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
            "ticket_id": data["Ticket.ticket_id"]}
            flights.append(flight)
    cursor.close()
    return jsonify(flights)

# queries database to find all of customer's future flights
@app.route('/future_flights', methods=['GET', 'POST'])
def future_flights():
    customer_email = request.form["customer_email"]
    cursor = conn.cursor()
    query = "SELECT flight_num, departure_datetime, airline_name,"
    " arrival_datetime, ticket_id, "
    + "arr_airport.airport_name, arr_airport.city,"
    " dep_airport.airport_name, dep_airport.city, base_price "
    + "FROM Flight INNER JOIN Airport as arr_airport ON"
    " Flight.arrival_airport_code = arr_airport.airport_code "
    + "INNER JOIN Airport as dep_airport ON Flight.departure_airport_code ="
    " dep_airport.airport_code INNER JOIN Ticket ON Flight.flight_num = Ticket.flight_num"
    + "WHERE departure_datetime > CURRENT_TIMESTAMP and email = %s"
    cursor.execute(query, (customer_email))
    data_array = cursor.fetchall()
    flights = []
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
            "ticket_id": data["Ticket.ticket_id"]}
            flights.append(flight)
    cursor.close()
    return jsonify(flights)

@app.route("/search_flight_customer", methods=["GET", "POST"])
def search_flight_customer():

    print(request.form)
    customer_email = request.form["customer_email"]
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
        " arrival_datetime, ticket_id, "
        + "arr_airport.airport_name, arr_airport.city,"
        " dep_airport.airport_name, dep_airport.city, base_price "
        + "FROM Flight INNER JOIN Airport as arr_airport ON"
        " Flight.arrival_airport_code = arr_airport.airport_code "
        + "INNER JOIN Airport as dep_airport ON Flight.departure_airport_code ="
        " dep_airport.airport_code INNER JOIN Ticket ON Flight.flight_num = Ticket.flight_num"
        + "WHERE departure_datetime > CURRENT_TIMESTAMP AND Ticket.email = %s"
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
    cursor.execute(query, (customer_email, params))
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
            "ticket_id": data["Ticket.ticket_id"]
        }
        flights.append(flight)
    if isOneWay == "true":
        print(flights)
        cursor.close()
        return jsonify(flights)
    else:
        return_date = request.form["return_date"]
        query2 = (
            "SELECT flight_num, departure_datetime, airline_name,"
            " arrival_datetime, ticket_id, "
            + "arr_airport.airport_name, arr_airport.city,"
            " dep_airport.airport_name, dep_airport.city, base_price "
            + "FROM Flight INNER JOIN Airport as arr_airport ON"
            " Flight.arrival_airport_code = arr_airport.airport_code "
            + "INNER JOIN Airport as dep_airport ON"
            " Flight.departure_airport_code = dep_airport.airport_code INNER JOIN Ticket ON Flight.flight_num = Ticket.flight_num "
            + "WHERE departure_datetime > CURRENT_TIMESTAMP AND Ticket.email = %s"
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

        cursor.execute(query2,(customer_email, params2))

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
                "ticket_id": data["Ticket.ticket_id"]
            }
            flights.append(flight)
        cursor.close()
        print(flights)
        return jsonify(flights)


@app.route('/purchase_ticket', methods=['GET', 'POST'])
def purchase_ticket():
    cursor = conn.cursor()

    # Get data from form
    customer_email = request.form['customer_email']
    flight_num = request.form['flight_num']
    airline_name = request.form['airline_name']
    dep_timestamp = request.form['dep_timestamp']
    card_type = request.form['card_type']
    card_num = request.form['card_num']
    card_name = request.form['card_name']
    sold_price = request.form['price']
    # ticket_id = request.form['ticket_id']
    exp_date = request.form['exp_date']

    # Check if ticket has already been purchased
    query = 'SELECT * FROM Ticket WHERE flight_num = %s AND airline_name = %s AND departure_datetime = %s AND email = %s'
    cursor.execute(query, (flight_num, airline_name, dep_timestamp, customer_email))
    data = cursor.fetchone()

    if data:
        return jsonify({'error': 'Ticket has already been purchased'})

    # Check if customer has already purchased a ticket for this flight
    query = 'SELECT COUNT(ticket_id) as total FROM Ticket WHERE flight_num = %s AND email = %s'
    cursor.execute(query, (flight_num, customer_email))
    tix_purchased = cursor.fetchone()['total']

    if tix_purchased >= total_seats:
        return jsonify({'error': 'All seats for this flight have been sold out'})

    # Calculate price of ticket
    query = 'SELECT seat, base_price FROM Airplane NATURAL JOIN Flight WHERE flight_num = %s AND airline_name = %s AND departure_datetime = %s'
    cursor.execute(query, (flight_num, airline_name, dep_timestamp))
    data = cursor.fetchone()

    if not data:
        return jsonify({'error': 'Flight does not exist'})

    total_seats = data['seat']
    base_price = float(data['base_price'])

    if tix_purchased/total_seats >= 0.6:
        price = base_price * 1.25
    else:
        price = base_price

    # Generate ticket id
    random_num = random.randint(100000, 999999)
    unique_id = str(uuid.uuid4().hex)
    ticket_id  = f"{random_num}-{unique_id}"
    query = 'SELECT ticket_id FROM Ticket WHERE flight_num = %s AND email = %s'
    cursor.execute(query, (flight_num, customer_email))
    data = cursor.fetchall()
    while(ticket_id in data['ticket_id']):
        random_num = random.randint(100000, 999999)
        unique_id = str(uuid.uuid4().hex)
        ticket_id  = f"{random_num}-{unique_id}"
    purchase_time = "SELECT CURRENT_TIMESTAMP"
    # Insert purchase into database
    ins = 'INSERT INTO Ticket VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'
    cursor.execute(ins, (ticket_id, airline_name, flight_num, dep_timestamp, sold_price, card_type, card_name, card_num, exp_date, purchase_time, customer_email))

    conn.commit()
    cursor.close()

    return jsonify({'msg': 'Ticket purchased successfully!'})

@app.route('/display_cancel_trip', methods=['GET', 'POST'])	
def display_cancel_trip():
    cursor = conn.cursor()
    customer_email = request.form['customer_email']
    flight_num = request.form['flight_num']
    airline_name = request.form['airline_name']
    dep_timestamp = request.form['dep_timestamp']

    # only shows flights more than 24 hours in the future so a user cannot cancel a flight that occurs in under 24 hours
    query = 'SELECT ticket_id, airline_name, flight_num, departure_datetime, arrival_datetime, ' + \
            'status, dep_airport, dep_city, arr_airport, arr_city FROM flight NATURAL JOIN ' + \
            '(SELECT airprt_name as arr_airport, city as arr_city FROM airport) as arrival NATURAL JOIN ' + \
            '(SELECT airport_name as dep_airport, city as dep_city FROM airport) as departure NATURAL JOIN ' + \
            '(purchase natural join ticket natural join customer) WHERE email = %s and TIMESTAMPDIFF(SECOND, departure_datetime, NOW()) >= (24*3600)'
    cursor.execute(query, (customer_email))
    data1 = cursor.fetchall() 
    if not data1:
        error = 'Ticket does not belong to the customer or the flight takes place in less than 24 hours'
        return jsonify({'msg': error})

    # remove the ticket from the database
    query = 'DELETE FROM Ticket WHERE flight_num = %s AND airline_name = %s AND dep_timestamp = %s'
    cursor.execute(query, (flight_num, airline_name, dep_timestamp))
    conn.commit()
    query = 'select * from Ticket where flight_num = %s and airline_name = %s and dep_timestamp = %s'
    cursor.execute(query, (flight_num, airline_name, dep_timestamp))
    data = cursor.fetchone()
    msg = 'The ticket has been canceled and is now available for purchase by other customers'
    return jsonify({'msg': msg})

@app.route('/rate_comment', methods=['GET','POST'])
def rate_comment():
    # get parameters from request body
    customer_email = request.form['customer_email']
    rating = request.form['rating']
    comment = request.form['comment']
    ticket_id = request.form['ticket_id']
    # validate user and flight details
    cursor = conn.cursor()
    
    if rating == "" and comment == "":
        query = "SELECT rating, comment FROM Reviews WHERE ticket_id = %s AND email = %s"
        cursor.execute(query, (ticket_id, customer_email))
        data = cursor.fetchall()
        return jsonify({"rating":data['rating'], "comment": data['comment']})
    
    query = 'SELECT * FROM Ticket WHERE email = %s and ticket_id = %s and arrival_datetime > NOW()'
    cursor.execute(query, (customer_email, ticket_id))
    data = cursor.fetchone()
    
    if not data:
        return jsonify({"rating":None, "comment": None})
    
    query = 'SELECT * FROM Ticket INNER JOIN Reviews ON Ticket.email = Reviews.email WHERE Ticket.email = %s and Ticket.ticket_id = %s'
    cursor.execute(query, (customer_email, ticket_id))
    data = cursor.fetchone()
    
    if data:
        query = "DELETE FROM Reviews WHERE ticket_id = %s AND customer_email = %s"
        cursor.execute(query, (ticket_id, customer_email))
        conn.commit()
    
    # insert rating and comment
    query = 'INSERT INTO Reviews VALUES (%s, %s, %s, %s)'
    cursor.execute(query, (customer_email, ticket_id, rating, comment))
    conn.commit()
    query = "SELECT rating, comment FROM Reviews WHERE ticket_id = %s AND email = %s"
    cursor.execute(query, (ticket_id, customer_email))
    data = cursor.fetchall()
    conn.close()
    cursor.close()
    return jsonify({"rating":data['rating'], "comment": data['comment']})
    

@app.route('/track_spend', methods=['GET', 'POST'])
def track_spend():
        cursor = conn.cursor()
        customer_email = request.form['customer_email']

        # Total amount spent in the past year
        query_year_total = 'SELECT SUM(sold_price) FROM Ticket WHERE email = %s AND purchase_datetime > (CURRENT_TIMESTAMP - INTERVAL \'1\' YEAR)'
        cursor.execute(query_year_total, (customer_email,))
        year_total = cursor.fetchone()[0] or 0

        # Month-wise spending for the past 6 months
        query_monthly_spending = 'SELECT MONTH(purchase_datetime) AS month, SUM(sold_price) AS spending FROM Ticket WHERE email = %s AND purchase_datetime > (CURRENT_TIMESTAMP - INTERVAL \'6\' MONTH) GROUP BY MONTH(purchase_datetime)'
        cursor.execute(query_monthly_spending, (customer_email,))
        monthly_spending = cursor.fetchall()
        data = [0] * 12
        for row in monthly_spending:
            data[row['month']-1] = row['spending']

        # Range-wise spending
        start_date = request.form.get('start_date')
        end_date = request.form.get('end_date')
        if start_date and end_date:
            try:
                start_date = datetime.strptime(start_date, '%Y-%m-%d')
                end_date = datetime.strptime(end_date, '%Y-%m-%d')
            except ValueError:
                return jsonify({'error': 'Invalid date format. Please use YYYY-MM-DD.'})

            if end_date < start_date:
                return jsonify({'error': 'End date should be greater than or equal to start date.'})

            query_range_total = 'SELECT SUM(sold_price) FROM Ticket WHERE email = %s AND purchase_datetime >= %s AND purchase_datetime <= %s'
            cursor.execute(query_range_total, (customer_email, start_date, end_date))
            range_total = cursor.fetchone()[0] or 0

            # Month-wise spending within the range
            query_range_spending = 'SELECT MONTH(purchase_datetime) AS month, SUM(sold_price) AS spending FROM Ticket WHERE email = %s AND purchase_datetime >= %s AND purchase_datetime <= %s GROUP BY MONTH(purchase_datetime)'
            cursor.execute(query_range_spending, (customer_email, start_date, end_date))
            range_spending = cursor.fetchall()
            range_data = [0] * 12
            for row in range_spending:
                range_data[row['month']-1] = row['spending']
        else:
            range_total = None
            range_data = None

        cursor.close()

        return jsonify({
            'year_total': year_total,
            'monthly_data': data,
            'range_total': range_total,
            'range_data': range_data
        })

if __name__ == "__main__":
    app.run(debug=True)
