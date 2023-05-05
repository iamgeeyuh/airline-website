-- Q3
-- a. One Airline name "Jet Blue". 
insert into Airline values('Jet Blue');

-- b. At least Two airports named "JFK" in NYC and "PVG" in Shanghai. 
insert into Airport values(0, 'JFK', 'NYC', 'US', 'both');
insert into Airport values(1, 'PVG', 'Shanghai', 'China', 'both');

-- c. Insert at least three customers with appropriate names and other attributes. 
insert into Customer values('sh6210@nyu.edu', 'Shenyi', 'Huang', '123456', '370', 'Jay Street', '841', 'Brooklyn', 'NY', 'JE3333666', '2041-06-03', 'China', '2002-03-09');
insert into Customer values('jzh9076@nyu.edu', 'Jia', 'Huang', '123456', '370', 'Jay Street', 'Brooklyn', '839', 'NY', 'E90769076', '2042-05-03', 'US', '2001-04-09');
insert into Customer values('imj2430@nyu.edu', 'Isha', 'Jagani', '123456', '370', 'Jay Street', '549', 'Brooklyn', 'NY', 'E24302430', '2043-04-03', 'US', '2000-05-09');

insert into Customer_Phone values('sh6210@nyu.edu', '0123456789');
insert into Customer_Phone values('jzh9076@nyu.edu', '1234567890');
insert into Customer_Phone values('imj2430@nyu.edu', '2345678901');

-- d. Insert at least three airplanes. 
insert into Airplane values(1222, 'Jet Blue', 500, '2019-01-01', 'Airbus', 4);
insert into Airplane values(2333, 'Jet Blue', 200, '2020-01-01', 'Boeing', 3);
insert into Airplane values(3444, 'Jet Blue', 300, '2010-01-01', 'Boeing', 13);

-- e. Insert At least One airline Staff working for Jet Blue. 
insert into Staff values('karen123', 'karenkaren', 'Jet Blue', 'Karen', 'Zhang', '1970-01-01');
insert into Staff_Email values('karen123', 'karen123@gmail.com');
insert into Staff_Phone values('karen123', '1234445555');

-- f. Insert several flights with on-time, and delayed statuses. 
insert into Flight values(587, '2023-05-10 08:00:00',  'Jet Blue', '2023-05-10 15:00:00', 0, 1, 2333, 3000.00, 'on-time');
insert into Flight values(777, '2023-05-11 08:00:00', 'Jet Blue', '2023-05-11 15:00:00', 1, 0, 1222, 5000.00, 'delayed');
insert into Flight values(777, '2022-05-10 08:00:00', 'Jet Blue', '2022-05-10 15:00:00', 1, 0, 1222, 5000.00, 'delayed');
insert into Flight values(587, '2022-05-11 08:00:00',  'Jet Blue', '2022-05-11 15:00:00', 0, 1, 2333, 3000.00, 'on-time');

-- g. Insert some tickets for corresponding flights and insert some purchase records (customers bought some tickets). 

insert into Ticket values(1, 'Jet Blue', 587, '2023-05-10 08:00:00', 3000.00, 'credit', 'Shenyi Huang', '0000000000000000', '2029-02-02', '2023-01-01 15:00:00', 'sh6210@nyu.edu');
insert into Ticket values(2, 'Jet Blue', 777, '2023-05-11 08:00:00', 5000.00, 'debit', 'Isha Jagani', '0000000000000001', '2029-03-02', '2023-01-02 15:00:00', 'imj2430@nyu.edu');
insert into Ticket values(3, 'Jet Blue', 587, '2023-05-10 08:00:00', 3000.00, 'credit', 'Jia Huang', '0000000000000002', '2028-03-02', '2023-01-03 15:00:00', 'jzh9076@nyu.edu');
insert into Ticket values(4, 'Jet Blue', 587, '2022-05-11 08:00:00', 3000.00, 'credit', 'Jia Huang', '0000000000000002', '2028-03-02', '2023-01-03 15:00:00', 'jzh9076@nyu.edu');
insert into Ticket values(5, 'Jet Blue', 777, '2022-05-10 08:00:00', 5000.00, 'credit', 'Jia Huang', '0000000000000002', '2028-03-02', '2023-01-03 15:00:00', 'jzh9076@nyu.edu');