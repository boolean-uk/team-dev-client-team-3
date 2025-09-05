import Card from '../../components/card';
import ProfileCircle from '../../components/profileCircle';

const cohort = {
  name: 'Software Development Cohort 4',
  students: [
    'Alice Johnson',
    'Bob Smith',
    'Charlie Brown',
    'David Lee',
    'Eva Green',
    'Frank White'
  ],
  teacher: 'John Smith',
  exercises: ['Modules: 2/17 completed ', 'Units: 4/10 completed', 'Exercises: 34/58 completed']
};

const CohortPage = () => {
  return (
    <>
      <main>
        <Card style={{ padding: '1rem' }}>
          <h2>My cohort</h2>
          <hr
            style={{ border: '0', borderBottom: '1px solid rgba(0,0,0,0.1)', margin: '0.5rem 0' }}
          />

          <p>{cohort.name}</p>
          <hr
            style={{ border: '0', borderBottom: '1px solid rgba(0,0,0,0.1)', margin: '0.5rem 0' }}
          />

          <div
            className="students-list"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            {cohort.students.map((student, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: 'calc(50% - 0.5rem)',
                  marginBottom: '1rem'
                }}
              >
                <ProfileCircle fullName={student} showMenu={false} />
                <p style={{ marginLeft: '0.5rem' }}>{student}</p>
              </div>
            ))}
          </div>
        </Card>
      </main>

      <aside>
        <Card style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ marginLeft: '0.5rem' }}>
            <h4>Teachers</h4>
            <ProfileCircle fullName={cohort.teacher} showMenu={false} />
            <p>{cohort.teacher}</p>
          </div>
        </Card>

        <Card>
          <h4>My Exercises</h4>
          <ul>
            {cohort.exercises.map((exercise, index) => (
              <li key={index}>{exercise}</li>
            ))}
          </ul>
        </Card>
      </aside>
    </>
  );
};

export default CohortPage;
