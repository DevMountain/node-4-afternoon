<img src="https://s3.amazonaws.com/devmountain/readme-logo.png" width="250" align="right">

# Project Summary

In this project, we'll create a node back-end for DevMountain's swag shop. We'll make the back-end capable of registering users, logging in users, keeping track of guests, managing a shopping cart, and serving a pre-built React front-end. At the end of the project you'll be able to test your endpoints with `Postman` and the pre-built front-end.

## Step 1

### Summary

In this step, we'll install and require the npm packages we'll need.

### Instructions

* Run `npm install express express-session dotenv`.
* Open `server/index.js` and require all the packages at the top of the file.
* create a `.env` and include the `SESSION_SECRET` and `SERVER_PORT`
  * Both the tests and the front end are expecting the server port to be 
  .

### Solution

<details>

<summary> <code> server/index.js </code> </summary>

```js
require("dotenv").config();
const express = require("express");
const session = require("express-session");
```

</details>

<details>

<summary> <code> .env </code> </summary>

```
SERVER_PORT = 3001
SESSION_SECRET = s3cretsfjkdsfjdksljfkldskjld
```

</details>

## Step 2

### Summary

In this step, we'll create an express `app`, use `express.json` and `session` middleware, and have our server listen on port `3001`.

### Instructions

* Open `server/index.js`.
* Create an express app.
* Create top-level middleware that use `express.json` and `session`.
  * Don't forget to pass in the configuration object into `session`. The object should have a `secret`, `resave`, and `saveUninitialized` parameter.

<details>

<summary> Detailed Instructions </summary>

<br />

Now that `index.js` has access to all the packages, let's create an express application. Create a variable called `app` and set it equal to `express` invoked. Destructure `SERVER_PORT` and `SESSION_SECRET` from `process.env`.

```js
require("dotenv").config();
const express = require("express");
const session = require("express-session");

const app = express();

let { SERVER_PORT, SESSION_SECRET } = process.env;
```

We can then add middleware to the app. Let's add `express.json` so we can read JSON from the request body and add `session` so we can create sessions. Remember that `session` needs a configuration object as the first argument. The object should have a `secret`, `resave`, and `saveUninitialized` property. `secret` can be any string you like that is stored in your `.env` file and `resave` and `saveUninitialized` should equal `true`.

```js
app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);

```

Finally, let's have our app `listen` on port 3001.

```js
app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}.`);
});
```

</details>

### Solution

<details>

<summary> <code> server/index.js </code> </summary>

```js
require("dotenv").config();
const express = require("express");
const session = require("express-session");

const app = express();

let { SERVER_PORT, SESSION_SECRET } = process.env;

app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}.`);
});

```

</details>

## Step 3 

### Summary

In this step, we'll add custom middleware that will check to see if a session has been created. If a session hasn't been made yet, we'll create a `user` object that keeps track of a user's `username`, `cart`, and `total`.

### Instructions

* Create a folder called `middlewares` in `server/`.
* Create a file called `checkForSession.js` in `server/middlewares/`.
* Open `server/middlewares/checkForSession.js`.
* Export a function that has a `req`, `res`, and `next` parameter.
* Check if the `req.session` has a `user` object.
  * If the session doesn't have it, add it to the session.
    * User object: `{ username: '', cart: [], total: 0 }`.
  * If the session does have it, call `next`.

<details>

<summary> Detailed Instructions </summary>

<br />

Let's begin by creating a folder called `middlewares` in `server/`. We'll keep all our middleware in this folder. Let's create a file called `checkForSession.js` inside this folder. Export a function that captures `req`, `res`, and `next` as parameters.

```js
module.exports = function(req, res, next) {

};
```

In this middleware, we'll want to check to see if the sesssion has a `user` object or not. The `user` object will keep track of users on our website. We'll store what items are in their cart, the total cost of their cart, and their username. We'll only want to add the default `user` object once. So let's add an if statement to check to see if the `user` object doesn't exists.

```js
module.exports = function(req, res, next) {
  const { session } = req;

  if ( !session.user ) {

  } 
};
```

If it doesn't exist, we'll want to add a `user` object to the session. A user object should default to: `{ username: '', cart: [], total: 0 }`. We'll also want to call `next` after the if statement so the request can reach the endpoint.

