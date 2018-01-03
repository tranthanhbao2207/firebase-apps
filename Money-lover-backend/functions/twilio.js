const twilio = require('twilio');
const accountSid = 'ACb179465b56b369d6a6b68c3c578cdbdb';
const authToken = '886acc828289e6a12ba86be988a9ee9a';

module.exports = new twilio.Twilio(accountSid, authToken);
