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

@app.route("/myflights", methods=["GET"])
def my_flights():
    if not session.get("username"):
        return {"error": "not authenticated"}
    cursor = conn.cursor()
    query = """
        SELECT *
        FROM Purchase NATURAL JOIN Ticket NATURAL JOIN Flight
        WHERE customer_email = %s AND departure_time > NOW()
        ORDER BY departure_time ASC
    """
    cursor.execute(query, (session["username"],))
    data = cursor.fetchall()
    cursor.close()
    return jsonify(data)


@app.route("/search_flights", methods=["POST"])
def search_flights():
    source = request.form.get("source")
    destination = request.form.get("destination")
    departure_date = request.form.get("departure_date")
    return_date = request.form.get("return_date")
    trip_type = request.form.get("trip_type")
    if not (source and destination and departure_date):
        return {"error": "source, destination and departure_date are required"}
    cursor = conn.cursor()
    if trip_type == "one_way":
        query = """
            SELECT *
            FROM Flight
            WHERE departure_airport_name = %s AND arrival_airport_name = %s
                AND departure_time >= %s
            ORDER BY departure_time ASC
        """
        cursor.execute(query, (source, destination, departure_date))
    else:
        if not return_date:
            return {"error": "return_date is required for round trip"}
        query = """
            SELECT *
            FROM Flight f1 JOIN Flight f2
                ON f1.arrival_airport_name = f2.departure_airport_name
                AND f1.departure_airport_name = %s
                AND f2.arrival_airport_name = %s
                AND f1.departure_time >= %s
                AND f2.departure_time >= %s
            ORDER BY f1.departure_time ASC
        """
        cursor.execute(query, (source, destination, departure_date, return_date))
    data = cursor.fetchall()
    cursor.close()
    return jsonify(data)


@app.route("/purchase", methods=["POST"])
def purchase():
    if not session.get("username"):
        return {"error": "not authenticated"}
    customer_email = session["username"]
    flight_num = request.form.get("flight_num")
    seat_num = request.form.get("seat_num")
    if not (flight_num and seat_num):
        return {"error": "flight_num and seat_num are required"}
    cursor = conn.cursor()
    try:
        cursor.execute("START TRANSACTION")
        query = """
            INSERT INTO Ticket (customer_email, flight_num, seat_num, purchase_time)
            VALUES (%s, %s, %s, NOW())
        """
        cursor.execute(query, (customer_email, flight_num, seat_num))
        query = """
            UPDATE Flight
            SET seats = seats - 1
            WHERE flight_num = %s AND seats > 0
        """
        cursor.execute(query, (flight_num,))
        cursor.execute("COMMIT")
        cursor.close()
        return {"success": True}
    except:
        cursor.execute("ROLLBACK")
        cursor.close()
        return {"error": "Failed to purchase ticket"}
    
@app.route("/cancel", methods=["POST"])
def cancel():
    ticket_id = request.form["ticket_id"]
    cursor = conn.cursor()
    query = """
        SELECT *
        FROM Ticket
        WHERE id = %s AND status = 'upcoming'
    """
    cursor.execute(query, (ticket_id,))
    data = cursor.fetchone()

    if data:
        query = """
            UPDATE Ticket
            SET status = 'canceled', customer_email = NULL
            WHERE id = %s
        """
        cursor.execute(query, (ticket_id,))
        conn.commit()
        return {"success": True}
    else:
        return {"success": False, "error": "Invalid ticket ID or ticket not cancelable"}

@app.route("/rate_flight", methods=["POST"])
def rate_flight():
    ticket_id = request.form["ticket_id"]
    rating = request.form["rating"]
    comment = request.form["comment"]
    cursor = conn.cursor()
    query = """
        UPDATE Ticket
        SET rating = %s, comment = %s
        WHERE id = %s AND status = 'completed' AND customer_email = %s
    """
    cursor.execute(query, (rating, comment, ticket_id, session["username"]))
    conn.commit()
    return {"success": True}

@app.route("/spending_summary", methods=["GET", "POST"])
def spending_summary():
    if request.method == "POST":
        start_date = request.form["start_date"]
        end_date = request.form["end_date"]
        cursor = conn.cursor()
        query = """
            SELECT MONTH(date_of_purchase) AS month, YEAR(date_of_purchase) AS year, SUM(price) AS total_spent
            FROM Ticket
            WHERE customer_email = %s AND status = 'completed' AND date_of_purchase BETWEEN %s AND %s
            GROUP BY MONTH(date_of_purchase), YEAR(date_of_purchase)
        """
        cursor.execute(query, (session["username"], start_date, end_date))
        data = cursor.fetchall()
        labels = [f"{row['month']}/{row['year']}" for row in data]
        values = [row["total_spent"] for row in data]
        return jsonify({"labels": labels, "values": values})
    else:
        cursor = conn.cursor()
        query = """
            SELECT MONTH(date_of_purchase) AS month, YEAR(date_of_purchase) AS year, SUM(price) AS total_spent
            FROM Ticket
            WHERE customer_email = %s AND status = 'completed' AND date_of_purchase BETWEEN DATE_SUB(NOW(), INTERVAL 1 YEAR) AND NOW()
            GROUP BY MONTH(date_of_purchase), YEAR(date_of_purchase)
            ORDER BY YEAR(date_of_purchase), MONTH(date_of_purchase)
        """
        cursor.execute(query, (session["username"],))
        data = cursor.fetchall()
        labels = [f"{row['month']}/{row['year']}" for row in data]
        values = [row["total_spent"] for row in data]
        return render_template("spending_summary.html", labels=labels, values=values)
    
@app.route("/logout")
def logout():
    session.pop("username", None)
    return redirect(url_for("login_page"))


if __name__ == '__main__':
    app.run()
