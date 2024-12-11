import './App.css'
import { useRownd } from '../../../src/context';

function App() {
  const { is_authenticated, user } = useRownd();

  return (
    <>
      <div>
        Is authenticated? {is_authenticated ? 'Yes' : 'No'}
        {is_authenticated && (
          <div>
            <div>User: {JSON.stringify(user)}</div>
          </div> 
        )}
      </div>
    </>
  )
}

export default App
