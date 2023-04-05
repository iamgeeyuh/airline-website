Select * from Flight where current_timestamp < departure_datetime;

Select * from Flight where status = 'delayed';

Select distinct name from Customer natural join Ticket;

Select airplane_id from Airplane where airline_name = 'Jet Blue'
