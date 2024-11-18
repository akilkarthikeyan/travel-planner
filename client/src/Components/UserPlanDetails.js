import React from 'react'
import styles from '../Styles/UserPlanDetails.module.css'
import UserBooking from './UserBooking'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function UserPlanDetails() {
  const [planDetails, setPlanDetails] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:3001/plans/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('here')
        if (data.message === 'Plan fetched successfully') {
          setPlanDetails(data.data); // Store fetched plan details in state
        }
      })
      .catch((error) => {
        console.error('Error fetching plan details:', error);
      });
  }, [id]);
  if (!planDetails) {
    return <h2>Loading...</h2>; 
  }
  return (
    <>
    <h1 className={styles.PlanName}>{planDetails.plan_name}</h1>
    <div className={styles.UserPlanDetailsContainer}>
      <div className={styles.ColumnName}>
        <div className={styles.ColName} style={{width:'10%'}}>
          <h3 style={{fontWeight:400,marginLeft:"10px"}}>Ordinal</h3>
        </div>
        <div className={styles.ColName} style={{width:'20%'}}>
          <h3 style={{fontWeight:400,marginLeft:"10px"}}>Type</h3>
        </div>
        <div className={styles.ColName} style={{width:'10%'}}>
          <h3 style={{fontWeight:400,marginLeft:"10px"}}>Id</h3>
        </div>
        <div className={styles.ColName} style={{width:'20%'}}>
            <h3 style={{fontWeight:400,marginLeft:"10px"}}>From</h3>
        </div>
        <div className={styles.ColName} style={{width:'20%'}}>
        <h3 style={{fontWeight:400,marginLeft:"10px"}}>To</h3>
        </div>
        <div className={styles.ColName} style={{width:'20%'}}>
            <h3 style={{fontWeight:400,marginLeft:"10px"}}>Closest to Airport</h3>
        </div>
      </div>
      {planDetails.segments.map((segment, index) => (
          <UserBooking
            key={index}
            ordinal={segment?.ordinal}
            type={segment?.segment_type}
            id={segment?.segment_id}
            from={segment?.start_date}
            to={segment?.end_date}
    
          />
        ))}   
    </div>
    </>
  )
}
