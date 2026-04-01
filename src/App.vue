<script setup>
import { ref, onMounted, onUnmounted, computed, provide, watch } from 'vue'
import { useAuth } from './composables/useAuth'
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
import SectionPage from './components/website/SectionPage.vue'
import EventRegistrationPage from './components/website/EventRegistrationPage.vue'
import CrmPage from './components/crm/CrmPage.vue'
import CrmBusinessPage from './components/crm/CrmBusinessPage.vue'
import CrmMessagesPage from './components/crm/CrmMessagesPage.vue'
import CrmCalendarPage from './components/crm/CrmCalendarPage.vue'
import CrmDiagnosticPage from './components/crm/CrmDiagnosticPage.vue'
import CrmCentralMembersPage from './components/crm/CrmCentralMembersPage.vue'
import CrmCentralEmployeesPage from './components/crm/CrmCentralEmployeesPage.vue'
import CrmCentralCompaniesPage from './components/crm/CrmCentralCompaniesPage.vue'
import CrmCentralReportsPage from './components/crm/CrmCentralReportsPage.vue'
import CrmCentralMaterialsPage from './components/crm/CrmCentralMaterialsPage.vue'
import CrmCentralEventsPage from './components/crm/CrmCentralEventsPage.vue'
import CrmCentralConsultingPage from './components/crm/CrmCentralConsultingPage.vue'
import CrmCentralTrainingPage from './components/crm/CrmCentralTrainingPage.vue'
import CrmCentralProjectsPage from './components/crm/CrmCentralProjectsPage.vue'
import CrmProfilePage from './components/crm/CrmProfilePage.vue'
import CrmUserEventsPage from './components/crm/CrmUserEventsPage.vue'
import CrmUserMaterialsPage from './components/crm/CrmUserMaterialsPage.vue'
import CrmUserPlanVisitPage from './components/crm/CrmUserPlanVisitPage.vue'
import CrmChangepassPage from './components/crm/CrmChangepassPage.vue'
import CrmBankProfilePage from './components/crm/CrmBankProfilePage.vue'

const currentPath = ref(window.location.hash)
const isAuthModalOpen = ref(false)

const { auth, fetchMe } = useAuth()

const decodeHashValue = (value) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const updatePath = () => {
  currentPath.value = window.location.hash
}

const openAuthModal = () => {
  isAuthModalOpen.value = true
}

provide('openAuthModal', openAuthModal)

watch(currentPath, (path) => {
  if (path.startsWith('#crm') && !auth.isLoggedIn) {
    window.location.hash = '#/'
    isAuthModalOpen.value = true
  }
})


const currentDynamicSlug = computed(() => {
  const hashPath = (currentPath.value || '')
    .replace(/^#/, '')
    .split('?')[0]
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')

  if (!hashPath) {
    return ''
  }

  if (hashPath.startsWith('page/')) {
    return decodeHashValue(hashPath.replace(/^page\//, ''))
  }

  if (hashPath.startsWith('section/')) {
    return decodeHashValue(hashPath.replace(/^section\//, ''))
  }

  return decodeHashValue(hashPath)
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
  // Re-validate JWT on every page load so session stays fresh
  fetchMe()
})

onUnmounted(() => {
  window.removeEventListener('hashchange', updatePath)
})
</script>

<template>
  <WebsiteHome v-if="currentPath === '#/' || currentPath === ''" />
  <CrmBusinessPage v-else-if="currentPath === '#crm/user/business'" />
  <CrmMessagesPage v-else-if="currentPath === '#crm/user/messages' || currentPath === '#crm/central/messages'" />
  <CrmCalendarPage v-else-if="currentPath === '#crm/user/calendar' || currentPath === '#crm/central/calendar'" />
  <CrmDiagnosticPage v-else-if="currentPath === '#crm/user/diagnostic' || currentPath === '#crm/central/diagnostic'" />
  <CrmProfilePage v-else-if="currentPath === '#crm/user/profile' || currentPath === '#crm/central/profile' || currentPath === '#crm/bank/profile'" />
  <CrmCentralMembersPage v-else-if="currentPath === '#crm/central/members'" />
  <CrmCentralEmployeesPage v-else-if="currentPath === '#crm/central/employees'" />
  <CrmCentralCompaniesPage v-else-if="currentPath === '#crm/central/companies'" />
  <CrmCentralReportsPage v-else-if="currentPath === '#crm/central/reports'" />
  <CrmCentralMaterialsPage v-else-if="currentPath === '#crm/central/materials'" />
  <CrmCentralEventsPage v-else-if="currentPath === '#crm/central/events'" />
  <CrmCentralConsultingPage v-else-if="currentPath === '#crm/central/consulting'" />
  <CrmCentralTrainingPage v-else-if="currentPath === '#crm/central/training'" />
  <CrmCentralProjectsPage v-else-if="currentPath === '#crm/central/projects'" />
  <CrmBankProfilePage v-else-if="currentPath === '#crm/bank/profile'" />
  <CrmUserEventsPage v-else-if="currentPath === '#crm/user/events'" />
  <CrmUserMaterialsPage v-else-if="currentPath === '#crm/user/materials'" />
  <CrmUserPlanVisitPage v-else-if="currentPath === '#crm/user/plan-visit'" />
  <CrmChangepassPage v-else-if="currentPath === '#crm/user/changepass' || currentPath === '#crm/central/changepass' || currentPath === '#crm/bank/changepass'" />
  <CrmPage v-else-if="currentPath.startsWith('#crm')" :path="currentPath" />
  <ProgramDetailPage v-else-if="currentPath.startsWith('#programs/')" :slug="currentProgramSlug" />
  <EventRegistrationPage v-else-if="currentPath.startsWith('#events/') && currentPath.endsWith('/register')" :slug="currentEventSlug" />
  <EventDetailPage v-else-if="currentPath.startsWith('#events/')" :slug="currentEventSlug" />
  <AnimationDetailPage v-else-if="currentPath.startsWith('#animations/')" :slug="currentAnimationSlug" />
  <SearchPage v-else-if="currentPath.startsWith('#search')" :query="currentSearchQuery" />
  <AgencyDetailPage v-else-if="currentPath.startsWith('#agency/')" :slug="currentAgencySlug" />
  <PartnerDetailPage v-else-if="currentPath.startsWith('#about/partners/')" :slug="currentPartnerSlug" />
  <TeamDetailPage v-else-if="currentPath.startsWith('#about/team/')" :slug="currentTeamSlug" />
  <SectionPage v-else-if="currentDynamicSlug" :slug="currentDynamicSlug" />
  <WebsiteHome v-else />
  <AuthModal v-model="isAuthModalOpen" />
</template>