```js
module.exports = function(req, res, next) {
  const { session } = req;

  if ( !session.user ) {
    session.user = { username: '', cart: [], total: 0 };
  } 
  
  next();
};
```

</details>

### Solution

<details>

<summary> <code> server/middlewares/checkForSession.js </code> </summary>

```js
module.exports = function(req, res, next) {
  const { session } = req;

  if (!session.user) {
    session.user = { username: "", cart: [], total: 0 };
  }

  next();
};
```

</details>

## Step 4

### Summary

In this step, we'll require our middleware in `index.js` and add it to `app`.

### Instructions

* Require `server/middlewares/checkForSession.js`.
* Use `app.use` to add `checkForSession`.
  * _NOTE:_ When we use our own simple middleware, we don't invoke the function inside of `app.use`. Pre-built middlewares like `express.json` are invoked because that is the way the author of the middleware designed it.

### Solution

<details>

<summary> <code> server/index.js </code> </summary>

```js
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const checkForSession = require("./middlewares/checkForSession");

const app = express();

let { SERVER_PORT, SESSION_SECRET } = process.env;

app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);
app.use(checkForSession);

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}.`);
});
```

</details>

## Step 5

### Summary

In this step, we'll create a swag controller that can `read` the swag from `models/swag` and send it in a response. We'll also require it in `server/index.js` and create an endpoint.

### Instructions

* Create a folder called `controllers` in `server/`.
* Create a file called `swagController.js` in `server/controllers/`.
* Open `server/controllers/swagController.js`.
* Require `swag` from `server/models/swag`. 
  * This is just an array of swag objects.
* Export an object with a `read` method that has a `req`, `res`, and `next` parameter. 
  * The `read` method should use `res` to send a status of 200 with the `swag` array.
* Open `server/index.js`.
* Require the swag controller.
* Create a `GET` endpoint at `/api/swag` that calls the `read` method from the swag controller.
* Hit `http://localhost:3001/api/swag` in `Postman` to make sure you are getting the swag array.

<details>

<summary> <code> Detailed Instructions </code> </summary>

<br />

Let's begin by creating a `controllers` folder in `server/`. This is where we'll store all our controller files. Let's create a file called `swagController.js` in this folder. This controller will be responsible for sending the complete array of swag. Let's require the swag model from `server/models/swag.js`. `swag.js` is just a JavaScript file that exports an array of swag objects.

```js
const swag = require('../models/swag');
```

Now that we have access to the swag array, let's use `module.exports` to export an object with a `read` method. This method should capture `req` and `res` as parameters. We'll then use `res` to send a status of 200 and the entire `swag` array.

```js
const swag = require('../models/swag');

module.exports = {
  read: ( req, res, next ) => {
    res.status(200).send( swag );
  }
};
```

Then, we can require it into `server/index.js` and create an endpoint that calls this method. Open `server/index.js` and require the `swagController`.

```js
const swagController = require('./controllers/swagController');
```

Now, let's make a `GET` endpoint at `/api/swag`that calls the `read` method on our `swagController`.

```js
app.get("/api/swag", swagController.read);
```

</details>

### Solution

<details>

<summary> <code> server/controllers/swagController.js </code> </summary>

```js
const swag = require("../models/swag");

module.exports = {
  read: (req, res, next) => {
    res.status(200).send(swag);
  }
};
```

</details>

<details>

<summary> <code> server/index.js </code> </summary>

