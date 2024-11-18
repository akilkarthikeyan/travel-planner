import React, { useState, useEffect } from 'react'
import styles from '../Styles/UserPlans.module.css'
import UserPlan from './UserPlan'
import { useParams, useNavigate } from 'react-router-dom';

export default function UserPlans() {
  const [plans, setPlans] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch data when the component mounts
  useEffect(() => {
    fetch(`http://localhost:3001/users/${id}/plans`)
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Plans fetched successfully') {
          setPlans(data.data); // Store the fetched plans in state
        }
      })
      .catch((error) => {
        console.error('Error fetching plans:', error);
      });
  }, [id]);

  

  return (
    <div className={styles.UserPlansContainer}>
      <div className={styles.ColumnName}>
        <div className={styles.ColName} style={{width:'15%'}}>
          <h3 style={{fontWeight:400,marginLeft:"10px"}}>Plan Id</h3>
        </div>
        <div className={styles.ColName} style={{width:'35%'}}>
          <h3 style={{fontWeight:400,marginLeft:"10px"}}>Plan Name</h3>
        </div>
        <div className={styles.ColName} style={{width:'40%'}}>
          <h3 style={{fontWeight:400,marginLeft:"10px"}}>Plan Description</h3>
        </div>
        <div className={styles.ColName} style={{width:'10%'}}></div>
      </div>
      {plans.map((plan) => (
        <UserPlan
          key={plan.plan_id}
          planId={plan.plan_id}
          planName={plan.plan_name}
          description={plan.plan_description}
          
        />
      ))}

    </div>
  )
}
