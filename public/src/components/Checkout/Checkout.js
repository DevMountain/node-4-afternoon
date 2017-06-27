import React, { Component } from "react";
import './Checkout.css';

import User from '../User/User';
import SignOut from '../SignOut/SignOut';
import Swag from './Swag/Swag';

import BackArrow from 'react-icons/lib/fa/arrow-left';

import { connect } from "react-redux";
import { removeFromCart, checkout } from '../../ducks/reducer';

class Checkout extends Component {
  constructor() {
    super();
    this.backToShop = this.backToShop.bind( this );
  }

  backToShop() {
    const { history } = this.props;
    history.push('/shop');
  }

  render() {
    const { removeFromCart, checkout, cart, total, history } = this.props;
    const cartSwag = cart.map( swag => (
      <Swag key={ swag.id } id={ swag.id } remove={ removeFromCart } title={ swag.title } price={ swag.price } />
    ));

    return (
      <div id="Checkout__parent">
        <User />
        <SignOut history={ history } />

        <div id="Checkout__backToShop" onClick={ this.backToShop }>
          <BackArrow id="Checkout__backArrow" />
          <span> Back to Store </span>
        </div>

        <div id="Checkout__child">
          <div id="Checkout__swagParent">
            <div id="Checkout__swagChild">
              { cartSwag }
            </div>
          </div>

          <div id="Checkout__bottomContainer">
            <span id="Checkout__total"> Total: ${ total.toFixed(2) } </span>
            <button id="Checkout__btn" onClick={ checkout }> Checkout </button>
          </div>
        </div>
      </div>
    )
  }
}

export default connect( state => state, { removeFromCart, checkout } )( Checkout );