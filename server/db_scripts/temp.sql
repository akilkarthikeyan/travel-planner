DELIMITER //

-- Stored procedure to check Airbnb availability
CREATE PROCEDURE Result(
    IN p_airbnb_id INT, 
    IN p_start_date DATE, 
    IN p_end_date DATE, 
    OUT is_overlap BOOLEAN
) 
BEGIN 
    DECLARE overlap_exists BOOLEAN; 
    
    SELECT EXISTS (
        SELECT * FROM plan_airbnb 
        WHERE airbnb_id = p_airbnb_id 
        AND (
            (p_start_date BETWEEN start_date AND end_date) 
            OR (p_end_date BETWEEN start_date AND end_date) 
            OR (start_date BETWEEN p_start_date AND p_end_date)
        )
    ) INTO overlap_exists; 
    
    SET is_overlap = overlap_exists; 
END //

-- Stored procedure to check flight availability and update it
CREATE PROCEDURE FlightAvailability(
    IN p_flight_id INT
)
BEGIN
    DECLARE curr_availability INT;  
    
    SELECT availability INTO curr_availability
    FROM flights 
    WHERE flight_id = p_flight_id;
    
    IF curr_availability IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Flight not found';
    
    ELSEIF curr_availability <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No seats available';
    
    ELSE
        UPDATE flights
        SET availability = availability - 1
        WHERE flight_id = p_flight_id;
    END IF;
END //

DELIMITER ;