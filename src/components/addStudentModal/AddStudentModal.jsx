import { useState, useEffect } from 'react';
import Card from '../card';
import ProfileCircle from '../profileCircle';
import TextInput from '../form/textInput';
import SearchIcon from '../../assets/icons/searchIcon';
import { getUsersByName } from '../../service/apiClient';
import useModal from '../../hooks/useModal';
import Button from '../button';
import './addStudentModal.css';

const AddStudentModal = ({ onSelectStudent }) => {
  const { closeModal } = useModal();
  const [searchVal, setSearchVal] = useState('');
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsersByName('');
        const jsonData = await response.json();
        setResults(jsonData.data.users);
        setFilteredResults(jsonData.data.users);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

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

  const handleSelectStudent = () => {
    if (!selectedStudentId) return;
    onSelectStudent(selectedStudentId);
    closeModal();
  };

  return (
    <div className="add-student-modal">
      <Card>
        <form onSubmit={(e) => e.preventDefault()}>
          <TextInput
            icon={<SearchIcon />}
            placeholder="Search for students"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </form>

        <div className="search-results scrollable-list">
          {filteredResults.length === 0 && <p>No users found.</p>}
          {filteredResults.map((u) => (
            <div
              key={u.id}
              className={`search-result-student ${selectedStudentId === u.id ? 'selected' : ''}`}
              onClick={() => setSelectedStudentId(u.id)}
            >
              <div className="search-result-avatar-name">
                <ProfileCircle fullName={`${u.firstName} ${u.lastName}`} photoUrl={u.photo} />
                <div>
                  <p>{u.firstName} {u.lastName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
          <Button text="Cancel" classes="offwhite" onClick={closeModal} />
          <Button text="Add" classes="blue" disabled={!selectedStudentId} onClick={handleSelectStudent} />
        </div>
      </Card>
    </div>
  );
};

export default AddStudentModal;
