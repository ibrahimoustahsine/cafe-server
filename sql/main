-- Active: 1700672226106@@127.0.0.1@5432@koffe@public


-- Tables
CREATE TABLE Customer (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);


CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    order_date DATE DEFAULT NOW(),
    total_price NUMERIC NOT NULL,
    customer_id INTEGER NOT NULL,
    restaurant_id INTEGER NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE Restaurant (
    restaurant_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE employee (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR (255) NOT NULL,
    pin INTEGER NOT NULl,
    hire_date DATE DEFAULT NOW(),
    restaurant_id INTEGER NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id)
);

CREATE TABLE Menu (
    menu_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT FALSE,
    restaurant_id INTEGER NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id)
);

CREATE TABLE Category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    menu_id INTEGER NOT NULL,
    icon INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (menu_id) REFERENCES Menu(menu_id)
);

CREATE TABLE Menuitem (
    menuitem_id SERIAL PRIMARY KEY,
    price NUMERIC NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES Category(category_id)
);

CREATE TABLE Order_Items (
    order_id INTEGER NOT NULL,
    menuitem_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (menuitem_id) REFERENCES Menuitem(menuitem_id),
    PRIMARY KEy (order_id, menuitem_id)
);
CREATE TABLE employee_order_status (
    order_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    acceptance_date DATE DEFAULT NOW(),
    finish_date DATE,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),
    PRIMARY KEY (order_id, employee_id)
);


-- DATA
INSERT INTO Customer (first_name, last_name, email, password) VALUES
('John', 'Doe', 'johndoe@email.com', 'password123'),
('Jane', 'Smith', 'janesmith@email.com', 'securepass456'),
('Alice', 'Johnson', 'alicejohnson@email.com', 'p@ssw0rd!'),
('Bob', 'Williams', 'bobwilliams@email.com', 'mysecret789'),
('Emily', 'Brown', 'emilybrown@email.com', 'brownie123'),
('Michael', 'Davis', 'michaeldavis@email.com', 'm1ch@3l!'),
('Sophia', 'Garcia', 'sophiagarcia@email.com', 'sophPass789'),
('William', 'Martinez', 'williammartinez@email.com', 'willi3@mpass'),
('Olivia', 'Lopez', 'olivialopez@email.com', 'lopezPass456'),
('Daniel', 'Hernandez', 'danielhernandez@email.com', 'dannyPass!23');

INSERT INTO Restaurant (name, email, password) VALUES
('Taste of Italy', 'info@tasteofitaly.com', 'italian123'),
('Spice Garden', 'spicegarden@email.com', 'spicydish456');

INSERT INTO employee (first_name, last_name, pin, hire_date, restaurant_id) VALUES
('John', 'Smith', 1234, '2023-01-15', 1),
('Sophia', 'Brown', 1357, '2023-04-05', 1),
('James', 'Jones', 7890, '2023-07-22', 1),
('Isabella', 'Lee', 6754, '2023-10-25', 1),
('Emma', 'Johnson', 5678, '2023-02-20', 1),
('Daniel', 'Miller', 9876, '2023-05-12', 2),
('Ava', 'Martinez', 1029, '2023-08-30', 2),
('Michael', 'Williams', 2468, '2023-03-10', 2),
('Olivia', 'Garcia', 5432, '2023-06-18', 2),
('Ethan', 'Anderson', 3847, '2023-09-14', 2);

INSERT INTO Menu (name, active, restaurant_id) VALUES
('Specials', TRUE, 1),
('Summer Menu', FALSE, 1),
('Halloween Menu', TRUE, 2),
('Easter Menu', FALSE, 2);

INSERT INTO Category (category_name, menu_id) VALUES
('Salads', 1),
('Pasta', 1),
('Steak', 2),
('Burgers', 2),
('Pastries', 2),
('Soft Drinks', 3),
('Fresh Salads', 3),
('Sea Delicacies', 4),
('Sizzling Steaks', 4);

INSERT INTO Menuitem (name, price, category_id) VALUES
('Classic Caesar Salad', 8.99, 1),
('Mediterranean Salad', 9.99, 1),
('Cobb Salad', 10.99, 1),
('Spaghetti Carbonara', 12.99, 2),
('Fettuccine Alfredo', 14.99, 2),
('Lasagna Bolognese', 13.99, 2),
('Margherita Pizza', 11.99, 3),
('Pepperoni Pizza', 13.99, 3),
('Vegetarian Pizza', 12.99, 3),
('Grilled Salmon', 18.99, 4),
('Lobster Tail', 24.99, 4),
('Shrimp Scampi', 19.99, 4),
('Filet Mignon', 29.99, 5),
('Ribeye Steak', 27.99, 5),
('Sirloin Steak', 25.99, 5),
('Classic Burger', 11.99, 6),
('BBQ Bacon Burger', 13.99, 6),
('Mushroom Swiss Burger', 12.99, 6),
('Chocolate Cake', 7.99, 7),
('Cheesecake', 8.99, 7),
('Tiramisu', 9.99, 7),
('Vanilla Ice Cream', 4.99, 8),
('Strawberry Sorbet', 5.99, 8),
('Mango Gelato', 6.99, 8),
('Blueberry Pastry', 3.99, 9),
('Apple Pie', 5.99, 9),
('Pecan Tart', 4.99, 9);-- QUERIES


