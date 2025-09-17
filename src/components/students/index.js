import { SingleLineListItem } from '../avatarList/singleLineListItem';
import './style.css';

const Students = ({ data }) => {
  return (
    <>
      <h4>Students</h4>
      <hr className="avatar-list-divider" />
      <div className="students-list-container">
        {data.map((student) => (
          <SingleLineListItem key={student.id} user={student} />
        ))}
      </div>
    </>
  );
};

export default Students;
