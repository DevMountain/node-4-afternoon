import React, { Component } from "react";
import './Swag.css';

import { connect } from "react-redux";
import { addToCart } from '../../../ducks/reducer';

class Swag extends Component {
  render() {
    const { id, title, price, addToCart } = this.props;
    return (
      <div id="Swag__parent">
        <span id="Swag__name"> { title } </span>
        <div id="Swag__detailsContainer">
          <div id="Swag__priceContainer">
            <span > ${ price.toFixed(2) } </span>
          </div>
          <div id="Swag__atcContainer" onClick={ () => addToCart( id ) }>
            <span> Add to Cart </span>
          </div>
        </div>
      </div>
    )
  }
}

export default connect( state => state, { addToCart } )( Swag );