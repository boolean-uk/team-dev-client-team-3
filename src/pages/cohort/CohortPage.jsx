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
import CreateCohortModal from '../../components/createCohortModal';
import './style.css';
import AddUserModal from '../../components/addStudentModal/AddUserModal';

const CohortPage = () => {
  const { user } = useAuth();
  const { openModal, setModal } = useModal();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [teachersLoading, setTeachersLoading] = useState(false);

  // Fetch cohorts
  useEffect(() => {
    const fetchCohorts = async () => {
      setLoading(true);
      try {
        const response = user.role === 0 ? await getCohortsForUser(user.id) : await getCohorts();
        const cohortData = response.data || response;
        setCohorts(cohortData);

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

  // Add cohort
  const handleCreateCohortPost = async (title) => {
    try {
      setLoading(true);
      const newCohort = await postCohort({ title });
      setCohorts(prev => [...prev, newCohort]);
    } catch {
      alert('Failed to create cohort');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCohort = () => {
    setModal('Add a cohort', <CreateCohortModal onCohortSubmit={handleCreateCohortPost} />);
    openModal();
  };

  // Add student
  const handleAddStudentPost = async (studentId) => {
    if (!selectedCourse) return;

    try {
      setStudentsLoading(true);
      await addUserToCohort(selectedCourse.cohortId, studentId, selectedCourse.id);

      // Update local state
      setCohorts(prev => prev.map(c => {
        if (c.id !== selectedCourse.cohortId) return c;
        return {
          ...c,
          courses: c.courses.map(course => {
            if (course.id !== selectedCourse.id) return course;
            const studentExists = course.students?.some(s => s.id === studentId);
            if (studentExists) return course;
            return {
              ...course,
              students: [...(course.students || []), { id: studentId }]
            };
          })
        };
      }));
    } catch (err) {
      alert('Failed to add student');
      console.error(err);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleAddStudent = () => {
    setModal('Add a student', () => (
      <AddUserModal
        onSelectUser={handleAddStudentPost}
        roleFilter={0} // 0 = student
      />
    ));
    openModal();
  };



  // Add teacher
  const handleAddTeacherPost = async (teacherId) => {
    if (!selectedCourse) return;

    try {
      setTeachersLoading(true);
      await addUserToCohort(selectedCourse.cohortId, teacherId, selectedCourse.id);

      // Update local state
      setCohorts(prev => prev.map(c => {
        if (c.id !== selectedCourse.cohortId) return c;
        return {
          ...c,
          courses: c.courses.map(course => {
            if (course.id !== selectedCourse.id) return course;
            const teacherExists = course.teachers?.some(t => t.id === teacherId);
            if (teacherExists) return course;
            return {
              ...course,
              teachers: [...(course.teachers || []), { id: teacherId }]
            };
          })
        };
      }));
    } catch (err) {
      alert('Failed to add teacher');
      console.error(err);
    } finally {
      setTeachersLoading(false);
    }
  };

  const handleAddTeacher = () => {
    setModal('Add a teacher', () => (
      <AddUserModal
        onSelectUser={handleAddTeacherPost}
        roleFilter={1} // 1 = teacher
      />
    ));
    openModal();
  };

  if (loading)
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loader isLoading={loading} />
      </div>
    );

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
    .flatMap(cohort =>
      cohort.courses.map(course => ({
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
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    text="Add Student"
                    classes="offwhite"
                    size="small"
                    onClick={handleAddStudent}
                  />
                  <Button
                    text="Add Teacher"
                    classes="offwhite"
                    size="small"
                    onClick={handleAddTeacher}
                  />
                </div>
              </div>

              {studentsLoading ? (
                <Loader isLoading={studentsLoading} />
              ) : (
                <Students
                  data={selectedCourse.students || []}
                  listClassName="students-list-cohorts"
                />
              )}
            </Card>

            <Card>
              {teachersLoading ? (
                <Loader isLoading={teachersLoading} />
              ) : (
                <Teachers
                  data={selectedCourse.teachers || []}
                  listClassName="teachers-list-container-cohorts"
                />
              )}
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

            {studentsLoading ? (
              <Loader isLoading={studentsLoading} />
            ) : (
              <Students
                data={selectedCourse.students || []}
                showTitle
                listClassName="students-list-cohorts"
              />
            )}
          </Card>

          <Card>
            {teachersLoading ? (
              <Loader isLoading={teachersLoading} />
            ) : (
              <Teachers
                data={selectedCourse.teachers || []}
                listClassName="teachers-list-container-cohorts"
              />
            )}
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