```js
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const checkForSession = require("./middlewares/checkForSession");
const swagController = require("./controllers/swagController");

const app = express();

let { SERVER_PORT, SESSION_SECRET } = process.env;

// Middleware 
app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);
app.use(checkForSession);

// Endpoints
app.get("/api/swag", swagController.read);

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}.`);
});
```

</details>

## Step 6

### Summary

In this step, we'll create an authorization controller that can handle logging in, registering, signing out, and also reading the user from `req.session`.

### Instructions

* Create an `authController.js` in `server/controllers/`.
* Open `server/controllers/authController.js`.
* At the top of the file require users from `models/users`.
  * This is where the users are kept after registering.
  * A user object looks like: `{ id: integer, username: string, password: string }`
* Underneath the require for `users`, add an `id` variable that equals `1`.
  * We'll increment this by one to make sure no users can have the same `id`.
* Export an object with a `login`, `register`, `signout`, and `getUser` method.
  * All methods should capture `req` and `res` as parameters.
* `login`:
  * Should look on the request body for a `username` and `password`.
  * Should check to see if a user from the `users` array matches that user/pass combination.
  * If the method finds a user:
    * Update the value of `username` to the user's username on the request session's user object.
    * Return a status of 200 with the request session's user object.
  * If the method doesn't find a user:
    * Return a status of 500.
* For simplicity, we aren't going to do any verification on register. The `register` method should just push an object with an `id`, `username`, and `password` to the `users` array. The method:
  * Should look on the request body for a `username` and `password`.
  * Should push to the `users` array.
  * Should increment the value of the global `id` variable.
  * Should update the value of `username` on the request session's user object.
  * Should send a status of 200 with the request session's user object.
* `signout` should destroy the session using `req.session.destroy()` and then return the `req.session` object.
  * The return of this will be used for Unit Testing.
* `getUser` should simply send a status of 200 along with the request session's user object.

<details>

<summary> Detailed Instructions </summary>

<br />

Let's begin by creating an `authController.js` file in `server/controllers/`. This controller will be responsible for logging in users, registering users, signing out users, and also retrieving user information. Since we'll be working with users, we'll need to require the `user.js` file from `server/models/users.js`. This javascript file exports an array of all the users. 

```js
const users = require("../models/users");
```

We'll also need to create a global `id` variable. We'll use this variable to assign `id`s to newly registered users and then increment it by one so no users have the same id.

```js
let id = 1;
```

Now, let's export an object with a `login`, `register`, `signout`, and `getUser` method. Each method should capture `req` and `res` as parameters.

```js
module.exports = {
  register: (req, res) => {

  },

  login: (req, res) => {

  },

  signout: (req, res) => {

  },

  getUser: (req, res) => {

  }
}
```

Let's break down the file method by method. We'll begin with `register`. We'll keep this method simple and won't check for any previous users with the same login information. This method should look for a `username` and `password` on the request body and then create a user object. It should use the global `id` variable for the `id`. After pushing the new user object to the `users` array it should increment the value of `id` by one so we can keep the value of `id` unique. It should then set the value of `username` on the request session's user object to the value of `username` from the request body. Finally the method should return the updated user object with a status of 200.

```js
register: (req, res) => {
  const { session } = req;
  const { username, password } = req.body;

  users.push({ id, username, password });
  id++;

  session.user.username = username;

  res.status(200).send(session.user);
}
```

Now let's focus on `login`. This method should use `username` and `password` from the request body to find a user object in the `users` array with the same user/pass combination. If it finds a user with that combination, it should update the value of `username` on the request session's user object to value of `username` from the request body. It should then send a status of 200 with the updated user object. If it doesn't find a user it should send a status of 500.

```js
login: (req, res) => {
  const { session } = req;
  const { username, password } = req.body;

  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    session.user.username = user.username;
    res.status(200).send(session.user);
  } else {
    res.status(500).send('Unauthorized.');
  }
}
```

Next up is `signout`. This method is responsible for destroying the session and returning the session (which should be undefined at that point).

```js
signout: (req, res) => {
  req.session.destroy();
  res.status(200).send(req.session);
}
```

Finally, let's focus on the`getUser` method. This method is responsible for reading the user object off of session and return it with a status of 200.

```js
getUser: (req, res) => {
  const { session } = req;
  res.status(200).send(session.user);
}
```

</details>

### Solution

<details>

<summary> <code> server/controllers/authController.js </code> </summary>

```js
const users = require("../models/users");
let id = 1;

