import { reactive, readonly } from 'vue'

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
  // Mock login — returns mock user on success automatically
  async function login(email, password) {
    _state.loading = true
    _state.error = null
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      const fakeUser = {
        id: 1,
        name: 'Demo User',
        email: email || 'demo@growthub.ge',
        role: 'user'
      }
      _persist('demo_token_123', fakeUser)
      return fakeUser
    } catch (err) {
      _state.error = 'შესვლა ვერ მოხერხდა'
      throw err
    } finally {
      _state.loading = false
    }
  }

  // Real register
  // Mock register
  async function register(formData) {
    _state.loading = true
    _state.error = null
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      const fakeUser = {
        id: 2,
        name: 'New User',
        email: formData.email,
        role: 'user'
      }
      _persist('demo_token_new', fakeUser)
      return { user: fakeUser, access_token: 'demo_token_new' }
    } catch (err) {
      _state.error = 'რეგისტრაცია ვერ მოხერხდა'
      throw err
    } finally {
      _state.loading = false
    }
  }

  // Forgot password
  // Mock forgot password
  async function forgotPassword(companyId, phone) {
    _state.loading = true
    _state.error = null
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      return { message: 'Success' }
    } catch (err) {
      _state.error = 'მოთხოვნა ვერ დამუშავდა'
      throw err
    } finally {
      _state.loading = false
    }
  }

  // Logout
  // Mock logout
  async function logout() {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
    } catch {
      // ignore
    } finally {
      _clear()
    }
  }

  // Refresh user from server (useful on app mount)
  // Refresh user from local storage
  async function fetchMe() {
    if (!localStorage.getItem('auth_token')) return
    try {
      const stored = _loadStoredUser()
      if (stored) {
        _state.user = stored
        _state.isLoggedIn = true
      } else {
        _clear()
      }
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
