const axios = require('axios');
const assert = require('assert');
const mcl = require('mcl-wasm');

const { CONFIG } = require('../config');
const mclService = require('../src/services/mclService');
const utilityService = require('../src/services/utilityService');
const gjssService = require('../src/services/naxosService');


async function naxos(address) { 
    await mcl.init(CONFIG['CURVE_TYPE']);
}

module.exports = { naxos } 