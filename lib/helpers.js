/**
 * Helpers for varios tasks
 *
 */

// Dependencies
const crypto = require('crypto');
const util = require('util');
const https = require('https');
const querystring = require('querystring');
const config = require('./config');

// Debug to log
const debug = util.debuglog('debug');

// Container for all the helpers

const helpers = {};

// Create a SHA256 hash
helpers.hash = (str) => {
  if (typeof (str) === 'string' && str.length > 0) {
    const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  }
  return false;
};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = (str) => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (err) {
    debug(err);
    return {};
  }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = (len) => {
  const strLength = typeof (len) === 'number' && len > 0 ? len : false;
  if (strLength) {
    // Define all the possible characters that could go into a string
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Start the final string
    let str = '';
    for (let i = 0; i < strLength; i += 1) {
      // Get a random character from the possibleCharacters string
      const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random()
        * possibleCharacters.length));
      // Append this characters to the final string
      str += randomCharacter;
    }

    // Return the final string
    return str;
  }
  return false;
};

// Test email validation
helpers.testEmail = (email) => {
  const reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  return reg.test(email);
};

// Pay for order with Stripe service
helpers.payForOrder = (card, charge, amount, callback) => {
  const { optionsToken, optionsCharge } = { ...config };
  const cardData = card;
  const chargeData = charge;

  optionsToken.headers['Content-Length'] = Buffer.byteLength(querystring.stringify(cardData));
  const req = https.request(optionsToken, (resToken) => {
    resToken.on('data', (dataToken) => {
      try {
        const dataTokenJson = JSON.parse(dataToken);
        chargeData.source = dataTokenJson.id;
        chargeData.amount = amount;
        optionsCharge.headers['Content-Length'] = Buffer.byteLength(querystring.stringify(chargeData));
        // Charge
        const reqCharge = https.request(optionsCharge, (resCharge) => {
          callback(resCharge.statusCode);
        });
        reqCharge.write(querystring.stringify(chargeData));
        reqCharge.end();
      } catch (e) {
        debug(e);
        callback(false);
      }
    });
  });
  req.write(querystring.stringify(cardData));
  req.end();
};

// Send email with mailgun
helpers.sendEmailViaMailgun = (data, callback) => {
  const dataForm = querystring.stringify(data);
  config.optionsMailgun.headers['Content-Length'] = Buffer.byteLength(dataForm);

  const req = https.request(config.optionsMailgun, (res) => {
    res.on('data', (d) => {
      debug(res.statusCode);
      callback(res.statusCode);
    });
  });
  req.on('error', (e) => {
    console.log(e);
    debug(e);
    callback(false);
  });
  req.write(dataForm);
  req.end();
};

// Return receipt
helpers.getReceipt = (orderObject) => {
  let receipt = '';
  const items = Object.keys(orderObject.order);
  items.forEach((item) => {
    receipt += `${item}-${orderObject.order[item]} pcs \n`;
  });
  receipt += `Amount ${orderObject.amount / 100} dollars`;
  return receipt;
};


// Export the module
module.exports = helpers;
