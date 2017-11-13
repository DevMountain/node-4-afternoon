import React, { Component } from "react";
import './SignOut.css';

import SignOutIcon from 'react-icons/lib/fa/sign-out';

import { connect } from "react-redux";
import { signout } from '../../ducks/reducer';

class SignOut extends Component {
  render() {
    const { signout, history } = this.props;
    return (
      <div id="SignOut__parent" onClick={ () => signout( history ) }>
        <SignOutIcon id="SignOut__icon" />
        <span> Sign Out </span>
      </div>
    )
  }
}

export default connect( state => state, { signout } )( SignOut );