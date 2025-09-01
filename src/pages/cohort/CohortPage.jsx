import Card from '../../components/card';
import ProfileCircle from '../../components/profileCircle';

const cohort = {
  name: 'Software Development Cohort 4',
  students: ['Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank'],
  teacher: 'Dr. Smith',
  exercises: ['React Assignment 1', 'Vue.js Project', 'Java Backend Exercise'],
};

const CohortPage = () => {
  return (
    <>
      <main>
        <h2>{cohort.name}</h2>
        <div className="students-list">
          {cohort.students.map((student, index) => (
            <Card key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <ProfileCircle initials={student[0]} showMenu={false} />
              <p style={{ marginLeft: '0.5rem' }}>{student}</p>
            </Card>
            

          ))}
        </div>
      </main>

      <aside>
        <Card style={{ marginBottom: '1rem' }}>
          <h4>Teacher</h4>
          <p>{cohort.teacher}</p>
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
