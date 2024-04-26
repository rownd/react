import './Welcome.css'
import { useRownd } from '../../../../../src/index';

function Welcome() {
  const { is_initializing, is_authenticated } = useRownd();
  return (
    <>
      {is_initializing && <h1>Initializing...</h1>}
      {is_authenticated ? <h1>Authenticated</h1> : <h1>Un-authenticated</h1>}
    </>
  )
}

export default Welcome
