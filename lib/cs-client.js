'use strict';
// Low-level HTTP client for the Content Server REST API.
//
// By design this client can only do two things:
//   1. POST /api/v1/auth to exchange a user name and password for a ticket
//   2. GET anything else
// The trainer never writes to Content Server; the learner does all the work.

const http = require('http');
const https = require('https');
const { URL } = require('url');

class CSError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status || 0;
    this.code = code || 'CS_ERROR';
  }
}

class CSClient {
  constructor({ baseUrl, allowSelfSignedCerts = false, timeoutMs = 20000 }) {
    if (!baseUrl) throw new Error('contentServer.baseUrl is not configured');
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.timeoutMs = timeoutMs;
    this.httpAgent = new http.Agent({ keepAlive: true, maxSockets: 16 });
    this.httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 16, rejectUnauthorized: !allowSelfSignedCerts });
  }

  _url(path, query) {
    const u = new URL(this.baseUrl + path);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined && v !== null) u.searchParams.set(k, String(v));
      }
    }
    return u;
  }

  _request(method, path, { ticket, form, query } = {}) {
    const url = this._url(path, query);
    const isHttps = url.protocol === 'https:';
    const body = form ? new URLSearchParams(form).toString() : null;
    const headers = { Accept: 'application/json' };
    if (ticket) headers.OTCSTicket = ticket;
    if (body) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      headers['Content-Length'] = Buffer.byteLength(body);
    }

    return new Promise((resolve, reject) => {
      const req = (isHttps ? https : http).request(url, {
        method,
        headers,
        agent: isHttps ? this.httpsAgent : this.httpAgent,
        timeout: this.timeoutMs,
      }, (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          let json = null;
          try { json = text ? JSON.parse(text) : null; } catch { /* HTML error page or login redirect */ }
          resolve({ status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 300 && json !== null, headers: res.headers, json, text });
        });
      });
      req.on('timeout', () => req.destroy(new CSError(`Content Server did not answer within ${this.timeoutMs} ms`, 504, 'TIMEOUT')));
      req.on('error', (err) => reject(err instanceof CSError ? err : new CSError(`Cannot reach Content Server at ${this.baseUrl}: ${err.message}`, 502, 'UNREACHABLE')));
      if (body) req.write(body);
      req.end();
    });
  }

  async authenticate(username, password) {
    const res = await this._request('POST', '/api/v1/auth', { form: { username, password } });
    if (res.json && res.json.ticket) return res.json.ticket;
    if (res.status === 401 || res.status === 403 || (res.json && res.json.error)) {
      throw new CSError((res.json && res.json.error) || 'Invalid user name or password', 401, 'BAD_LOGIN');
    }
    throw new CSError(`Unexpected answer from Content Server (HTTP ${res.status}). Check contentServer.baseUrl — it should end with cs.exe or llisapi.dll.`, 502, 'BAD_RESPONSE');
  }

  // session: any object with a mutable `ticket` property. Content Server may
  // hand back a refreshed ticket on every response; we keep the newest one.
  async get(path, session, query) {
    const res = await this._request('GET', path, { ticket: session && session.ticket, query });
    const fresh = res.headers && res.headers.otcsticket;
    if (fresh && session) session.ticket = fresh;
    if (res.status === 401) throw new CSError('Your Content Server session has expired. Please sign in again.', 401, 'SESSION_EXPIRED');
    return res;
  }

  // Unauthenticated reachability probe used by the health endpoint.
  async ping() {
    try {
      const res = await this._request('GET', '/api/v1/serverinfo');
      return { reachable: true, status: res.status, json: res.json };
    } catch (err) {
      return { reachable: false, error: err.message };
    }
  }
}

module.exports = { CSClient, CSError };
