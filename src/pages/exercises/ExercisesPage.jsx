import Card from '../../components/card';
import './style.css';
import { exercises } from '../../service/mockData';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { useState } from 'react';

function ExercisesPage() {
  const cohort = exercises.data[0];
  const courses = cohort.courses;

  const [selectedCourseId, setSelectedCourseId] = useState(courses[0].id); // default: first course
  const [openModules, setOpenModules] = useState([]); // track open module IDs
  const [openUnits, setOpenUnits] = useState([]); // track open unit IDs

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  const toggleModule = (moduleId) => {
    setOpenModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const toggleUnit = (unitId) => {
    setOpenUnits((prev) =>
      prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId]
    );
  };

  return (
    <main>
      <Card>
        <div className="card-section">
          <h3>My Exercises</h3>
        </div>

        {/* Course Selector */}
        <div className="card-section">
          <p className="header-font">Course</p>
          <select
            className="course-select"
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(Number(e.target.value));
              setOpenModules([]);
              setOpenUnits([]);
            }}
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Modules */}
        {selectedCourse.modules.map((module) => (
          <div key={module.id} className="card-section">
            {/* Module row */}
            <div className="module-row" onClick={() => toggleModule(module.id)}>
              <div className="module-text">
                <p className="header-font">Module</p>
                <p className="course-module-unit-font">{module.name}</p>
              </div>
              <span className="arrow-toggle">
                {openModules.includes(module.id) ? (
                  <MdKeyboardArrowUp size={32} />
                ) : (
                  <MdKeyboardArrowDown size={32} />
                )}
              </span>
            </div>

            {/* Units */}
            {openModules.includes(module.id) && (
              <div className="units-grid">
                {module.units.map((unit) => (
                  <div key={unit.id} className="unit">
                    <div className="unit-row" onClick={() => toggleUnit(unit.id)}>
                      <div className="unit-text">
                        <p className="header-font">Unit</p>
                        <p className="course-module-unit-font">{unit.name}</p>
                      </div>
                      <span className="arrow-toggle">
                        {openUnits.includes(unit.id) ? (
                          <MdKeyboardArrowUp size={32} />
                        ) : (
                          <MdKeyboardArrowDown size={32} />
                        )}
                      </span>
                    </div>

                    {openUnits.includes(unit.id) && (
                      <ul className="exercise-list">
                        {unit.exercises.map((e) => (
                          <li key={e.id}>
                            <label>
                              <input type="checkbox" defaultChecked={e.completed} />
                              <span className="check-circle"></span>
                              {e.name}
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </Card>
    </main>
  );
}

export default ExercisesPage;
