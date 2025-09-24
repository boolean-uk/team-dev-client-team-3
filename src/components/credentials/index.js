import FullLogo from '../../assets/fullLogo';
import { NavLink } from 'react-router-dom';
import './credentials.css';
import Card from '../card';

const CredentialsCard = ({
  title,
  socialLinksTitle,
  altButtonTitle,
  altButtonLink,
  altButtonText,
  children,
  error = null
}) => {
  return (
    <div className="credentials">
      <Card boxShadow={true}>
        <div className="credentials-logo">
          <FullLogo textColour={'#000000ff'} />
        </div>
        <h1 className="credentials-title h3">{title && title}</h1>

        {error ? (
          <p aria-label="loginErrorMessage" style={{ color: 'red' }}>
            {error}
            <br />
            <br />
          </p>
        ) : null}

        {children}
        {/* <div className="credentials-sociallinks">
          <p>{socialLinksTitle && socialLinksTitle}</p>
          <div className="credentials-sociallinks-links">
            <SocialLinks />
          </div>
        </div> */}
        <div className="credentials-altbutton">
          <p>{altButtonTitle && altButtonTitle}</p>
          <NavLink to={altButtonLink} className="button offwhite">
            {altButtonText}
          </NavLink>
        </div>
      </Card>
    </div>
  );
};

export default CredentialsCard;
