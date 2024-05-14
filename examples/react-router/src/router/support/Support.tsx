import './Support.scss';
import React from 'react';

const Support: React.FC = () => {
  return (
    <div className="support">
      <div className="support__title">Support</div>
      <div className="support__card shadow">
        <div className="support__card__title" style={{ fontWeight: 400 }}>
          Having trouble? Contact support at anytime with the button below. Or
          email us at <u>support@rownd.io</u>
        </div>
        <a className="support__card__contact" href="mailto:support@rownd.io">
          Contact support
        </a>
      </div>
      <div className="support__card">
        <div className="support__card__title">Check out the docs</div>
        <div className="support__card__subtitle">
          Maybe you’ll find what you are looking for in the docs!
        </div>
        <a
          className="support__card__link"
          target="_blank"
          href="https://docs.rownd.io/welcome/overview"
        >
          Documentation
        </a>
      </div>
      <div className="support__card">
        <div className="support__card__title">Give us feedback!</div>
        <div className="support__card__subtitle">
          Let us know what you think
        </div>
        <a className="support__card__link" href="mailto:support@rownd.io">
          Send us an email
        </a>
      </div>
    </div>
  );
};

export default Support;
