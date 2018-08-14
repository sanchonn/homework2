/**
 * Return codes list
 *
 */

// Init container for codes
const codes = {};

codes.OK = 200; // OK
codes.ACCEPTED = 202; // No content
codes.BAD_REQUEST = 400; // Bad request
codes.FORBIDDEN = 403; //  The user not have the necessary permissions for a request
codes.NOT_FOUND = 404; // Not found page
codes.NOT_ALLOWED = 405; // Method not allowed
codes.INTERNAL_SERVER_ERROR = 500; // Internal Server Error

// Export the module
module.exports = codes;
