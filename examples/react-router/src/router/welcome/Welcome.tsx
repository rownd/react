import './Welcome.scss';
import WelcomeImg from '../../assets/welcome.png';
import { Link } from 'react-router-dom';
import { useRownd } from '@rownd/react';
import Pill from '../../common/pill/Pill';

function Welcome() {
  const { manageAccount, is_authenticated, auth_level, requestSignIn } =
    useRownd();

  const isInstantUser = is_authenticated && auth_level === 'instant';

  return (
    <div className="welcome">
      <Pill />

      <div className="welcome__title">Welcome to the instant experience</div>
      {!is_authenticated ||
        (isInstantUser && (
          <button className="welcome__sign-in" onClick={() => requestSignIn()}>
            Sign in or sign up
          </button>
        ))}
      <img className="welcome__image" src={WelcomeImg} />
      <div className="welcome__cards">
        <div className="welcome__card">
          <div className="welcome__card__title">Check out your profile</div>
          <button className="secondary" onClick={() => manageAccount()}>
            My profile
          </button>
        </div>

        <div className="welcome__card">
          <div className="welcome__card__title">Go to the dashboard</div>
          <Link to={'/dashboard'}>Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
