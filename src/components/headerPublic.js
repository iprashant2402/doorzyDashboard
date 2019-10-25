import React from 'react';
import ".././css/custom-theme.scss";

const PublicHeader = props => (
  <div className="container">
    {props.children}
  </div>
);

export default PublicHeader;