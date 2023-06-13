import React, { FC } from 'react';
import styles from './UserInfo.module.scss';

type PropsType = {
  avatarUrl: string
  firstName: string
  additionalText: string
}


export const UserInfo: FC<PropsType> = ({ avatarUrl, firstName, additionalText }) => {
  return (
    <div className={styles.root}>
      <img className={styles.avatar} src={avatarUrl || '/noavatar.png'} alt={firstName} />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{firstName}</span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
