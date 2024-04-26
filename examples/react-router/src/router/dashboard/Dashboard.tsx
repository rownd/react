import { RequireSignIn } from '../../../../../src/index.tsx';

const Dashboard = () => {
  return (
    <h1>
      Dashboard
      <RequireSignIn />
    </h1>
  );
};

export default Dashboard;
