/**
 * Server-related tasks
 *
 */

/* eslint no-console: 0 */

// Dependecies
const http = require('http');
const https = require('https');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const path = require('path');
const fs = require('fs');
const util = require('util');
const config = require('./config');
const handlers = require('./handlers');
const helpers = require('./helpers');

// Log to debug
const debug = util.debuglog('server');

// Instantiate the server module object
const server = {};

// Initialize the HTTP server
server.httpServer = http.createServer((req, res) => {
  server.unifiedServer(req, res);
});

// Initialize the HTTPS server
server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '/../https/cert.pem')),
};

server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
  server.unifiedServer(req, res);
});

// All the service logic for both the http and https server
server.unifiedServer = (req, res) => {
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const { pathname } = parsedUrl;
  const trimmedPath = pathname.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the HTTP Method
  const method = req.method.toLowerCase();

  // Get the Headers as an object
  const { headers } = req;

  // Get the payload, if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    // Choose the handler this request should go to. If one is not found return notFound handler
    const chosenHandler = typeof (server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer),
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler, or default to 200
      const statusCodeRet = typeof (statusCode) === 'number' ? statusCode : 200;

      // Log method and trimmedPath in different color depends on statusCode
      if (statusCode === 200) {
        debug('\x1b[32m%s\x1b[0m', `${statusCode}:${method}:${trimmedPath}`);
      } else {
        debug('\x1b[31m%s\x1b[0m', `${statusCode}:${method}:${trimmedPath}`);
      }

      // Use the payload called back by the handle, or default to {}
      const payloadRet = typeof (payload) === 'object' ? payload : {};

      // Convert the payload to a string
      const payloadString = JSON.stringify(payloadRet);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCodeRet);
      res.end(payloadString);
    });
  });
};

// Init script
server.init = () => {
  // Start http server
  server.httpServer.listen(config.httpPort, () => {
    console.log('\x1b[36m%s\x1b[0m', `The server is listening on port ${config.httpPort} in ${config.envName} mode`);
  });

  // Start https server
  server.httpsServer.listen(config.httpsPort, () => {
    console.log('\x1b[34m%s\x1b[0m', `The https server is listening on port ${config.httpsPort} in ${config.envName} mode`);
  });
};

// Define a request router
server.router = {
  ping: handlers.ping, // test handler
  users: handlers.users, // handler for create, update, get information and delete user account
  tokens: handlers.tokens, // handler for manage tokens (create, update, get, delete)
  login: handlers.login, // login handler - create token and result token info
  logout: handlers.logout, // logoug handler - remove token
  cart: handlers.cart, // handler for manage of shopping cart (add, update, get, delete cart)
  menu: handlers.menu, // handler for manage menu items - get items
  order: handlers.order, // handler for add, update, get and cancel order
};

// Export the module
module.exports = server;
