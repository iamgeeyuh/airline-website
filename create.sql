CREATE TABLE airport(
    airport_code varchar(3) primary key,
    airport_name varchar(20) not null,
    airport_city varchar(20) not null,
    airport_country varchar(20) not null,
    airport_type varchar(20) not null,
);

CREATE TABLE airline(airline_name varchar(20) primary key);

CREATE TABLE flight(
    flight_num int,
    departure_time time,
    airline_name varchar(20),
    arrival_time time not null,
    base_price numeric(10, 2) not null,
    status varchar(10),
    primary key(flight_num, departure_time, airline_name),
    foreign key(airline_name) references airline(airline_name)
);

CREATE TABLE arrives(
    airport_code varchar(3),
    flight_num int,
    departure_time time,
    airline_name varchar(20),
    primary key (
        airport_code,
        flight_num,
        departure_time,
        airline_name
    ),
    foreign key (airport_code) references airport(airport_code),
    foreign key (flight_num, departure_time, airline_name) references flight(flight_num, departure_time, airline_name)
);

CREATE TABLE departs(
    airport_code varchar(3),
    flight_num int,
    departure_time time,
    airline_name varchar(20),
    primary key (
        airport_code,
        flight_num,
        departure_time,
        airline_name
    ),
    foreign key (airport_code) references airport(airport_code),
    foreign key (flight_num, departure_time, airline_name) references flight(flight_num, departure_time, airline_name)
);

CREATE TABLE ticket(
    ticket_id int primary key,
    ticket_price numeric(10, 2) not null,
    card_type varchar(10) not null,
    card_name varchar(20) not null,
    card_num int not null,
    card_exp date not null,
    purchase_datetime datetime not null
);

CREATE TABLE for_flight(
    ticket_id int,
    flight_num int,
    departure_time time,
    airline_name varchar(20),
    primary key (
        ticket_id,
        flight_num,
        departure_time,
        airline_name
    ),
    foreign key (ticket_id) references ticket(ticket_id),
    foreign key (flight_num, departure_time, airline_name) references flight(flight_num, departure_time, airline_name)
);

CREATE TABLE customer(
    cust_email varchar(50) primary key,
    cust_fname varchar(20) not null,
    cust_lname varchar(20) not null,
    cust_password varchar(20) not null,
    bldg_num smallint not null,
    cust_street varchar(20) not null,
    cust_city varchar(20) not null,
    cust_state varchar(20) not null,
    cust_phone varchar(10) not null,
    passport_num varchar(9) not null,
    passport_exp_date date not null,
    passport_country varchar(20) not null,
    cust_DOB date not null
);

CREATE TABLE purchased_by(
    ticket_id int,
    cust_email varchar(50),
    primary key (ticket_id, cust_email),
    foreign key (ticket_id) references ticket(ticket_id),
    foreign key (cust_email) references customer(cust_email)
);

CREATE TABLE flew_on(
    cust_email varchar(50),
    flight_num int,
    departure_time time,
    airline_name varchar(20),
    rating smallint,
    comment varchar(500),
    primary key (cust_email, flight_num, departure_time, airline_name),
    foreign key (cust_email) references customer(cust_email),
    foreign key (flight_num, departure_time, airline_name) references flight(flight_num, departure_time, airline_name)
);

CREATE TABLE airplane(
    airplane_id int primary key,
    seat int not null,
    manufacturing_date date not null,
    manufacturer varchar(20) not null,
    age int not null
);

CREATE TABLE is_on(
    flight_num int,
    departure_time time,
    airline_name varchar(20),
    airplane_id int,
    primary key (
        flight_num,
        departure_time,
        airline_name,
        airplane_id
    ),
    foreign key (flight_num, departure_time, airline_name) references flight(flight_num, departure_time, airline_name),
    foreign key (airplane_id) references airplane(airplane_id)
);

CREATE TABLE owns(
    airline_name varchar(20),
    airplane_id int,
    primary key (airline_name, airplane_id),
    foreign key (airline_name) references airline(airline_name),
    foreign key (airplane_id) references airplane(airplane_id)
);

CREATE TABLE staff(
    user_name varchar(20) primary key,
    staff_password varchar(20) not null,
    staff_fname varchar(20) not null,
    staff_lname varchar(20) not null,
    staff_DOB date not null
);

CREATE TABLE staff_email(
    user_name varchar(20),
    staff_email varchar(50),
    primary key (user_name, staff_email),
    foreign key (user_name) references staff(user_name)
);

CREATE TABLE staff_phonenum(
    user_name varchar(20),
    staff_phonenum varchar(10),
    primary key (user_name, staff_phonenum),
    foreign key (user_name) references staff(user_name)
);

CREATE TABLE works_for(
    user_name varchar(20),
    airline_name varchar(20),
    primary key (user_name, airline_name),
    foreign key (user_name) references staff(user_name),
    foreign key (airline_name) references airline(airline_name)
);