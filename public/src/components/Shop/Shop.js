import React, { Component } from "react";
import './Shop.css';

import User from '../User/User';
import SignOut from '../SignOut/SignOut';
import Search from './Search/Search';
import Swag from './Swag/Swag';

import { connect } from "react-redux";
import { getSwag, getUser } from '../../ducks/reducer';

class Shop extends Component {
  componentDidMount() {
    const { getSwag, getUser } = this.props;
    getUser();
    getSwag();
  }
  
  render() {
    const { history, swag } = this.props;
    const swagComponents = swag.map( swag => (
      <Swag key={ swag.id } title={ swag.title } price={ swag.price } id={ swag.id } />
    ));

    return (
      <div id="Shop__parent">
        <User />
        <SignOut history={ history } />

        <div id="Shop__child">
          <Search history={ history } />

          <div id="Shop__swagParent">
            <div id="Shop__swagChild">
              { swagComponents }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect( state => state, { getSwag, getUser } )( Shop );