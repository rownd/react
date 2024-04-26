import { Link } from 'react-router-dom';
import { RequireSignIn } from '../../../../../src/index.tsx';

const Dashboard = () => {
  return (
    <>
      <h1>Dashboard</h1>
      <Link to={'/'}>Go home</Link>
      <RequireSignIn />
    </>
  );
};

export default Dashboard;
