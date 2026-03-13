<script setup>
import { ref, onMounted, onUnmounted, computed, provide } from 'vue'
import WebsiteHome from './components/website/WebsiteHome.vue'
import ProgramsPage from './components/website/ProgramsPage.vue'
import ProgramDetailPage from './components/website/ProgramDetailPage.vue'
import EventsPage from './components/website/EventsPage.vue'
import EventDetailPage from './components/website/EventDetailPage.vue'
import AnimationsPage from './components/website/AnimationsPage.vue'
import AnimationDetailPage from './components/website/AnimationDetailPage.vue'
import ContactPage from './components/website/ContactPage.vue'
import AuthModal from './components/website/shared/AuthModal.vue'
import SearchPage from './components/website/SearchPage.vue'
import AgencyPage from './components/website/AgencyPage.vue'
import AgencyDetailPage from './components/website/AgencyDetailPage.vue'
import PartnerDetailPage from './components/website/PartnerDetailPage.vue'
import TeamDetailPage from './components/website/TeamDetailPage.vue'
import TextPageTemplate from './components/website/TextPageTemplate.vue'
import SubmenuLandingPage from './components/website/SubmenuLandingPage.vue'
import EventRegistrationPage from './components/website/EventRegistrationPage.vue'
import SupportPage from './components/website/SupportPage.vue'
import SupportSkillsPage from './components/website/SupportSkillsPage.vue'
import SupportConsultingPage from './components/website/SupportConsultingPage.vue'
import SupportInfoPage from './components/website/SupportInfoPage.vue'
import AboutPage from './components/website/AboutPage.vue'
import AboutProjectPage from './components/website/AboutProjectPage.vue'
import AboutPartnersPage from './components/website/AboutPartnersPage.vue'
import AboutFaqPage from './components/website/AboutFaqPage.vue'
import AboutTeamPage from './components/website/AboutTeamPage.vue'

const currentPath = ref(window.location.hash)
const isAuthModalOpen = ref(false)

const updatePath = () => {
  currentPath.value = window.location.hash
}

const openAuthModal = () => {
  isAuthModalOpen.value = true
}

provide('openAuthModal', openAuthModal)

const currentProgramSlug = computed(() => {
  if (!currentPath.value?.startsWith('#programs/')) {
    return ''
  }

  return currentPath.value.replace('#programs/', '')
})

const currentEventSlug = computed(() => {
  if (!currentPath.value?.startsWith('#events/')) {
    return ''
  }

  return currentPath.value.replace('#events/', '').replace('/register', '')
})

const currentAnimationSlug = computed(() => {
  if (!currentPath.value?.startsWith('#animations/')) {
    return ''
  }

  return currentPath.value.replace('#animations/', '')
})

const currentAgencySlug = computed(() => {
  if (!currentPath.value?.startsWith('#agency/')) {
    return ''
  }

  return currentPath.value.replace('#agency/', '').split('?')[0]
})

const currentPartnerSlug = computed(() => {
  if (!currentPath.value?.startsWith('#about/partners/')) {
    return ''
  }

  return currentPath.value.replace('#about/partners/', '').split('?')[0]
})

const currentTeamSlug = computed(() => {
  if (!currentPath.value?.startsWith('#about/team/')) {
    return ''
  }

  return currentPath.value.replace('#about/team/', '').split('?')[0]
})

const currentTextPageSlug = computed(() => {
  if (!currentPath.value?.startsWith('#page/')) {
    return ''
  }

  return currentPath.value.replace('#page/', '').split('?')[0]
})

const currentSubmenuSlug = computed(() => {
  if (!currentPath.value?.startsWith('#section/')) {
    return ''
  }

  return currentPath.value.replace('#section/', '').split('?')[0]
})

const currentSearchQuery = computed(() => {
  if (!currentPath.value?.startsWith('#search')) {
    return ''
  }

  const [, queryString = ''] = currentPath.value.split('?')
  const params = new URLSearchParams(queryString)
  return decodeURIComponent(params.get('q') || '')
})

onMounted(() => {
  window.addEventListener('hashchange', updatePath)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', updatePath)
})
</script>

<template>
  <WebsiteHome v-if="currentPath === '#/' || currentPath === ''" />
  <ProgramsPage v-else-if="currentPath === '#programs'" />
  <ProgramDetailPage v-else-if="currentPath.startsWith('#programs/')" :slug="currentProgramSlug" />
  <EventsPage v-else-if="currentPath === '#events'" />
  <EventRegistrationPage v-else-if="currentPath.startsWith('#events/') && currentPath.endsWith('/register')" :slug="currentEventSlug" />
  <EventDetailPage v-else-if="currentPath.startsWith('#events/')" :slug="currentEventSlug" />
  <AnimationsPage v-else-if="currentPath === '#animations'" />
  <AnimationDetailPage v-else-if="currentPath.startsWith('#animations/')" :slug="currentAnimationSlug" />
  <SearchPage v-else-if="currentPath.startsWith('#search')" :query="currentSearchQuery" />
  <AgencyPage v-else-if="currentPath === '#agency'" />
  <AgencyDetailPage v-else-if="currentPath.startsWith('#agency/')" :slug="currentAgencySlug" />
  <ContactPage v-else-if="currentPath === '#contact'" />
  <SupportPage v-else-if="currentPath === '#support'" />
  <SupportSkillsPage v-else-if="currentPath === '#support/skills'" />
  <SupportConsultingPage v-else-if="currentPath === '#support/consulting'" />
  <SupportInfoPage v-else-if="currentPath === '#support/info'" />
  <AboutPage v-else-if="currentPath === '#about'" />
  <AboutProjectPage v-else-if="currentPath === '#about/project'" />
  <AboutPartnersPage v-else-if="currentPath === '#about/partners'" />
  <PartnerDetailPage v-else-if="currentPath.startsWith('#about/partners/')" :slug="currentPartnerSlug" />
  <AboutFaqPage v-else-if="currentPath === '#about/faq'" />
  <AboutTeamPage v-else-if="currentPath === '#about/team'" />
  <TeamDetailPage v-else-if="currentPath.startsWith('#about/team/')" :slug="currentTeamSlug" />
  <TextPageTemplate v-else-if="currentPath.startsWith('#page/')" :slug="currentTextPageSlug" />
  <SubmenuLandingPage v-else-if="currentPath.startsWith('#section/')" :slug="currentSubmenuSlug" />
  <WebsiteHome v-else />
  <AuthModal v-model="isAuthModalOpen" />
</template>