-- Retrieving Customer Menu

SELECT * FROM restaurant;

CREATE OR REPLACE FUNCTION get_restaurant(a_res_id INTEGER)
RETURNS TABLE (
 restaurant_id INTEGER,
 restaurant_name VARCHAR,
 restaurant_email VARCHAR,
 menu_id INTEGER,
 active BOOLEAN,
 category_id INTEGER,
 category_name VARCHAR,
 icon INTEGER,
 menuitem_id INTEGER,
 menuitem_name VARCHAR,
 menuitem_price NUMERIC)
LANGUAGE PLPGSQL
AS
$$
DECLARE

    v_restaurant_id INTEGER := 1;
    v_menu_id menu.menu_id%type;

BEGIN

    IF a_res_id IS NOT NULL
    THEN
    v_restaurant_id := a_res_id;
    END IF;

    SELECT menu.menu_id INTO v_menu_id FROM menu WHERE menu.restaurant_id = v_restaurant_id AND menu.active = TRUE;

    RETURN QUERY SELECT restaurant.restaurant_id, restaurant.name as restaurant_name, restaurant.email,
    menu.menu_id, menu.active, category.category_id, category.category_name, category.icon,
    menuitem.menuitem_id, menuitem.name, menuitem.price
    FROM restaurant JOIN menu ON restaurant.restaurant_id = menu.restaurant_id JOIN category ON menu.menu_id = category.menu_id
    JOIN menuitem ON menuitem.category_id = category.category_id WHERE category.menu_id = v_menu_id;
END;
$$;

SELECT * FROM get_restaurant(NULL);

-- Placing an order
CREATE TYPE t_order_menuitem AS (menuitem_id INTEGER, quantity INTEGER);

CREATE OR REPLACE PROCEDURE place_order (
    a_restaurant_id INTEGER,
    a_customer_id INTEGER,
    a_total_price NUMERIC,
    a_order_menu_items t_order_menuitem[]
)
LANGUAGE PLPGSQL
AS
$$
DECLARE
    v_order_menu_item t_order_menuitem;
    v_order_id INTEGER;
BEGIN

    INSERT INTO Orders (restaurant_id, customer_id, total_price) VALUES (a_restaurant_id, a_customer_id, a_total_price) RETURNING order_id INTO v_order_id;

    FOREACH v_order_menu_item IN ARRAY a_order_menu_items
    LOOP
    INSERT INTO order_items (order_id, menuitem_id, quantity) VALUES (v_order_id, v_order_menu_item.menuitem_id, v_order_menu_item.quantity);         
    END LOOP;

END;
$$;


CREATE OR REPLACE FUNCTION assign_order_to_employee()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS
$$
DECLARE
    v_free_random_employee INTEGER;
    v_order_id INTEGER := NEW.order_id;
BEGIN
    SELECT employee_id INTO v_free_random_employee
    FROM Employee E WHERE E.restaurant_id = NEW.restaurant_id AND E.employee_id NOT IN
    (SELECT employee_id FROM employee_order_status WHERE finish_date IS NOT NULL) ORDER BY RANDOM() LIMIT 1;
    INSERT INTO employee_order_status (order_id, employee_id ) VALUES (v_order_id, v_free_random_employee);
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER t_assign_order_to_employee
AFTER INSERT
ON Orders
FOR EACH ROW EXECUTE PROCEDURE assign_order_to_employee ();

-- Order Update and cancel
CREATE OR REPLACE VIEW get_all_orders AS
SELECT
orders.order_id AS orderId,
order_date,
total_price,
CONCAT(customer.first_name, ' ', customer.last_name) AS customer_name,
finish_date IS NULL AS pending 
FROM orders JOIN customer ON orders.customer_id = customer.customer_id
JOIN employee_order_status EOS ON EOS.order_id = orders.order_id;

SELECT * FROM get_all_orders;

SELECT
orders.order_id AS orderId,
order_date,
total_price,
customer.first_name AS customer_name,
finish_date IS NULL AS pending 
FROM orders JOIN customer ON orders.customer_id = customer.customer_id
JOIN employee_order_status EOS ON EOS.order_id = orders.order_id WHERE orders.order_id = 6;