import React from 'react';
import './User.scss';
import Pill from '../../common/pill/Pill';
import { useRownd } from '@rownd/react';
import UserInfo from '../../assets/user-information.png';

const User: React.FC = () => {
  const { manageAccount } = useRownd();
  return (
    <div className="user">
      <div className="user__title">
        User details
        <Pill />
      </div>

      <div className="user__cards">
        <div className="user__card">
          <div className="user__card__title">Check out your profile</div>
          <button onClick={() => manageAccount()}>My profile</button>
        </div>
        <div className="user__card">
          <div className="user__card__title">Add a passkey</div>
          <button
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              window?.rownd.auth.passkeys.register();
            }}
          >
            Add passkey
          </button>
        </div>
        <div className="user__card">
          <div className="user__card__title">Add new sign in method</div>
          <button>Add sign in method</button>
        </div>
      </div>

      <div className="user__info">
        <div className="user__info__title">Plan: basic</div>
        <div className="user__info__subtitle">
          You have basic access to this sample app
        </div>
        <button className="secondary" disabled>
          Manage plan
        </button>
      </div>

      <div className="user__info">
        <div className="user__info__title">Ask or edit your name</div>
        <div className="user__info__subtitle">&nbsp;</div>
        <button className="secondary">Edit name</button>
      </div>

      <div className="user__info">
        <div className="user__info__header">Learn about Rownd user types</div>
        <img src={UserInfo} />
      </div>
    </div>
  );
};

export default User;
