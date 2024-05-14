import React, { useState } from 'react';
import './Settings.scss';
import { useRownd } from '@rownd/react';
import Toggle from '../../common/toggle/Toggle';

const Settings: React.FC = () => {
  const { signOut } = useRownd();
  const [toggle, setToggle] = useState(true);
  return (
    <div className="settings">
      <div className="settings__title">Settings</div>
      <div className="settings__card">
        <div className="settings__card__title">Sign out of your account</div>
        <div className="settings__card__subtitle">&nbsp;</div>
        <button className="secondary" onClick={() => signOut()}>
          Sign out
        </button>
      </div>
      <div className="settings__card">
        <div className="settings__card__title">Automatic app updates</div>
        <div className="settings__card__subtitle">
          A sample thing to toggle that doesn't actually do anything
        </div>
        <Toggle checked={toggle} onChange={() => setToggle((prev) => !prev)} />
      </div>
    </div>
  );
};

export default Settings;
