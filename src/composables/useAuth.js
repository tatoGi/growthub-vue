import { reactive, readonly } from 'vue'
import { authApi } from '../api/auth'

// Restore session from localStorage on page refresh
function _loadStoredUser() {
  try {
    const raw = localStorage.getItem('auth_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const _state = reactive({
  isLoggedIn: !!localStorage.getItem('auth_token'),
  user: _loadStoredUser(), // { id, name, email, role: 'user' | 'central' | 'bank' }
  loading: false,
  error: null,
})

function _persist(token, user) {
  localStorage.setItem('auth_token', token)
  localStorage.setItem('auth_user', JSON.stringify(user))
  _state.isLoggedIn = true
  _state.user = user
  _state.error = null
}

function _clear() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
  _state.isLoggedIn = false
  _state.user = null
}

export function useAuth() {
  // Real login — returns user on success, throws on failure
  async function login(email, password) {
    _state.loading = true
    _state.error = null
    try {
      const { data } = await authApi.login(email, password)
      // Laravel response: { success, data: { access_token, user } }
      const payload = data.data
      _persist(payload.access_token, payload.user)
      return payload.user
    } catch (err) {
      _state.error = err.response?.data?.message || 'შესვლა ვერ მოხერხდა'
      throw err
    } finally {
      _state.loading = false
    }
  }

  // Real register
  async function register(formData) {
    _state.loading = true
    _state.error = null
    try {
      const { data } = await authApi.register(formData)
      // Laravel response: { success, data: { access_token, user } }
      const payload = data.data
      if (payload?.access_token) {
        _persist(payload.access_token, payload.user)
      }
      return payload
    } catch (err) {
      _state.error = err.response?.data?.message || 'რეგისტრაცია ვერ მოხერხდა'
      throw err
    } finally {
      _state.loading = false
    }
  }

  // Forgot password
  async function forgotPassword(companyId, phone) {
    _state.loading = true
    _state.error = null
    try {
      const { data } = await authApi.forgotPassword(companyId, phone)
      return data.data
    } catch (err) {
      _state.error = err.response?.data?.message || 'მოთხოვნა ვერ დამუშავდა'
      throw err
    } finally {
      _state.loading = false
    }
  }

  // Logout
  async function logout() {
    try {
      await authApi.logout()
    } catch {
      // silently ignore server errors on logout
    } finally {
      _clear()
    }
  }

  // Refresh user from server (useful on app mount)
  async function fetchMe() {
    if (!localStorage.getItem('auth_token')) return
    try {
      const { data } = await authApi.me()
      // Laravel response: { success, data: { id, name, email, role } }
      const user = data.data
      _state.user = user
      _state.isLoggedIn = true
      localStorage.setItem('auth_user', JSON.stringify(user))
    } catch {
      _clear()
    }
  }

  // Demo / mock login — kept for development convenience
  function demoLogin(role) {
    const roleLabels = {
      user: 'ბიზნეს მომხმარებელი',
      central: 'ცენტრის თანამშრომელი',
      bank: 'ბანკის წარმომადგენელი',
    }
    const fakeUser = { id: 0, name: roleLabels[role], email: 'demo@growthub.ge', role }
    localStorage.setItem('auth_token', `demo_${role}`)
    localStorage.setItem('auth_user', JSON.stringify(fakeUser))
    _state.isLoggedIn = true
    _state.user = fakeUser
    _state.error = null
  }

  return {
    auth: readonly(_state),
    login,
    register,
    forgotPassword,
    logout,
    fetchMe,
    demoLogin,
  }
}
