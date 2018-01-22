import React, { Component } from "react";
import './Swag.css';

import TrashIcon from 'react-icons/lib/fa/trash';

export default class Swag extends Component {
  render() {
    const { id, title, price, remove } = this.props;
    return (
      <div id="CheckoutSwag__parent">
        <div id="CheckoutSwag__child">
          <span id="CheckoutSwag__price"> ${ price.toFixed(2) } </span>
          <span id="CheckoutSwag__title"> { title } </span>
          <TrashIcon id="CheckoutSwag__trash" onClick={ () => remove( id ) } />
        </div>
      </div>
    )
  }
}