// src/pages/StudentSearchView.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../../components/card';
import ProfileCircle from '../../components/profileCircle';
import TextInput from '../../components/form/textInput';
import SearchIcon from '../../assets/icons/searchIcon';
import { FiArrowLeft } from 'react-icons/fi';
import { getUsersByName } from '../../service/apiClient';
import './StudentSearchView.css'; // 👈 import css
import { SlOptions } from 'react-icons/sl';
import useAuth from '../../hooks/useAuth';

const StudentSearchView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialQuery = new URLSearchParams(location.search).get('q') || '';

  const [searchVal, setSearchVal] = useState('');
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsersByName(initialQuery);
        const jsonData = await response.json();
        console.log(jsonData);
        setResults(jsonData.data.users);
        setFilteredResults(jsonData.data.users);
      } catch (err) {
        console.error('Error getting users: ', err);
      }
    };

    fetchUsers();
  }, [initialQuery]);

  useEffect(() => {
    const lowerQuery = searchVal.toLowerCase();
    const filtered = results.filter(
      (u) =>
        u.firstName.toLowerCase().includes(lowerQuery) ||
        u.lastName.toLowerCase().includes(lowerQuery) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(lowerQuery)
    );
    setFilteredResults(filtered);
  }, [searchVal, results]);

  const onChange = (e) => {
    setSearchVal(e.target.value);
  };

  return (
    <main className="student-search-main">
      <section className="student-search-section">
        <div className="student-search-header">
          <FiArrowLeft size={24} style={{ cursor: 'pointer' }} onClick={() => navigate('/')} />
          <h3>Search for people</h3>
        </div>

        <Card>
          <form onSubmit={(e) => e.preventDefault()}>
            <TextInput
              icon={<SearchIcon />}
              placeholder="Search for people"
              value={searchVal}
              onChange={onChange}
            />
            {initialQuery && (
              <div className="reset-chip" onClick={() => navigate('/search?q=')}>
                Name={initialQuery}
                <span className="chip-close">X</span>
              </div>
            )}
          </form>

          <div className="search-results">
            {filteredResults.length === 0 && <p>No users found.</p>}

            {filteredResults.map((u) => {
              if (!u.firstName) {
                return <></>;
              }

              // Teacher
              if (user.role === 1 || user.role === '1') {
                return (
                  <div key={u.id} className={'search-result-teacher'}>
                    <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/profile/${u.id}`)}>
                      <ProfileCircle fullName={`${u.firstName} ${u.lastName}`} />
                    </div>
                    <div>
                      <p className="search-user-cohort">
                        {u.firstName} {u.lastName}
                      </p>
                      {/* Empty cohorts get a random cohort to ensure nice formatting */}
                      <p>{u.cohort ? u.cohort : 'Software Developer,  Cohort 69'}</p>
                    </div>
                    <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/profile/${u.id}`)}>
                      Profile
                    </div>
                    <div>Add note</div>
                    <div>Move to cohort</div>
                    <div className="options-button">
                      <SlOptions />
                    </div>
                  </div>
                );
              }

              // Student
              return (
                <div key={u.id} className="search-result-student">
                  <div className="search-result-avatar-name">
                    <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/profile/${u.id}`)}>
                      <ProfileCircle fullName={`${u.firstName} ${u.lastName}`} />
                    </div>
                    <div>
                      <p className="search-user-cohort">
                        {u.firstName} {u.lastName}
                      </p>
                      {/* Empty cohorts get a random cohort to ensure nice formatting */}
                      <p>{u.cohort ? u.cohort : 'Software Developer,  Cohort 69'}</p>
                    </div>
                  </div>
                  <div
                    className="search-result-profile"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/profile/${u.id}`)}
                  >
                    Profile
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>
    </main>
  );
};

export default StudentSearchView;
