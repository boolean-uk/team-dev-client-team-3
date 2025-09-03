import useModal from '../../hooks/useModal';
import Card from '../card';
import Comment from '../comment';
import EditPostModal from '../editPostModal';
import ProfileCircle from '../profileCircle';
import './style.css';

const Post = ({ name, date, content, comments = [], likes = 0 }) => {
  const { openModal, setModal } = useModal();

  const datetime = new Date(date);
  const day = datetime.getUTCDate();
  const month = datetime.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  const hours = String(datetime.getUTCHours()).padStart(2, '0');
  const minutes = String(datetime.getUTCMinutes()).padStart(2, '0');

  const showModal = () => {
    setModal('Edit post', <EditPostModal />);
    openModal();
  };

  return (
    <Card>
      <article className="post">
        <section className="post-details">
          <ProfileCircle fullName={name} />

          <div className="post-user-name">
            <p>{name}</p>
            <small>{`${day} ${month} at ${hours}:${minutes}`}</small>
          </div>

          <div className="edit-icon">
            <p onClick={showModal}>...</p>
          </div>
        </section>

        <section className="post-content">
          <p>{content}</p>
        </section>

        <section
          className={`post-interactions-container border-top ${comments.length ? 'border-bottom' : null}`}
        >
          <div className="post-interactions">
            <div>Like</div>
            <div>Comment</div>
          </div>

          <p>{!likes && 'Be the first to like this'}</p>
        </section>

        <section>
          {comments.map((comment) => (
            <Comment key={comment.id} name={comment.name} content={comment.content} />
          ))}
        </section>
      </article>
    </Card>
  );
};

export default Post;
