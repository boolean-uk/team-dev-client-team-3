import './style.css';
import TextInput from '../../components/form/textInput';
import Form from '../../components/form';

const ProfilePage = () => {
  const user = {
    firstName: 'Alex',
    lastName: 'Jameson',
    username: 'AlexUsername',
    githubUsername: 'AlexGithub'
  };

  return (
    <>
      <main>
        <Form>
          <section>
            <h3>Basic info</h3>
            <div className="welcome-form-inputs">
              <TextInput label={'First Name'} name="firstName" value={user.firstName} />
              <TextInput label={'Last Name'} name="lastName" value={user.lastName} />
              <TextInput label={'Username'} name="username" value={user.username} />
              <TextInput label={'Github Username'} name="githubName" value={user.githubUsername} />
            </div>
          </section>
        </Form>
        <Form>
          <section>
            <h3>Training info</h3>
            <div className="welcome-form-inputs">
              <TextInput label={'Role'} name="" value={""} />
              <TextInput label={'Specialization'} name="" value={""} />
              <TextInput label={'Cohort'} name="" value={""} />
              <TextInput label={'Start Date'} name="" value={""} />
              <TextInput label={'End Date'} name="" value={""} />
            </div>
          </section>
        </Form>
        <Form>
          <section>
            <h3>Contact info</h3>
            <div className="welcome-form-inputs">
              <TextInput label={'Email'} name="" value={""} />
              <TextInput label={'Mobile'} name="" value={""} />
              <TextInput label={'Password'} name="" value={""} />
            </div>
          </section>
        </Form>
        <Form>
          <section>
            <h3>Bio</h3>
            <div className="welcome-form-inputs">
              <label htmlFor="bio">Bio</label>
              <textarea id="bio" name="bio" value={user.bio}></textarea>
            </div>
          </section>
        </Form>
      </main>
    </>
  );
};

export default ProfilePage;
