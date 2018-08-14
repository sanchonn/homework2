const helpers = require('./lib/helpers');
const codes = require('./lib/codes');

const orderObject = {};
orderObject.date = Date().now;
const emailTest = 'sanchonn@gmail.com'; // Prevent to email real user
const emailData = {
  from: 'Pizza <pizzaOrder@sandboxe77e4bd9e6144759b2a9682491850ea6.mailgun.org>',
  to: emailTest, // @TODO change to email when production
  subject: `Your order ${orderObject.date} accepted`,
  text: 'JSON.stringify(orderObject)',
};
/*
helpers.sendEmailViaMailgun(emailData, (emailErr) => {
  console.log(emailErr);
  if (emailErr === codes.OK) {
    callback(codes.OK);
  } else {
    callback(codes.INTERNAL_SERVER_ERROR, { Error: 'Could not send email to the user' });
  }
});
*/
const order = {
  "order": {
    "Margherita": 1,
      "Marinara": 2
  },
  "amount": 190
};

console.log(helpers.getReceipt(order));
