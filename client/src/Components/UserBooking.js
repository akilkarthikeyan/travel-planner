import React from 'react'
import styles from '../Styles/UserBooking.module.css'

export default function UserBooking({ ordinal, type, id, from, to}) {
  return (
        <div className={styles.ColumnName}>
            <div className={styles.ColName} style={{width:'10%'}}>
                <h3 style={{fontWeight:400,marginLeft:"10px"}}>{ordinal}</h3>
            </div>
            <div className={styles.ColName} style={{width:'20%'}}>
                <h3 style={{fontWeight:400,marginLeft:"10px"}}>{type}</h3>
            </div>
            <div className={styles.ColName} style={{width:'10%'}}>
                <h3 style={{fontWeight:400,marginLeft:"10px"}}>{id}</h3>
            </div>
            <div className={styles.ColName} style={{width:'20%'}}>
                <h3 style={{fontWeight:400,marginLeft:"10px"}}>{from}</h3>
            </div>
            <div className={styles.ColName} style={{width:'20%'}}>
                <h3 style={{fontWeight:400,marginLeft:"10px"}}>{to}</h3>
            </div>
            <div className={styles.ColName} style={{width:'20%'}}>
                <h3 style={{fontWeight:400,marginLeft:"10px"}}>Closest to Airport</h3>
            </div>        
        </div>
  );
}
