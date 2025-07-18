
CREATE TABLE provinces (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE districts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  province_id INTEGER REFERENCES provinces(id)
);

INSERT INTO provinces (name) VALUES 
('Western'), ('Eastern'), ('Northern'), ('Southern'), ('Central'), 
('North Western'), ('North Central'), ('Uva'), ('Sabaragamuwa');

INSERT INTO districts (name, province_id) VALUES
('Ampara', 2), ('Anuradhapura', 7), ('Badulla', 8), ('Batticaloa', 2),
('Colombo', 1), ('Galle', 4), ('Gampaha', 1), ('Hambantota', 4),
('Jaffna', 3), ('Kalutara', 1), ('Kandy', 5), ('Kegalle', 9),
('Kilinochchi', 3), ('Kurunegala', 6), ('Mannar', 3), 
('Matale', 5), ('Matara', 4), ('Monaragala', 8), ('Mullaitivu', 3),
('Nuwara Eliya', 5), ('Polonnaruwa', 7), ('Puttalam', 6), ('Ratnapura', 9),
('Trincomalee', 2), ('Vavuniya', 3);
