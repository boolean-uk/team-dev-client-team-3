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
import AddUserModal from '../../components/addStudentModal/AddUserModal';
import './style.css';

const CohortPage = () => {
  const { user } = useAuth();
  const { openModal, setModal } = useModal();

  const [cohorts, setCohorts] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [teachersLoading, setTeachersLoading] = useState(false);

  useEffect(() => {
    const fetchCohorts = async () => {
      setLoading(true);
      try {
        const response = user.role === 0 ? await getCohortsForUser(user.id) : await getCohorts();
        const data = response.data || response;
        setCohorts(data);

        if (data.length && data[0].courses.length) {
          const course = {
            ...data[0].courses[0],
            cohortId: data[0].id,
            cohortTitle: data[0].title
          };
          setSelectedCourse(course);
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
    setLoading(true);
    try {
      const newCohort = await postCohort({ title });
      setCohorts((prev) => [...prev, newCohort]);
    } catch {
      alert('Failed to create cohort');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = (role) => {
    const existingUsers =
      role === 0 ? selectedCourse.students || [] : selectedCourse.teachers || [];
    setModal(`Add a ${role === 0 ? 'student' : 'teacher'}`, () => (
      <AddUserModal
        onSelectUser={(user) => handleAddUserPost(user, role)}
        roleFilter={role}
        existingUsers={existingUsers}
      />
    ));
    openModal();
  };

  const handleAddUserPost = async (userToAdd, role) => {
    if (!selectedCourse) return;

    const setLoadingState = role === 0 ? setStudentsLoading : setTeachersLoading;
    setLoadingState(true);

    try {
      await addUserToCohort(selectedCourse.cohortId, userToAdd.id, selectedCourse.id);

      setCohorts((prev) => {
        const updated = prev.map((c) => {
          if (c.id !== selectedCourse.cohortId) return c;

          return {
            ...c,
            courses: c.courses.map((course) => {
              if (course.id !== selectedCourse.id) return course;
              const key = role === 0 ? 'students' : 'teachers';
              const exists = course[key]?.some((u) => u.id === userToAdd.id);
              if (exists) return course;
              return { ...course, [key]: [...(course[key] || []), userToAdd] };
            })
          };
        });

        const updatedCourse = updated
          .find((c) => c.id === selectedCourse.cohortId)
          .courses.find((course) => course.id === selectedCourse.id);

        setSelectedCourse({
          ...updatedCourse,
          cohortId: selectedCourse.cohortId,
          cohortTitle: selectedCourse.cohortTitle
        });

        return updated;
      });
    } catch (err) {
      alert(`Failed to add ${role === 0 ? 'student' : 'teacher'}`);
      console.error(err);
    } finally {
      setLoadingState(false);
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

  if (!cohorts.length) return <p>No cohorts available</p>;

  const courseList = cohorts
    .flatMap((c) =>
      c.courses.map((course) => ({ ...course, cohortId: c.id, cohortTitle: c.title }))
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  };

  const renderCourseSection = () => (
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
              onClick={() => handleAddUser(0)}
            />
            <Button
              text="Add Teacher"
              classes="offwhite"
              size="small"
              onClick={() => handleAddUser(1)}
            />
          </div>
        </div>

        {studentsLoading ? (
          <Loader isLoading={studentsLoading} />
        ) : (
          <Students data={selectedCourse.students || []} listClassName="students-list-cohorts" />
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
  );

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <main style={{ flex: 1 }}>
        <Card>
          <div style={cardStyle}>
            <h3>Courses</h3>
            <Button
              text="Add Cohort"
              classes="offwhite"
              size="small"
              onClick={() => {
                setModal(
                  'Add a cohort',
                  <CreateCohortModal onCohortSubmit={handleCreateCohortPost} />
                );
                openModal();
              }}
            />
          </div>
          <Cohorts data={courseList} onSelectCohort={setSelectedCourse} />
        </Card>
      </main>

      <aside style={{ flex: 2 }}>
        {selectedCourse ? renderCourseSection() : <p>Please select a course</p>}
      </aside>
    </div>
  );
};

export default CohortPage;
