/**
 * test file
 * 
 */

const helpers = require('./lib/helpers');
const https = require('https');
const { StringDecoder } = require('string_decoder');
/*
helpers.stripePayment({
  cardNumber: '4242424242424242',
  expMonth: '11',
  expYear: '18',
  cvc: '123',
}, '100', (res) => {
  console.log(res);
});

*/
const main = () => {
  const card = {
    'card[number]': '4242424242424242',
    'card[exp_month]': '11',
    'card[exp_year]': '2018',
    'card[cvc]': '123',
  };
  // Stringify the payload
  const stringCard = JSON.stringify(card);
  console.log(stringCard);
  // Configure the request details
  const requestDetails = {
    protocol: 'https:',
    hostname: 'api.stripe.com',
    method: 'post',
    path: '/v1/tokens',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      //'Content-Length': Buffer.byteLength(stringCard),
      'Authorization': 'Bearer pk_test_UXlCXzOU0XDtmeTTSr31zOmS'
    },
  };

  // Instantiate the request object
  const req = https.request(requestDetails, (res) => {
    // Grab the status of the sent request
    const status = res.statusCode;
    // Callback successfully if the request went through
    console.log(status);
    console.log(res.headers);
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    res.on('data', (data) => {
      buffer += decoder.write(data);
    });
    res.on('end', () => {
      buffer += decoder.end();
      console.log('buffer=', buffer);
    });
  });
  // Bind to the error event so it doesn't get thrown
  req.on('error', (e) => {
    console.log('error=', e);
  });

  // Add the payload
  req.write(stringCard);

  // End the request
  req.end();
};

main();
