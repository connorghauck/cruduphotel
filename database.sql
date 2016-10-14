--Create the three tables.

CREATE TABLE owner (
id SERIAL PRIMARY KEY,
first_name varchar(80) NOT NULL,
last_name varchar(80) NOT NULL
);

CREATE TABLE pets (
id SERIAL PRIMARY KEY,
name varchar(80) NOT NULL,
breed varchar(80) NOT NULL,
color varchar(80) NOT NULL,
owner_id int REFERENCES owner
);


CREATE TABLE visits (
id SERIAL PRIMARY KEY,
check_in DATE,
check_out DATE
);


--add the pet_id column to visits to reference pets

ALTER TABLE visits
ADD COLUMN pet_id int REFERENCES pets;


--left join pets/owner.id so they can be referenced together

SELECT * FROM owner
LEFT JOIN pets ON owner.id = pets.owner_id
