<template>
  <CrmShell
    :role="currentRole"
    :user="auth.user"
    :current-path="normalizedPath"
    :nav-items="currentNav"
    :role-meta="currentRoleMeta"
    :page="currentPage"
  />
</template>

<script setup>
import { computed } from 'vue'
import CrmShell from './CrmShell.vue'
import { crmNav, crmPageContent, crmRoleMeta } from '../../data/crm'
import { useAuth } from '../../composables/useAuth'

const props = defineProps({
  path: {
    type: String,
    default: '#crm'
  }
})

const { auth } = useAuth()

const currentRole = computed(() => auth.user?.role || 'user')

const normalizeCrmPath = (path, role) => {
  if (!path || path === '#crm' || path === '#crm/') {
    return crmRoleMeta[role].defaultPath
  }

  const cleanPath = path.split('?')[0]
  const roleNav = crmNav[role]

  if (roleNav.some(item => item.path === cleanPath)) {
    return cleanPath
  }

  return crmRoleMeta[role].defaultPath
}

const normalizedPath = computed(() => normalizeCrmPath(props.path, currentRole.value))

const currentRoleMeta = computed(() => crmRoleMeta[currentRole.value])
const currentNav = computed(() => crmNav[currentRole.value])
const currentPage = computed(() => crmPageContent[normalizedPath.value] || crmPageContent[crmRoleMeta[currentRole.value].defaultPath])
</script>

