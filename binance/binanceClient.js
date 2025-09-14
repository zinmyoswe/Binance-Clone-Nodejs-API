const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

// Binance Futures Testnet REST API base
const REST_BASE = process.env.BINANCE_REST_BASE || 'https://testnet.binancefuture.com';
const API_KEY = process.env.BINANCE_API_KEY;
const SECRET_KEY = process.env.BINANCE_SECRET_KEY;

// 🔹 Debug: check if keys are loaded
console.log("API_KEY:", API_KEY ? "Loaded" : "Missing");
console.log("SECRET_KEY:", SECRET_KEY ? "Loaded" : "Missing");

/**
 * Sign the query string for authenticated endpoints
 * @param {string} queryString
 * @returns {string} signature
 */
function signQuery(queryString) {
  return crypto.createHmac('sha256', SECRET_KEY).update(queryString).digest('hex');
}

/**
 * Public GET request (no signature required)
 * @param {string} path
 * @param {object} params
 */
async function publicGet(path, params = {}) {
  const url = `${REST_BASE}${path}`;
  return axios.get(url, { params });
}

/**
 * Authenticated request (signed)
 * @param {string} method - HTTP method
 * @param {string} path - API path
 * @param {object} params - query/body params
 */
async function signedRequest(method, path, params = {}) {
  params.timestamp = Date.now();
  const query = new URLSearchParams(params).toString();
  const signature = signQuery(query);
  const url = `${REST_BASE}${path}?${query}&signature=${signature}`;
  const headers = { 'X-MBX-APIKEY': API_KEY };
  return axios({ method, url, headers });
}

module.exports = { publicGet, signedRequest };
