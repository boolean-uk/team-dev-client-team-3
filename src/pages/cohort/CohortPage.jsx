import { useState } from 'react';
import Card from '../../components/card';
import Cohorts from '../../components/cohorts';
import Students from '../../components/students';
import Teachers from '../../components/teachers';
import Button from '../../components/button';
import { cohorts as mockCohorts } from '../../service/mockData';
import useAuth from '../../hooks/useAuth';
import CohortListItem from '../../components/cohorts/cohortListItem';

const CohortPage = () => {
  const { user } = useAuth();
  const [selectedCohort, setSelectedCohort] = useState(null);

  const handleSelectCohort = (cohort) => {
    setSelectedCohort(cohort);
  };

  const renderTeacherView = () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <main style={{ flex: 1 }}>
        <Card>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}
          >
            <h3>Cohorts</h3>
            <Button
              text="Add Cohort"
              classes="offwhite"
              size="small"
              onClick={() => console.log('Add Cohort clicked')}
            />
          </div>

          <Cohorts data={mockCohorts} showTitle={false} onSelectCohort={handleSelectCohort} />
        </Card>
      </main>

      <aside style={{ flex: 2 }}>
        <Card>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}
          >
            {selectedCohort ? (
              <CohortListItem cohort={selectedCohort} />
            ) : (
              <p>Please select a cohort to see students and teachers.</p>
            )}

            <Button
              text="Add Student"
              classes="offwhite"
              size="small"
              onClick={() => console.log('Add Student clicked')}
            />
          </div>

          {selectedCohort ? (
            <Students
              data={selectedCohort.students.map((name, idx) => ({ id: idx, fullName: name }))}
            />
          ) : null}
        </Card>

        <Card>
          {selectedCohort ? (
            <Teachers data={[{ id: 0, fullName: selectedCohort.teacher }]} />
          ) : (
            <p>Please select a cohort to see students and teachers.</p>
          )}
        </Card>
      </aside>
    </div>
  );

  const renderStudentView = () => (
    <main>
      <Card>
        <h2>My cohort</h2>
        <p>{mockCohorts[0].name}</p>
        <Students
          data={mockCohorts[0].students.map((name, idx) => ({ id: idx, fullName: name }))}
          showTitle={true}
        />
      </Card>
    </main>
  );

  // ENDRE HER FOR Å ENDRE TEACHER/STUDENT VIEW!
  return user.role === 0 ? renderStudentView() : renderTeacherView();
};

export default CohortPage;
