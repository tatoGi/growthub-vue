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
import CrmPage from './components/crm/CrmPage.vue'
import CrmBusinessPage from './components/crm/CrmBusinessPage.vue'
import CrmMessagesPage from './components/crm/CrmMessagesPage.vue'
import CrmCalendarPage from './components/crm/CrmCalendarPage.vue'
import CrmDiagnosticPage from './components/crm/CrmDiagnosticPage.vue'
import CrmCentralProfilePage from './components/crm/CrmCentralProfilePage.vue'
import CrmCentralMembersPage from './components/crm/CrmCentralMembersPage.vue'
import CrmCentralEmployeesPage from './components/crm/CrmCentralEmployeesPage.vue'
import CrmCentralCompaniesPage from './components/crm/CrmCentralCompaniesPage.vue'
import CrmCentralReportsPage from './components/crm/CrmCentralReportsPage.vue'
import CrmCentralMaterialsPage from './components/crm/CrmCentralMaterialsPage.vue'
import CrmCentralEventsPage from './components/crm/CrmCentralEventsPage.vue'
import CrmCentralConsultingPage from './components/crm/CrmCentralConsultingPage.vue'
import CrmCentralTrainingPage from './components/crm/CrmCentralTrainingPage.vue'
import CrmCentralProjectsPage from './components/crm/CrmCentralProjectsPage.vue'
import CrmBankProfilePage from './components/crm/CrmBankProfilePage.vue'
import CrmUserEventsPage from './components/crm/CrmUserEventsPage.vue'
import CrmUserMaterialsPage from './components/crm/CrmUserMaterialsPage.vue'
import CrmUserPlanVisitPage from './components/crm/CrmUserPlanVisitPage.vue'
import CrmChangepassPage from './components/crm/CrmChangepassPage.vue'

const currentPath = ref(window.location.hash)
const isAuthModalOpen = ref(false)

const { auth } = useAuth()

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
  <CrmBusinessPage v-else-if="currentPath === '#crm/user/business'" />
  <CrmMessagesPage v-else-if="currentPath === '#crm/user/messages' || currentPath === '#crm/central/messages'" />
  <CrmCalendarPage v-else-if="currentPath === '#crm/user/calendar' || currentPath === '#crm/central/calendar'" />
  <CrmDiagnosticPage v-else-if="currentPath === '#crm/user/diagnostic' || currentPath === '#crm/central/diagnostic'" />
  <CrmCentralProfilePage v-else-if="currentPath === '#crm/central/profile'" />
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
