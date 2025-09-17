import React from 'react';
import CohortListItem from './cohortListItem';
import './style.css';

const Cohorts = ({ data }) => {
  return (
    <>
      <h4>Cohorts</h4>
      <hr className="avatar-list-divider" />
      <div className="cohorts-list-container">
        {data.map((cohort, index) => (
          <CohortListItem key={index} cohort={cohort} />
        ))}
      </div>
    </>
  );
};

export default Cohorts;
