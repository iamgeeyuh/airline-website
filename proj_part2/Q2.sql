CREATE TABLE Customer(
    email varchar(50) primary key,
    fname varchar(20) not null,
    lname varchar(20) not null,
    password varchar(20) not null,
    bldg_num int not null,
    street varchar(20) not null,
    city varchar(20) not null,
    state varchar(20) not null,
    phone_num varchar(10) not null,
    passport_num varchar(20) not null,
    passport_exp date not null,
    passport_country varchar(20) not null,
    date_of_birth date not null
);

CREATE TABLE Airline(airline_name varchar(20) primary key);

CREATE TABLE Airport(
    airport_code int primary key,
    airport_name varchar(20) not null,
    city varchar(20) not null,
    country varchar(20) not null,
    airport_type varchar(20) not null
);

CREATE TABLE Airplane(
    airplane_id int,
    airline_name varchar(20),
    seats int not null,
    manufacturing_date date not null,
    manufacturer varchar(20) not null,
    age int not null,
    primary key (airplane_id, airline_name),
    foreign key (airline_name) references Airline(airline_name)
);

CREATE TABLE Flight(
    flight_num int,
    departure_datetime datetime,
    airline_name varchar(20),
    arrival_datetime datetime not null,
    arrival_airport_code int not null,
    departure_airport_code int not null,
    airplane_id int not null,
    base_price numeric(10, 2) not null,
    status varchar(20) not null,
    primary key (flight_num, departure_datetime, airline_name),
    foreign key (airline_name) references Airline(airline_name),
    foreign key (arrival_airport_code) references Airport(airport_code),
    foreign key (departure_airport_code) references Airport(airport_code),
    foreign key (airplane_id) references Airplane(airplane_id)
);

CREATE TABLE Ticket(
    ticket_id int,
    airline_name varchar(20),
    flight_num int,
    departure_datetime datetime,
    sold_price numeric(10, 2),
    card_type varchar(20),
    card_name varchar(20),
    card_num varchar(20),
    card_exp date,
    purchase_datetime datetime,
    email varchar(50),
    primary key (
        ticket_id,
        airline_name,
        flight_num,
        departure_datetime
    ),
    foreign key (airline_name, flight_num, departure_datetime) references Flight(airline_name, flight_num, departure_datetime),
    foreign key (email) references Customer(email)
);

CREATE TABLE Reviews(
    email varchar(50),
    ticket_id int,
    rating int,
    comment varchar(500),
    primary key (email, ticket_id),
    foreign key (email) references Customer(email),
    foreign key (ticket_id) references Ticket(ticket_id)
);

CREATE TABLE Staff(
    username varchar(20) primary key,
    password varchar(20),
    airline_name varchar(20),
    fname varchar(20),
    lname varchar(20),
    date_of_birth date,
    foreign key (airline_name) references Airline(airline_name)
);

CREATE TABLE Staff_Email(
    username varchar(20),
    email varchar(50),
    primary key (username, email),
    foreign key (username) references Staff(username)
);

CREATE TABLE Staff_Phone(
    username varchar(20),
    phone_num varchar(10),
    primary key (username, phone_num),
    foreign key (username) references Staff(username)
);