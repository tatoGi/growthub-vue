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
        <div v-for="item in menuItems" :key="item.name" class="nav-item">
          <a :href="item.link" class="nav-link" :class="{ 'active': currentHash === item.link }" @click="closeMobileMenu">
            {{ item.name }}
            <svg v-if="item.children" class="chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          
          <div v-if="item.children" class="dropdown">
            <div class="dropdown-inner">
              <a v-for="child in item.children" :key="child.name" :href="child.link" class="dropdown-link" @click="closeMobileMenu">
                {{ child.name }}
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div class="header-actions">
        <button type="button" class="login-btn">ავტორიზაცია</button>
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
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : ''
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const menuItems = [
 
  { 
    name: 'ბიზნესის მხარდაჭერა', 
    link: '#support',
    children: [
      { name: 'ბიზნეს-უნარების გაუმჯობესება', link: '#support/skills' },
      { name: 'საკონსულტაციო მომსახურება', link: '#support/consulting' },
      { name: 'ინფორმაციით უზრუნველყოფა', link: '#support/info' }
    ]
  },
  { name: 'მიმდინარე პროგრამები', link: '#programs' },
  { name: 'ღონისძიებები', link: '#events' },
  { name: 'ვიდეო ანიმაციები', link: '#animations' },
  { 
    name: 'ჩვენ შესახებ', 
    link: '#about',
    children: [
      { name: 'პროექტის შესახებ', link: '#about/project' },
      { name: 'პარტნიორი ორგანიზაციები', link: '#about/partners' },
      { name: 'ხშირად დასმული კითხვები', link: '#about/faq' },
      { name: 'ჩვენი გუნდი', link: '#about/team' }
    ]
  },
  { name: 'დაგვიკავშირდი', link: '#contact' },
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const currentHash = ref(window.location.hash || '#/')

const updateHash = () => {
  currentHash.value = window.location.hash || '#/'
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('hashchange', updateHash)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('hashchange', updateHash)
  document.body.style.overflow = ''
})
</script>




