require('rootpath')();
require('@babel/register');
require('core-js');

require('dotenv').config({ path: '.env' });

module.exports = require('./server');
