require('rootpath')();
require('@babel/register');

require('dotenv').config({ path: 'updated-qa.env' });
module.exports = require('./server');
