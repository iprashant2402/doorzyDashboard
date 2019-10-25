import React from 'react';
import ".././css/custom-theme.scss";

const Layout = props => (
  <div className="container">
    {props.children}
  </div>
);

export default Layout;