module.exports = {
  register: (req, res) => {
    const { session } = req;
    const { username, password } = req.body;

    users.push({ id, username, password });
    id++;

    session.user.username = username;

    res.status(200).send(session.user);
  },

  login: (req, res) => {
    const { session } = req;
    const { username, password } = req.body;

    const user = users.find(
      user => user.username === username && user.password === password
    );

    if (user) {
      session.user.username = user.username;
      res.status(200).send(session.user);
    } else {
      res.status(500).send("Unauthorized.");
    }
  },

  signout: (req, res) => {
    req.session.destroy();
    res.status(200).send(req.session);
  },

  getUser: (req, res) => {
    const { session } = req;
    res.status(200).send(session.user);
  }
};
```

</details>

## Step 7

### Summary

In this step, we'll require the auth controller in `server/index.js` and create endpoints to hit every method on the controller.

### Instructions

* Open `server/index.js`.
* Require the `authController.js` file.
* Create the following endpoints: ( `request method`, `url`, `controller method` )
  * `POST` - `/api/login` - `authController.login`.
  * `POST` - `/api/register` - `authController.register`.
  * `POST` - `/api/signout` - `authController.signout`.
  * `GET` - `/api/user` - `authController.getUser`.
* Test your endpoints using `Postman`.
  * Try registering a new user.
  * Try logging in with that user.
  * Try getting the session's information on the user ( /api/user ).
  * Try signing out ( This should return nothing if the session was destroyed ).
  
### Solution

<details>

<summary> <code> server/index.js </code> </summary>

```js
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const checkForSession = require("./middlewares/checkForSession");
const swagController = require("./controllers/swagController");
const authController = require('./controllers/authController');

const app = express();

let { SERVER_PORT, SESSION_SECRET } = process.env;

// Middleware
app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);
app.use(checkForSession);

// Endpoints
//// Auth
app.post("/api/register", authController.register);
app.post("/api/login", authController.login);
app.post("/api/signout", authController.signout);
app.get("/api/user", authController.getUser);
//// Swag
app.get("/api/swag", swagController.read);

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}.`);
});
```

</details>

## Step 8

### Summary

In this step, we'll create a cart controller that can handle adding and deleting items from a user's cart. We'll also add a checkout method.

### Instructions

* Create a file called `cartController.js` in `server/controllers`.
* Require `swag` from `models/swag.js`.
  * This is just an array of swag objects.
* Export an object with an `add`, `delete`, and `checkout` method.
* Each method should capture `req` and `res` as parameters.
* `add`:
  * Should check the request parameter for an `id`.
  * Should use the `id` to see if it is already in the user's cart on session.
    * If it is, just send a status 200 with the request session's user object.
    * If it isn't, find the swag object from `models/swag` using the `id` and add it to the cart on session.
      * Add the price of the swag to the total on the session.
      * Send a status 200 with the request session's user object.
* `delete`:
  * Should check the request parameter for an `id`.
  * Should use the `id` to remove the swag from cart and subtract it's price from the total.
  * Should send status 200 with the request session's user object.
* `checkout`:
  * Should set the cart back to an empty array on session.
  * Should set the total back to 0 on session.
  * Should send status 200 with the request session's user object.

<details>

<summary> Detailed Instructions </summary>

<br />

Let's begin by creating a `cartController.js` file in `server/controllers/`. This controller will be responsible for adding items to a user's cart and removing items from a user's cart. It will also handle the checkout process. This controller will need access to the `swag` array so let's require `swag.js` from `server/models/swag.js`.

```js
const swag = require("../models/swag");
```

Now, let's export an object with a `add`, `remove`, and `checkout` method. Each method should capture `req`, `res`, and `next` as parameters.

```js
module.exports = {
  add: (req, res) => {

  },

  delete: (req, res) => {

  },

  checkout: (req, res) => {

  }
} 
```

Let's break down the file, method by method. We'll start with `add`. This method is responsible for making sure the swag isn't already in the cart. If it isn't, add it to the cart and increase the total by the price of the swag. If it is, just return the request session's user object with a status of 200. This method will use the request query to get an `id`. We can then use this `id` to see if it is already in the cart and preform the required logic.

```js
add: (req, res) => {
  const { id } = req.params;
  let { user } = req.session;

  // This will return -1 if it isn't in the cart
  const index = user.cart.findIndex(swag => swag.id == id);

  if (index === -1) {
    const selectedSwag = swag.find(swag => swag.id == id);

    user.cart.push(selectedSwag);
    user.total += selectedSwag.price;
  }

  res.status(200).send(user);
}
```

Now let's move on to `delete`. This method will be responsible for removing swag from the cart. It should try and see if the swag is in the cart. If it is, remove the swag from the cart and subtract the price from the total. If it isn't, don't do anything to the cart. The method should then return a status of 200 with the request session user's object.

```js
delete: (req, res) => {
  const { id } = req.params;
  const { user } = req.session;

  const index = user.cart.findIndex(swag => swag.id == id);
  const selectedSwag = swag.find(swag => swag.id == id);

  if (index !== -1) {
    user.cart.splice(index, 1);
    user.total -= selectedSwag.price;
  }

  res.status(200).send(user);
}
```

