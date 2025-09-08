import './style.css';
import TextInput from '../../components/form/textInput';
import Form from '../../components/form';
import ProfileCircle from '../../components/profileCircle';

const ProfilePage = () => {
  const user = {
    firstName: 'Alex',
    lastName: 'Jameson',
    username: 'AlexUsername',
    githubUsername: 'AlexGithub',
    role: 'student',
    specialization: 'frontend',
    cohort: 'cohort 3',
    startDate: 'someDate',
    endDate: 'someDate',
    email: 'alexjameson@mail.com',
    mobile: 12345678,
    password: 'somePassword'
  };

  return (
    <>
      <main className="welcome-formheader">
        <Form>
          <section>
            <h3>Basic info</h3>
            <div className="welcome-form-inputs">
              <div>
                <label htmlFor="photo">Photo</label>
                <ProfileCircle
                  id="photo"
                  fullName={user.firstName + ' ' + user.lastName}
                  showMenu={false}
                />
              </div>
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
              <TextInput label={'Role'} name="role" value={user.role} />
              <TextInput
                label={'Specialization'}
                name="specialization"
                value={user.specialization}
              />
              <TextInput label={'Cohort'} name="cohort" value={user.cohort} />
              <TextInput label={'Start Date'} name="startDate" value={user.startDate} />
              <TextInput label={'End Date'} name="endDate" value={user.endDate} />
            </div>
          </section>
        </Form>
        <Form>
          <section>
            <h3>Contact info</h3>
            <div className="welcome-form-inputs">
              <TextInput label={'Email'} name="email" value={user.email} />
              <TextInput label={'Mobile'} name="mobile" value={user.mobile} />
              <TextInput label={'Password'} name="password" value={user.password} />
            </div>
          </section>
        </Form>
        <Form>
          <section>
            <h3>Bio</h3>
            <div>
              <label htmlFor="bio">Bio</label>
              <textarea
                className="bio"
                maxLength={300}
                disabled
                id="bio"
                name="bio"
                value={user.bio}
              ></textarea>
              <span id="charCount">0/300</span>
            </div>
          </section>
        </Form>
      </main>
    </>
  );
};

export default ProfilePage;
