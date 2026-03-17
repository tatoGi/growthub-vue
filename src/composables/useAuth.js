import { reactive, readonly } from 'vue'

const _state = reactive({
  isLoggedIn: false,
  user: null // { name: string, role: 'user' | 'central' | 'bank' }
})

const _roleLabels = {
  user: 'ბიზნეს მომხმარებელი',
  central: 'ცენტრის თანამშრომელი',
  bank: 'ბანკის წარმომადგენელი'
}

export function useAuth() {
  const login = (role) => {
    _state.isLoggedIn = true
    _state.user = { name: _roleLabels[role], role }
  }

  const logout = () => {
    _state.isLoggedIn = false
    _state.user = null
  }

  return { auth: readonly(_state), login, logout }
}
