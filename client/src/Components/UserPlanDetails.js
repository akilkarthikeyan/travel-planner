import React from 'react'
import styles from '../Styles/UserPlanDetails.module.css'
import UserBooking from './UserBooking'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function UserPlanDetails() {
  const [planDetails, setPlanDetails] = useState(null);
  const [segmentsWithDetails, setSegmentsWithDetails] = useState([]);
  const { id } = useParams();

  // Fetch plan details when component mounts or when 'id' changes
  useEffect(() => {
    fetch(`http://localhost:3001/plans/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Plan fetched successfully') {
          setPlanDetails(data.data); // Store fetched plan details in state
          fetchSegmentDetails(data.data.segments); // Fetch additional details for segments
        }
      })
      .catch((error) => {
        console.error('Error fetching plan details:', error);
      });
  }, [id]);

  // Function to fetch additional details for each segment
  const fetchSegmentDetails = async (segments) => {
    console.log("hello")
    const updatedSegments = await Promise.all(
      segments.map(async (segment) => {
        if (segment.segment_type === 'flight') {
          // Fetch flight details
          const flightResponse = await fetch(`http://localhost:3001/flights/${segment.segment_id}`);
          let flightData = await flightResponse.json();
          flightData = flightData.data;
          return {
            ...segment,
            from: flightData.starting_airport,
            to: flightData.destination_airport,
          };
        } else if (segment.segment_type === 'airbnb') {
          // Fetch Airbnb details
          const airbnbResponse = await fetch(`http://localhost:3001/airbnbs/${segment.segment_id}`);
          let airbnbData = await airbnbResponse.json();
          airbnbData = airbnbData.data;
          return {
            ...segment,
            closest_to_airport: airbnbData.close_to_airport,
          };
        }
        return segment; // Return unchanged if no matching type
      })
    );
    console.log("updatedSegments", updatedSegments)
    setSegmentsWithDetails(updatedSegments);
  };

  if (!planDetails || segmentsWithDetails.length === 0) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <h1 className={styles.PlanName}>{planDetails.plan_name}</h1>
      <div className={styles.UserPlanDetailsContainer}>
        <div className={styles.ColumnName}>
          <div className={styles.ColName} style={{ width: '10%' }}>
            <h3 style={{ fontWeight: 400, marginLeft: '10px' }}>Ordinal</h3>
          </div>
          <div className={styles.ColName} style={{ width: '20%' }}>
            <h3 style={{ fontWeight: 400, marginLeft: '10px' }}>Type</h3>
          </div>
          <div className={styles.ColName} style={{ width: '10%' }}>
            <h3 style={{ fontWeight: 400, marginLeft: '10px' }}>Id</h3>
          </div>
          <div className={styles.ColName} style={{ width: '20%' }}>
            <h3 style={{ fontWeight: 400, marginLeft: '10px' }}>From</h3>
          </div>
          <div className={styles.ColName} style={{ width: '20%' }}>
            <h3 style={{ fontWeight: 400, marginLeft: '10px' }}>To</h3>
          </div>
          <div className={styles.ColName} style={{ width: '20%' }}>
            <h3 style={{ fontWeight: 400, marginLeft: '10px' }}>Closest to Airport</h3>
          </div>
        </div>

        {segmentsWithDetails.map((segment, index) => (
          <UserBooking
            key={index}
            ordinal={segment?.ordinal}
            type={segment?.segment_type}
            id={segment?.segment_id}
            from={segment?.from || segment?.start_date} // Use fetched "from" or default start date
            to={segment?.to || segment?.end_date}     // Use fetched "to" or default end date
            closestToAirport={segment?.closest_to_airport || ''} // Only for Airbnb segments
          />
        ))}
      </div>
    </>
  );
}
