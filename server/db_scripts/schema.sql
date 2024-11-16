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
    ordinal    INT,
    FOREIGN KEY (plan_id) REFERENCES plan (plan_id) ON DELETE CASCADE,
    FOREIGN KEY (airbnb_id) REFERENCES airbnb (airbnb_id),
    PRIMARY KEY (plan_id, airbnb_id, ordinal)
);

CREATE TABLE plan_flight
(
    plan_id  INT,
    flight_id VARCHAR(50),
    ordinal   INT NOT NULL,
    FOREIGN KEY (plan_id) REFERENCES plan (plan_id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flight (flight_id),
    PRIMARY KEY (plan_id, flight_id)
);

CREATE INDEX airbnb_combined_idx ON airbnb(close_to_airport, host_id);

CREATE INDEX flight_combined_idx ON flight(starting_airport, destination_airport, flight_date);

