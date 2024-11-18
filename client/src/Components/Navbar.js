import React from 'react'
import styles from '../Styles/Navbar.module.css';

export default function Navbar() {
  return (
    <div className={styles.NavbarContainer}>
      <div className={styles.NavbarLeft}>
        <h2 className={styles.ProjectTitle}>Travel Planner</h2>
      </div>
      <div className={styles.NavbarRight}>
            <div className={styles.NavRightL}>
                <h4 className={styles.NavbarRC}>Create Plan</h4>
            </div>
            <div className={styles.NavRightR}>
                <h4 className={styles.NavbarRC}>Profile</h4>
            </div>
      </div>
    </div>
  )
}