Finally, let's create the `checkout` method. This method will be responsible for resetting the value cart to an empty array and total to 0. The method should then send a status of 200 with the update request session' user object.

```js
checkout: (req, res) => {
  const { user } = req.session;
  user.cart = [];
  user.total = 0;

  res.status(200).send(user);
}
```

</details>

### Solution

<details>

<summary> <code> server/controllers/cartController.js </code> </summary>

```js
const swag = require("../models/swag");

module.exports = {
  add: (req, res) => {
    const { id } = req.params;
    let { user } = req.session;

    // This will return -1 if it isn't in the cart
    const index = user.cart.findIndex(swag => swag.id == id);

    if (index === -1) {
      const selectedSwag = swag.find(swag => swag.id == id);

      user.cart.push(selectedSwag);
      user.total += selectedSwag.price;
    }

    res.status(200).send(user);
  },

  delete: (req, res) => {
    const { id } = req.params;
    const { user } = req.session;

    const index = user.cart.findIndex(swag => swag.id == id);
    const selectedSwag = swag.find(swag => swag.id == id);

    if (index !== -1) {
      user.cart.splice(index, 1);
      user.total -= selectedSwag.price;
    }

    res.status(200).send(user);
  },

  checkout: (req, res) => {
    const { user } = req.session;
    user.cart = [];
    user.total = 0;

    res.status(200).send(user);
  }
};

```

</details>

## Step 9

### Summary

In this step, we'll require the cart controller and create endpoints to hit every method on the controller.

### Instructions

* Open `server/index.js`.
* Require the cart controller.
* Create the following endpoints: ( `request method`, `url`, `controller method` )
  * `POST` - `/api/cart/checkout` - `cartController.checkout`.
    * _NOTE:_ It is very important that this endpoint come first.
  * `POST` - `/api/cart/:id` - `cartController.add`.
  * `DELETE` - `/api/cart/:id` - `cartController.delete`.
* Test your endpoints using `Postman`.
  * Try adding an item to the cart by `id` ( 1 - 35 ).
  * Try remove an item from the cart by `id` ( 1 - 35 ).
  * Try checking out.

### Solution

<details>

<summary> <code> server/index.js </code> </summary>

```js
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const checkForSession = require("./middlewares/checkForSession");
const swagController = require("./controllers/swagController");
const authController = require("./controllers/authController");
const cartController = require("./controllers/cartController");

const app = express();

let { SERVER_PORT, SESSION_SECRET } = process.env;

// Middleware
app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);
app.use(checkForSession);

// Endpoints
//// Auth
app.post("/api/register", authController.register);
app.post("/api/login", authController.login);
app.post("/api/signout", authController.signout);
app.get("/api/user", authController.getUser);
//// Swag
app.get("/api/swag", swagController.read);
//// Cart
app.post("/api/cart/checkout", cartController.checkout);
app.post("/api/cart/:id", cartController.add);
app.delete("/api/cart/:id", cartController.delete);

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}.`);
});
```

</details>

## Step 10

### Summary

In this step, we'll create a search controller that will also to filter swag by `category`. The current categories are: `hats`, `shirts`, `jackets`, `sweaters`, `pants`, and `shorts`.

### Instructions

* Create a `searchController.js` in `server/controllers/`.
* Open `server/controllers/searchController.js`.
* Require `swag` from `models/swag.js`.
  * This is just an array of swag objects.
* Export an object with a search method.
* This method should capture `req` and `res` as parameters.
* This method should check for a `category` from the request query.
* This method should return a status 200 with the entire swag array if the category doesn't exist.
* This method should return a status 200 with the filtered array of swag by `category` if it does exist.

<details>

<summary> Detailed Instructions </summary>

<br />

Now for our last controller. Let's begin by creating a `searchController.js` in `server/controllers/`. This controller will need access to the swag model so let's require it from `server/models/swag`. This controller will only need one method. Let's export an object that has a method called search. The method should capture `req` and `res` as parameters. 

```js
const swag = require('../models/swag');

