import { useState, useEffect } from 'react';
import Card from '../card';
import ProfileCircle from '../profileCircle';
import SearchIcon from '../../assets/icons/searchIcon';
import { getUsersByName } from '../../service/apiClient';
import useModal from '../../hooks/useModal';
import Button from '../button';
import './addUserModal.css';
import TextInput from '../form/textInput';
const AddUserModal = ({ onSelectUser, roleFilter, existingUsers }) => {
  const { closeModal } = useModal();
  const [searchVal, setSearchVal] = useState('');
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const existingUserIds = new Set(existingUsers.map((u) => u.id));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsersByName('');
        const jsonData = await response.json();
        let users = jsonData.data.users;

        if (roleFilter != null) {
          users = users.filter((u) => u.role === roleFilter);
        }

        setResults(users);
        setFilteredResults(users);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [roleFilter]);

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

  const handleSelectUser = () => {
    if (!selectedUserId) return;
    const selectedUser = filteredResults.find((u) => u.id === selectedUserId);
    onSelectUser(selectedUser);
    closeModal();
  };

  return (
    <div className="add-user-modal">
      <Card>
        <form onSubmit={(e) => e.preventDefault()} className="modal-search-form">
          <TextInput
            icon={<SearchIcon />}
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search..."
          />
        </form>

        <div className="modal-search-results scrollable-list">
          {filteredResults.length === 0 && <p className="no-results">No users found.</p>}
          {filteredResults.map((u) => {
            const isExisting = existingUserIds.has(u.id);
            return (
              <div
                key={u.id}
                className={`modal-search-result ${selectedUserId === u.id ? 'selected' : ''} ${isExisting ? 'disabled' : ''}`}
                onClick={() => !isExisting && setSelectedUserId(u.id)}
              >
                <div className="modal-result-avatar-name">
                  <ProfileCircle fullName={`${u.firstName} ${u.lastName}`} photoUrl={u.photo} />
                  <div className="modal-result-name">
                    <p>
                      {u.firstName} {u.lastName} {isExisting && '(Already in course)'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="modal-actions">
          <Button text="Cancel" classes="offwhite" onClick={closeModal} />
          <Button text="Add" classes="blue" disabled={!selectedUserId} onClick={handleSelectUser} />
        </div>
      </Card>
    </div>
  );
};

export default AddUserModal;
