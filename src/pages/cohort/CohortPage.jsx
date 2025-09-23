import { useState, useEffect } from 'react';
import Card from '../../components/card';
import Cohorts from '../../components/cohorts';
import Students from '../../components/students';
import Teachers from '../../components/teachers';
import Button from '../../components/button';
import useAuth from '../../hooks/useAuth';
import CohortListItem from '../../components/cohorts/cohortListItem';
import { addUserToCohort, getCohorts, postCohort } from '../../service/apiClient';
import Loader from '../../components/loader/Loader';

const CohortPage = () => {
  const { user } = useAuth();
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        setLoading(true);
        const response = await getCohorts();
        if (!response.ok) throw new Error('Failed to fetch cohorts');

        const json = await response.json();
        const cohortData = json.data || json;
        setCohorts(cohortData);

        if (cohortData.length > 0) {
          setSelectedCohort(cohortData[0]);
        }
      } catch (error) {
        console.error('Error fetching cohorts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCohorts();
  }, []);

  const handleSelectCohort = (cohort) => {
    setSelectedCohort(cohort);
  };

  const handleCreateCohort = async () => {
    const title = prompt('Enter cohort title:');
    if (!title) return;

    try {
      setLoading(true);
      const newCohort = await postCohort({ title });
      setCohorts((prev) => [...prev, newCohort]); // update state
      setSelectedCohort(newCohort); // optionally select it
    } catch (error) {
      alert('Failed to create cohort');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!selectedCohort) {
      alert('Please select a cohort first.');
      return;
    }

    const userId = prompt('Enter the ID of the student to add:');
    const courseId = prompt('Enter the ID of the course:');
    if (!userId || !courseId) return;

    try {
      setLoading(true);
      await addUserToCohort(selectedCohort.id, userId, courseId);

      const response = await getCohorts();
      const json = await response.json();
      const cohortData = json.data || json;
      setCohorts(cohortData);
      setSelectedCohort(cohortData.find((c) => c.id === selectedCohort.id));
    } catch (error) {
      alert('Failed to add student to cohort');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader isLoading={loading} />;
  if (!cohorts.length) return <p>No cohorts available.</p>;

  const getAllStudents = (cohort) =>
    cohort ? cohort.courses.flatMap((course) => course.students || []) : [];

  const getAllTeachers = (cohort) =>
    cohort ? cohort.courses.flatMap((course) => course.teachers || []) : [];
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
              onClick={handleCreateCohort}
            />
          </div>

          <Cohorts data={cohorts} showTitle={false} onSelectCohort={handleSelectCohort} />
        </Card>
      </main>

      <aside style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {selectedCohort && (
          <>
            <Card>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}
              >
                <h2>{selectedCohort.title}</h2>
                <Button
                  type="button"
                  text="Add Student"
                  classes="offwhite"
                  size="small"
                  onClick={handleAddStudent}
                />
              </div>

              <CohortListItem cohort={selectedCohort} />
              <Students data={getAllStudents(selectedCohort)} />
            </Card>

            <Card>
              <Teachers data={getAllTeachers(selectedCohort)} />
            </Card>
          </>
        )}
        {!selectedCohort && <p>Please select a cohort to see students and teachers.</p>}
      </aside>
    </div>
  );

  const renderStudentView = () => (
    <main>
      {selectedCohort ? (
        <Card>
          <h2>{selectedCohort.title}</h2>
          <Students data={getAllStudents(selectedCohort)} showTitle={true} />
          <Teachers data={getAllTeachers(selectedCohort)} />
        </Card>
      ) : (
        <p>You are not assigned to a cohort.</p>
      )}
    </main>
  );

  return user.role === 0 ? renderStudentView() : renderTeacherView();
};

export default CohortPage;
