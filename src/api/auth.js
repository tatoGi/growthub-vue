/**
 * Auth API — NestJS endpoints
 *
 * Assumed routes (adjust to match your NestJS controller if different):
 *   POST /auth/login          { email, password }           → { access_token, user }
 *   POST /auth/register       { ...registerFields }         → { access_token, user }
 *   POST /auth/forgot-password { companyId, phone }         → { message }
 *   GET  /auth/me             (Bearer header)               → { id, email, role, name, ... }
 *   POST /auth/logout         (Bearer header)               → { message }
 */

import http from './http'

export const authApi = {
  login(email, password) {
    return http.post('/auth/login', { email, password })
  },

  register(data) {
    // data shape: { userType, email, password, phone, region,
    //               personalId?, birthYear?, companyId? }
    return http.post('/auth/register', data)
  },

  forgotPassword(companyId, phone) {
    return http.post('/auth/forgot-password', { companyId, phone })
  },

  me() {
    return http.get('/auth/me')
  },

  logout() {
    return http.post('/auth/logout')
  },
}
