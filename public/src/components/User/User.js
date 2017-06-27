import React from "react";
import './User.css';

import UserIcon from 'react-icons/lib/fa/user';

import { connect } from "react-redux";

function User({ user }) {
  return (
    <div id="User__parent">
      <UserIcon id="User__icon" />
      <span> { user || 'Guest' } </span>
    </div>
  )
}

export default connect( state => state )( User );