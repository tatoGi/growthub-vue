import http from './http'

export const profileApi = {
  get() {
    return http.get('/crm/profile')
  },

  updateContact(data) {
    // data: { name, phone, relationship }
    return http.put('/crm/profile/contact', data)
  },

  updatePassword(data) {
    // data: { current_password, password, password_confirmation }
    return http.put('/crm/profile/password', data)
  },

  updateBank(data) {
    // data: { company_name, id_code, website, contact_first, contact_last, position, phone, email }
    return http.put('/crm/profile/bank', data)
  },
}
