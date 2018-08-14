/**
* The API for a pizza-delivery company
* 1. New users can be created, their information can be edited, and they can be deleted.
* We should store their name, email address, and street address.
* 2. Users can log in and log out by creating or destroying a token.
* 3. When a user is logged in, they should be able to GET all the possible menu items
* (these items can be hardcoded into the system).
* 4. A logged-in user should be able to fill a shopping cart with menu items
* 5. A logged-in user should be able to create an order.
* You should integrate with the Sandbox of Stripe.com to accept their payment.
* 6. When an order is placed, you should email the user a receipt.
* You should integrate with the sandbox of Mailgun.com for this.
*
*/

// Dependencies
const server = require('./lib/server');

// Container for the App
const app = {};

// Init function
app.init = () => {
  // Start the server
  server.init();
};

// Execute
app.init();

// Export the module
module.exports = app;
