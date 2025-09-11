// src/pages/StudentSearchView.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../../components/card';
import ProfileCircle from '../../components/profileCircle';
import TextInput from '../../components/form/textInput';
import { TEST_DATA_GET_USER_COHORT } from '../dashboard/testData'; // Change to API call later
import SearchIcon from '../../assets/icons/searchIcon';
import { FiArrowLeft } from 'react-icons/fi';

const StudentSearchView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialQuery = new URLSearchParams(location.search).get('q') || '';

  const [searchVal, setSearchVal] = useState(initialQuery);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const lowerQuery = searchVal.toLowerCase();
    const filtered = TEST_DATA_GET_USER_COHORT.people.filter(
      (u) =>
        u.firstName.toLowerCase().includes(lowerQuery) ||
        u.lastName.toLowerCase().includes(lowerQuery) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(lowerQuery)
    );
    setResults(filtered);
  }, [searchVal]);

  const onChange = (e) => {
    setSearchVal(e.target.value);
  };
  return (
    <main style={{ display: 'flex', gap: '1rem' }}>
      <section style={{ flex: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <FiArrowLeft size={24} style={{ cursor: 'pointer' }} onClick={() => navigate('/')} />
          <h3 style={{ margin: 0 }}>Search for people</h3>
        </div>

        <Card>
          <form onSubmit={(e) => e.preventDefault()}>
            <TextInput
              icon={<SearchIcon />}
              placeholder="Search for people"
              value={searchVal}
              onChange={onChange}
            />
          </form>

          <div style={{ marginTop: '1rem' }}>
            {results.length === 0 && <p>No users found.</p>}

            {results.map((u) => (
              <div
                key={u.id}
                onClick={() => navigate(`/profile/${u.id}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  margin: '0.5rem 0'
                }}
              >
                <ProfileCircle fullName={`${u.firstName} ${u.lastName}`} />
                <span style={{ marginLeft: '1rem' }}>{`${u.firstName} ${u.lastName}`}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
};

export default StudentSearchView;
