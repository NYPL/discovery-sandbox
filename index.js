require('rootpath')();
require('@babel/register');

console.log('S0S')
require('dotenv').config({ path: '.env' });
module.exports = require('./server');
