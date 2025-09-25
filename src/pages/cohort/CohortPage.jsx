import { useState, useEffect } from 'react';
import Card from '../../components/card';
import Students from '../../components/students';
import Teachers from '../../components/teachers';
import Button from '../../components/button';
import useAuth from '../../hooks/useAuth';
import useModal from '../../hooks/useModal';
import {
  addUserToCohort,
  getCohorts,
  getCohortsForUser,
  postCohort
} from '../../service/apiClient';
import Loader from '../../components/loader/Loader';
import Cohorts from '../../components/cohorts';
import './style.css';
import CreateCohortModal from '../../components/createCohortModal';

const CohortPage = () => {
  const { user } = useAuth();
  const { openModal, setModal } = useModal();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cohorts
  useEffect(() => {
    const fetchCohorts = async () => {
      setLoading(true);
      try {
        const response = user.role === 0 ? await getCohortsForUser(user.id) : await getCohorts();
        const cohortData = response.data || response;
        setCohorts(cohortData);

        // default to first course
        if (cohortData.length && cohortData[0].courses.length) {
          const firstCourse = cohortData[0].courses[0];
          setSelectedCourse({
            ...firstCourse,
            cohortId: cohortData[0].id,
            cohortTitle: cohortData[0].title
          });
        }
      } catch (err) {
        console.error('Error fetching cohorts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCohorts();
  }, [user]);

  const handleCreateCohortPost = async (title) => {
    try {
      setLoading(true);
      const newCohort = await postCohort({ title });
      setCohorts((prev) => [...prev, newCohort]);
    } catch {
      alert('Failed to create cohort');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCohort = async () => {
    setModal('Add a cohort', <CreateCohortModal onPostSubmit={handleCreateCohortPost} />);
    openModal();
  };

  const handleAddStudent = async () => {
    if (!selectedCourse) return alert('Please select a course first.');
    const userId = prompt('Enter the ID of the student to add:');
    if (!userId) return;

    try {
      setLoading(true);
      await addUserToCohort(selectedCourse.cohortId, userId, selectedCourse.id);

      // Refresh cohorts
      const response = await getCohorts();
      const cohortData = response.data || response;
      setCohorts(cohortData);

      // Re-select updated course
      const updatedCohort = cohortData.find((c) => c.id === selectedCourse.cohortId);
      const updatedCourse = updatedCohort?.courses.find((c) => c.id === selectedCourse.id);
      if (updatedCourse) {
        setSelectedCourse({
          ...updatedCourse,
          cohortId: updatedCohort.id,
          cohortTitle: updatedCohort.title
        });
      }
    } catch (err) {
      alert('Failed to add student');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader isLoading={loading} />;
  if (!cohorts.length) {
    return (
      <div className="no-cohorts-container">
        <h2>No cohorts available</h2>
        <p>
          You haven’t been assigned to any cohorts yet. Ask your teacher to assign you so you can
          see your peers and teachers.
        </p>
      </div>
    );
  }

  const courseList = cohorts
    .flatMap((cohort) =>
      cohort.courses.map((course) => ({
        ...course,
        cohortId: cohort.id,
        cohortTitle: cohort.title
      }))
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  };

  const renderTeacherView = () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <main style={{ flex: 1 }}>
        <Card>
          <div style={cardStyle}>
            <h3>Courses</h3>
            <Button
              text="Add Cohort"
              classes="offwhite"
              size="small"
              onClick={handleCreateCohort}
            />
          </div>
          <Cohorts data={courseList} onSelectCohort={setSelectedCourse} />
        </Card>
      </main>

      <aside style={{ flex: 2 }}>
        {selectedCourse ? (
          <>
            <Card>
              <div style={cardStyle}>
                <div>
                  <h2>{selectedCourse.title}</h2>
                  <small>{selectedCourse.cohortTitle}</small>
                </div>
                <Button
                  text="Add Student"
                  classes="offwhite"
                  size="small"
                  onClick={handleAddStudent}
                />
              </div>
              <Students
                data={selectedCourse.students || []}
                listClassName="students-list-cohorts"
              />
            </Card>

            <Card>
              <Teachers
                data={selectedCourse.teachers || []}
                listClassName="teachers-list-container-cohorts"
              />
            </Card>
          </>
        ) : (
          <p>Please select a course to see its students and teachers.</p>
        )}
      </aside>
    </div>
  );

  const renderStudentView = () => (
    <main>
      {selectedCourse ? (
        <>
          <Card>
            <h2>{selectedCourse.title}</h2>
            <small>{selectedCourse.cohortTitle}</small>
            <Students
              data={selectedCourse.students || []}
              showTitle
              listClassName="students-list-cohorts"
            />
          </Card>

          <Card>
            <Teachers
              data={selectedCourse.teachers || []}
              listClassName="teachers-list-container-cohorts"
            />
          </Card>
        </>
      ) : (
        <p>You are not assigned to a course.</p>
      )}
    </main>
  );

  return user.role === 0 ? renderStudentView() : renderTeacherView();
};

export default CohortPage;
