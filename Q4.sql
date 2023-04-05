Select * from Flight where current_datetime < departure_datetime;

Select * from Flight where status = 'delayed';

Select distinct fname, lname from Customer natural join Ticket;

Select airplane_id from Airplane where airline_name = 'Jet Blue'
