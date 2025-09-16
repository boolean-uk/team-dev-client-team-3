import React from 'react';
import CohortListItem from './cohortListItem';

const Cohorts = ({ data }) => {
  return (
    <>
      <h4>Cohorts</h4>
      <hr className="avatar-list-divider" />
      {data.map((cohort, index) => (
        <CohortListItem key={index} cohort={cohort} />
      ))}
    </>
  );
};

export default Cohorts;
