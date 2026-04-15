// Mock API instead of HTTP
export const profileApi = {
  async get() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { data: { data: { name: 'Demo User', phone: '555123456', relationship: 'Manager' } } }
  },

  async updateContact(data) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { data: { message: 'Success' } }
  },

  async updatePassword(data) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { data: { message: 'Success' } }
  },

  async updateBank(data) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { data: { message: 'Success' } }
  },
}
