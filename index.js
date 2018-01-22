const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const Path = require('path');
// require('dotenv').config();

// Middleware
const checkForSession = require('./middlewares/checkForSession');

// Controllers
const swag_controller = require('./controllers/swag_controller');
const auth_controller = require( './controllers/auth_controller');
const cart_controller = require('./controllers/cart_controller');
const search_controller = require('./controllers/search_controller');

const app = express();

app.use( bodyParser.json() );
app.use( session({
  secret: '$up3r $3cr3t',
  resave: false,
  saveUninitialized: true
}));
app.use( checkForSession );
app.use( express.static( `${__dirname}/build` ) );

// Swag
app.get( '/api/swag', swag_controller.read );

// Auth
app.post( '/api/login', auth_controller.login );
app.post( '/api/register', auth_controller.register );
app.post( '/api/signout', auth_controller.signout );
app.get( '/api/user', auth_controller.getUser );

// Cart 
app.post( '/api/cart', cart_controller.add );
app.post( '/api/cart/checkout', cart_controller.checkout );
app.delete( '/api/cart', cart_controller.delete );

// Search
app.get( '/api/search', search_controller.search );

app.use( express.static( __dirname + '/public/build/') );
app.get( '*', ( req, res, next ) => {
  res.sendFile( Path.resolve( __dirname + '/public/build/index.html') );
});

const port = 10009;
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );