import URL from '../api';
import axios from 'axios';

const initialState = {
  user: '',
  swag: [],
  cart: [],
  total: 0
};

const LOGIN = "LOGIN";
const REGISTER = "REGISTER";
const GET_USER = "GET_USER";
const GET_SWAG = "GET_SWAG";
const SEARCH_SWAG = "SEARCH_SWAG";
const ADD_TO_CART = "ADD_TO_CART";
const REMOVE_FROM_CART = "REMOVE_FROM_CART";
const CHECKOUT = "CHECKOUT";
const SIGN_OUT = "SIGN_OUT";

export default function( state = initialState, action ) {
  let { payload } = action;
  switch( action.type ) {
    case LOGIN + '_FULFILLED':
      return Object.assign({}, state, { user: payload.username, cart: payload.cart, total: payload.total });

    case REGISTER + '_FULFILLED':
      return Object.assign({}, state, { user: payload.username, cart: payload.cart, total: payload.total });

    case GET_USER + '_FULFILLED':
      return Object.assign({}, state, { user: payload.username, cart: payload.cart, total: payload.total });

    case GET_SWAG + '_FULFILLED':
      return Object.assign({}, state, { swag: payload });
    
    case GET_SWAG + '_REJECTED':
      return Object.assign({}, state, { swag: [] });

    case SEARCH_SWAG + '_FULFILLED':
      return Object.assign({}, state, { swag: payload } );

    case ADD_TO_CART + '_FULFILLED':
      return Object.assign({}, state, { cart: payload.cart, total: payload.total });

    case REMOVE_FROM_CART + '_FULFILLED':
      return Object.assign({}, state, { cart: payload.cart, total: payload.total });

    case CHECKOUT + '_FULFILLED':
      return Object.assign({}, state, { cart: payload.cart, total: payload.total });

    case SIGN_OUT + '_FULFILLED':
      return {
        user: '',
        swag: [],
        cart: [],
        total: 0
      };

    default: return state;
  }
}

export function login( obj, history ) {
  return {
    type: LOGIN,
    payload: axios.post( URL.login, obj ).then( response => {
      history.push('/shop');
      return response.data;
    })
  };
}

export function register( obj, history ) {
  return {
    type: REGISTER,
    payload: axios.post( URL.register, obj ).then( response => {
      history.push('/shop');
      return response.data;
    })
  };
}

export function getUser() {
  return {
    type: GET_USER,
    payload: axios.get( URL.user ).then( response => response.data )
  };
}

export function getSwag() {
  return {
    type: GET_SWAG,
    payload: axios.get( URL.swag ).then( response => response.data )
  };
}

export function searchSwag( category ) {
  return {
    type: SEARCH_SWAG,
    payload: axios.get( `${URL.search}?category=${category}` ).then( response => response.data )
  };
}

export function addToCart( id ) {
  return {
    type: ADD_TO_CART,
    payload: axios.post( `${URL.cart}?id=${id}` ).then( response => response.data )
  };
}

export function removeFromCart( id ) {
  return {
    type: REMOVE_FROM_CART,
    payload: axios.delete( `${URL.cart}?id=${id}` ).then( response => response.data )
  };
}

export function checkout() {
  return {
    type: CHECKOUT,
    payload: axios.post( URL.checkout ).then( response => response.data )
  };
}

export function signout( history ) {
  return {
    type: SIGN_OUT,
    payload: axios.post( URL.signout ).then( () => history.push('/') )
  };
}