module.exports = {
  search: (req, res) => {

  }
};
```

This method should look at the request query for a `category`. If it can't find a `category`, it should return a status of 200 with the entire swag array. If it can, it should filter the swag array by the category and return the filtered swag array.

```js
search: (req, res) => {
  const { category } = req.query;
  if (!category) {
    res.status(200).send(swag);
  } else {
    const filteredSwag = swag.filter(swag => swag.category === category);
    res.status(200).send(filteredSwag);
  }
}
```

</details>

### Solution

<details>

<summary> <code> server/controllers/searchController.js </code> </summary>

```js
const swag = require("../models/swag");

module.exports = {
  search: (req, res) => {
    const { category } = req.query;
    if (!category) {
      res.status(200).send(swag);
    } else {
      const filteredSwag = swag.filter(swag => swag.category === category);
      res.status(200).send(filteredSwag);
    }
  }
};
```

</details>

## Step 11

### Summary

In this step, we'll require the search controller and create an endpoint to hit the search method.

### Instructions

* Open `server/index.js`.
* Require the search controller.
* Create a GET endpoint on `/api/search` that calls the search method on the search controller.
* Test your endpoint using `Postman`.
  * Try getting a filtered swag list of `hats`.
  * Try getting a filtered swag list of `pants`.

### Solution

<details>

<summary> <code> server/index.js </code> </summary>

```js
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const checkForSession = require("./middlewares/checkForSession");
const swagController = require("./controllers/swagController");
const authController = require("./controllers/authController");
const cartController = require("./controllers/cartController");
const searchController = require("./controllers/searchController");

const app = express();

let { SERVER_PORT, SESSION_SECRET } = process.env;

// Middleware
app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);
app.use(checkForSession);

// Endpoints
//// Auth
app.post("/api/register", authController.register);
app.post("/api/login", authController.login);
app.post("/api/signout", authController.signout);
app.get("/api/user", authController.getUser);
//// Swag
app.get("/api/swag", swagController.read);
//// Cart
app.post("/api/cart/checkout", cartController.checkout);
app.post("/api/cart/:id", cartController.add);
app.delete("/api/cart/:id", cartController.delete);
// Search
app.get("/api/search", searchController.search);

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}.`);
});
```

</details>

## Step 12

### Summary

In this step, we'll use the provided `postman_collection` to test all the endpoints and add `express.static` to serve the pre-built front-end.

### Instructions

* Open `server/index.js`.
* In the root of your project, run `npm run build` to create a fresh `build` folder
* Add middleware to use `express.static` to serve up the build folder in `/build`.
* Open `http://localhost:
/` to see the API interact with a React front-end.
* Import the `postman_collection` into `Postman` and run the Unit Tests to make sure they all pass.

### Solution

<details>

<summary> <code> server/index.js </code> </summary>

```js
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const checkForSession = require("./middlewares/checkForSession");
const swagController = require("./controllers/swagController");
const authController = require("./controllers/authController");
const cartController = require("./controllers/cartController");
const searchController = require("./controllers/searchController");

const app = express();

let { SERVER_PORT, SESSION_SECRET } = process.env;

// Middleware
app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);
app.use(checkForSession);
app.use(express.static(`${__dirname}/../build`));

// Endpoints
//// Auth
app.post("/api/register", authController.register);
app.post("/api/login", authController.login);
app.post("/api/signout", authController.signout);
app.get("/api/user", authController.getUser);
//// Swag
app.get("/api/swag", swagController.read);
//// Cart
app.post("/api/cart/checkout", cartController.checkout);
app.post("/api/cart/:id", cartController.add);
app.delete("/api/cart/:id", cartController.delete);
// Search
app.get("/api/search", searchController.search);

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}.`);
});
```

</details>

## Resources

<details>

<summary> <code> Sessions </code> </summary>

* [Understanding resave and saveUninitialized](https://stackoverflow.com/a/40396102)

</details>

<details>

<summary> <code> Express </code> </summary>

* [Express ](https://expressjs.com/en/guide/writing-middleware.html)

</details>



## Contributions

If you see a problem or a typo, please fork, make the necessary changes, and create a pull request so we can review your changes and merge them into the master repo and branch.

## Copyright

© DevMountain LLC, 2017. Unauthorized use and/or duplication of this material without express and written permission from DevMountain, LLC is strictly prohibited. Excerpts and links may be used, provided that full and clear credit is given to DevMountain with appropriate and specific direction to the original content.

<p align="center">
<img src="https://s3.amazonaws.com/devmountain/readme-logo.png" width="250">
</p>
