<template>
  <div class="header-container" :class="{ 'is-scrolled': isScrolled, 'mobile-menu-open': isMobileMenuOpen }">
    <header class="header">
      <div class="brand-area">
        <a class="brand" href="#/">
          <div class="logo-wrapper">
           <img src="/assets/images/logoo.png" alt="">
          </div>
        </a>
      </div>

      <nav class="nav" :class="{ 'is-mobile': isMobileMenuOpen }">
        <div v-for="item in mainMenu" :key="item.slug" class="nav-item">
          <a :href="'#' + item.slug" class="nav-link" :class="{ 'active': isLinkActive(item) }" @click="closeMobileMenu">
            {{ item.label }}
            <svg v-if="item.children?.length" class="chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>

          <div v-if="item.children?.length" class="dropdown">
            <div class="dropdown-inner">
              <a v-for="child in item.children" :key="child.slug" :href="'#' + child.slug" class="dropdown-link" @click="closeMobileMenu">
                {{ child.label }}
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div class="header-actions">
        <template v-if="auth.isLoggedIn">
          <div class="user-nav-item" :class="{ open: isUserMenuOpen }">
            <button type="button" class="user-nav-btn" @click="toggleUserMenu">
              <span class="user-nav-avatar">{{ auth.user?.name?.charAt(0) }}</span>
              <span class="user-nav-name">{{ auth.user?.name }}</span>
              <svg class="chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="user-nav-dropdown">
              <div class="user-nav-dropdown-inner">
                <a
                  v-for="item in roleNavItems"
                  :key="item.path"
                  :href="item.path"
                  class="user-nav-link"
                  @click="closeUserMenu"
                >
                  {{ item.label }}
                </a>
                <div class="user-nav-divider" />
                <button type="button" class="user-nav-logout" @click="handleLogout">სივრცის დატოვება</button>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <button type="button" class="login-btn" @click="openAuthModal">ავტორიზაცია</button>
        </template>
        <button type="button" class="mobile-toggle" @click="toggleMobileMenu" aria-label="Toggle menu">
          <div class="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
    </header>
  </div>
</template>

<script setup>
import { inject, ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuth } from '../../../composables/useAuth'
import { useNavigation } from '../../../composables/useNavigation'
import { crmNav } from '../../../data/crm'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const openAuthModal = inject('openAuthModal', () => {})

const { auth, logout } = useAuth()
const { mainMenu, loadNavigation } = useNavigation()

const roleNavItems = computed(() => crmNav[auth.user?.role] ?? [])

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const handleLogout = () => {
  logout()
  closeUserMenu()
  window.location.hash = '#/'
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : ''
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const currentHash = ref(window.location.hash || '#/')

const updateHash = () => {
  currentHash.value = window.location.hash || '#/'
}

const isLinkActive = (item) => {
  const link = '#' + item.slug

  if (currentHash.value === link) {
    return true
  }

  if (currentHash.value.startsWith(`${link}/`)) {
    return true
  }

  if (item.children?.length) {
    return item.children.some((child) => {
      const childLink = '#' + child.slug
      return currentHash.value === childLink || currentHash.value.startsWith(`${childLink}/`)
    })
  }

  return false
}

const onClickOutside = (e) => {
  if (isUserMenuOpen.value && !e.target.closest('.user-nav-item')) {
    isUserMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('hashchange', updateHash)
  document.addEventListener('click', onClickOutside)
  loadNavigation()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('hashchange', updateHash)
  document.removeEventListener('click', onClickOutside)
  document.body.style.overflow = ''
})
</script>
