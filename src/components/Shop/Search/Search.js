import React, { Component } from "react";
import './Search.css';

import CartIcon from 'react-icons/lib/fa/shopping-cart';

import { connect } from "react-redux";
import { searchSwag } from '../../../ducks/reducer';

class Search extends Component {
  constructor() {
    super();
    this.state = {
      category: ''
    };

    this.showCart = this.showCart.bind( this );
    this.handleChange = this.handleChange.bind( this );
    this.search = this.search.bind( this );
  }

  showCart() {
    const { history } = this.props;
    history.push('/checkout');
  }

  handleChange( event ) {
    this.setState({ category: event.target.value });
  }

  search( event ) {
    if ( event.key === "Enter" ) {
      const { searchSwag } = this.props;
      const { category } = this.state;
      
      searchSwag( category );
    }
  }

  render() {
    const { cart } = this.props;
    return (
      <div id="Search__parent">
        <div id="Search__child">
          <input id="Search__input" placeholder="Search by type of swag.." onKeyDown={ this.search } onChange={ this.handleChange } />
          <div id="Search__cartContainer" onClick={ this.showCart }>
            <span id="Search__cartNumber"> { cart.length } </span>
            <CartIcon id="Search__cartIcon" />
          </div>
        </div>
      </div>
    )
  }
}

export default connect( state => state, { searchSwag } )( Search );