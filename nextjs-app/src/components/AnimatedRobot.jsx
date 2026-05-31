import React from 'react';
import styles from './AnimatedRobot.module.css';

export default function AnimatedRobot() {
  return (
    <div className={styles.robotContainer}>
      {/* Animasyonlu Zemin Gölgesi */}
      <div className={styles.floorShadow}></div>

      {/* Robot Fotoğrafı ve Animasyon Wrapper'ı */}
      <div className={styles.floatBody}>
        <img 
          src="/robot.png" 
          alt="Gerçek 3D Robot Mascot" 
          className={styles.realRobotImage} 
        />
      </div>
    </div>
  );
}
