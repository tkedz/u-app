const fs = require('fs');

const prices = JSON.parse(fs.readFileSync('data/prices.json'));
module.exports = prices;
