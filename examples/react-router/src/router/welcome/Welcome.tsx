import './Welcome.css'
import { useRownd } from '../../../../../src/index';
import { Link } from 'react-router-dom';

function Welcome() {
  const { is_initializing, is_authenticated } = useRownd();
  return (
    <>
      {is_initializing && <h1>Initializing...</h1>}
      {is_authenticated ? <h1>Authenticated</h1> : <h1>Un-authenticated</h1>}
      <Link to={'/dashboard'}>Go to Dashboard</Link>
    </>
  )
}

export default Welcome
