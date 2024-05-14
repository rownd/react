import './Dashboard.scss';
import React from 'react';
import Table from '../../assets/sample-app-table.svg';
import Graph from '../../assets/sample-app-graph.svg';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="dashboard__title">Dashboard</div>
      <div className="dashboard__header">
        <strong>App name</strong>: app 1
      </div>

      <div className="dashboard__cards">
        <div className="dashboard__card">
          <div className="dashboard__card__title">Recent activity</div>
          <img src={Table} />
        </div>

        <div className="dashboard__card">
          <div className="dashboard__card__title">Sample graph</div>
          <img src={Graph} />
        </div>
      </div>

      <div className='dashboard__action-card'>
        <div className='dashboard__action-card__title'>
          Another feature
        </div>
        <div className='dashboard__action-card__subtitle'>
          subtitle
        </div>
        <button className='dashboard__action-card__button'>
          action
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
