DROP PROCEDURE IF EXISTS insert_airbnb;
DROP PROCEDURE IF EXISTS insert_flight;

DROP TRIGGER IF EXISTS insert_plan_airbnb;
DROP TRIGGER IF EXISTS insert_plan_flight;

DROP TABLE IF EXISTS plan_flight;
DROP TABLE IF EXISTS plan_airbnb;
DROP TABLE IF EXISTS plan;
DROP TABLE IF EXISTS airbnb;
DROP TABLE IF EXISTS flight;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS airline;
DROP TABLE IF EXISTS host;

CREATE TABLE host
(
    host_id                INT,
    host_url               VARCHAR(300),
    host_name              VARCHAR(50),
    host_response_rate     NUMERIC,
    host_acceptance_rate   NUMERIC,
    host_is_superhost      BOOL,
    host_identity_verified BOOL,
    PRIMARY KEY (host_id)
);

CREATE TABLE airline
(
    airline_id   VARCHAR(2),
    airline_name VARCHAR(50),
    PRIMARY KEY (airline_id)
);

CREATE TABLE user
(
    user_id   INT AUTO_INCREMENT,
    user_name VARCHAR(50) NOT NULL,
    phone     VARCHAR(15),
    email     VARCHAR(50) UNIQUE NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE flight
(
    flight_id             VARCHAR(50),
    flight_date           DATE           NOT NULL,
    starting_airport      VARCHAR(3)     NOT NULL,
    destination_airport   VARCHAR(3)     NOT NULL,
    travel_duration       NUMERIC,
    is_basic_economy      BOOL,
    total_fare            DECIMAL(10, 2) NOT NULL,
    departure_time        TIME           NOT NULL,
    arrival_time          TIME           NOT NULL,
    equipment_description VARCHAR(50),
    airline_id            VARCHAR(2)    NOT NULL,
    seats                 INT           DEFAULT 50,
    FOREIGN KEY (airline_id) REFERENCES airline (airline_id),
    PRIMARY KEY (flight_id)
);

CREATE TABLE airbnb
(
    airbnb_id             INT,
    listing_url           VARCHAR(300),
    name                  VARCHAR(150),
    description           VARCHAR(300),
    neighborhood_overview VARCHAR(300),
    picture_url           VARCHAR(300),
    latitude              DECIMAL(8, 6),
    longitude             DECIMAL(9, 6),
    property_type         VARCHAR(150),
    accommodates          NUMERIC,
    bathrooms             NUMERIC,
    bedrooms              NUMERIC,
    beds                  NUMERIC,
    amenities             JSON,
    price                 NUMERIC     NOT NULL,
    number_of_reviews     NUMERIC,
    review_scores_rating  NUMERIC     NOT NULL,
    close_to_airport      VARCHAR(3)  NOT NULL,
    host_id               INT NOT NULL,
    FOREIGN KEY (host_id) REFERENCES host (host_id),
    PRIMARY KEY (airbnb_id)
);

CREATE TABLE plan
(
    plan_id          INT AUTO_INCREMENT,
    plan_name        VARCHAR(50) NOT NULL,
    plan_description VARCHAR(150),
    user_id          INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    PRIMARY KEY (plan_id)
);


CREATE TABLE plan_airbnb
(
    plan_id    INT,
    airbnb_id  INT,
    start_date DATE,
    end_date   DATE,
    ordinal    INT DEFAULT 0,
    FOREIGN KEY (plan_id) REFERENCES plan (plan_id) ON DELETE CASCADE,
    FOREIGN KEY (airbnb_id) REFERENCES airbnb (airbnb_id),
    PRIMARY KEY (plan_id, airbnb_id, ordinal)
);

CREATE TABLE plan_flight
(
    plan_id  INT,
    flight_id VARCHAR(50),
    ordinal   INT NOT NULL DEFAULT 0,
    FOREIGN KEY (plan_id) REFERENCES plan (plan_id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flight (flight_id),
    PRIMARY KEY (plan_id, flight_id)
);

CREATE INDEX airbnb_combined_idx ON airbnb(close_to_airport, host_id);

CREATE INDEX flight_combined_idx ON flight(starting_airport, destination_airport, flight_date);

CREATE PROCEDURE insert_airbnb(
    IN p_plan_id INT,
    IN p_airbnb_id INT,
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    DECLARE overlap_exists BOOLEAN;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Transaction failed due to an error';
        END;
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    START TRANSACTION;
    SELECT EXISTS (
        SELECT * FROM plan_airbnb
        WHERE airbnb_id = p_airbnb_id
          AND (
            (p_start_date BETWEEN start_date AND end_date)
                OR (p_end_date BETWEEN start_date AND end_date)
                OR (start_date BETWEEN p_start_date AND p_end_date)
                OR (end_date BETWEEN p_start_date AND p_end_date)
            )
    ) INTO overlap_exists;
    IF overlap_exists THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'airbnb overlap';
    ELSE
        INSERT INTO plan_airbnb(plan_id, airbnb_id, start_date, end_date)
        VALUES(p_plan_id, p_airbnb_id, p_start_date, p_end_date);
    END IF;
    COMMIT;
END;

CREATE PROCEDURE insert_flight(
    IN p_plan_id INT,
    IN p_flight_id VARCHAR(50)
)
BEGIN
    DECLARE curr_availability INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Transaction failed due to an error';
        END;
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    START TRANSACTION;
    SELECT seats INTO curr_availability
    FROM flight
    WHERE flight_id = p_flight_id;
    IF curr_availability = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'no flight seats';
    ELSE
        UPDATE flight
        SET seats = seats - 1
        WHERE flight_id = p_flight_id;
        INSERT INTO plan_flight(plan_id, flight_id)
        VALUES (p_plan_id, p_flight_id);
    END IF;
    COMMIT;
END;

CREATE TRIGGER insert_plan_airbnb
    BEFORE INSERT
    ON plan_airbnb
    FOR EACH ROW
BEGIN
    DECLARE max_ordinal INT;
    SELECT COALESCE(MAX(ordinal), 0)
    FROM (
             SELECT ordinal FROM plan_airbnb WHERE plan_id = NEW.plan_id
             UNION
             SELECT ordinal FROM plan_flight WHERE plan_id = NEW.plan_id
         ) combined INTO max_ordinal;
    SET NEW.ordinal = max_ordinal + 1;
END;

CREATE TRIGGER insert_plan_flight
    BEFORE INSERT
    ON plan_flight
    FOR EACH ROW
BEGIN
    DECLARE max_ordinal INT;
    SELECT COALESCE(MAX(ordinal), 0)
    FROM (
             SELECT ordinal FROM plan_airbnb WHERE plan_id = NEW.plan_id
             UNION
             SELECT ordinal FROM plan_flight WHERE plan_id = NEW.plan_id
         ) combined INTO max_ordinal;
    SET NEW.ordinal = max_ordinal + 1;
END;