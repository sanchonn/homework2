/**
 * Create and export configuration variables
 *
 */

// Container for all the environments
const environments = {};
// Staging (default) environments
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: 'staging',
  hashingSecret: 'thisIsASecret',
  optionsToken: {
    hostname: 'api.stripe.com',
    path: '/v1/tokens',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer pk_test_***',  // insert your pk_test_key
    },
  },
  optionsCharge: {
    hostname: 'api.stripe.com',
    path: '/v1/charges',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer sk_test_***',
    },
  },
  optionsMailgun: {
    hostname: 'api.mailgun.net',
    port: 443,
    method: 'POST',
    path: '/v3/YOUR_DOMAIN/messages', // insert your domain
    protocol: 'https:',
    headers: {
      Authorization: `Basic ${Buffer.from('api:private API key').toString('base64')}`, // insert your private api_key
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  },
};

// Production environments
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production',
  hashingSecret: 'thisIsASecret',
  optionsToken: {
    hostname: 'api.stripe.com',
    path: '/v1/tokens',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer pk_test_***', // @TODO replace with real key
    },
  },
  optionsCharge: {
    hostname: 'api.stripe.com',
    path: '/v1/charges',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer sk_test_***', // @TODO replace with real key
    },
  },
  optionsMailgun: {
    hostname: 'api.mailgun.net',
    port: 443,
    method: 'POST',
    path: '/v3/YOUR_DOMAIN/messages', // @TODO replace with real domain
    protocol: 'https:',
    headers: {
      Authorization: `Basic ${Buffer.from('api:private_api_key').toString('base64')}`, // @TODO replace with real key
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  },
};


// Determine which environment was passed as a command-line args
const currentEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environment above, if onot, default the staging
const environmentToExport = typeof (environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;
