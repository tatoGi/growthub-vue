<template>
  <InnerPageLayout :title="page.title" :breadcrumb="page.title" :description="page.intro">
    <div class="container crm-page-body">
      <div class="crm-page-chips" v-if="page.chips?.length">
        <span v-for="chip in page.chips" :key="chip" class="crm-chip">{{ chip }}</span>
      </div>

      <div class="crm-page-grid">
        <div class="crm-page-main">
          <div class="crm-panel-grid">
            <article v-for="panel in page.panels" :key="panel.title" class="crm-panel">
              <h2>{{ panel.title }}</h2>
              <p>{{ panel.text }}</p>
              <ul class="crm-list">
                <li v-for="item in panel.items" :key="item">{{ item }}</li>
              </ul>
            </article>
          </div>
        </div>

        <aside class="crm-page-side">
          <article v-for="card in page.sideCards" :key="card.label" class="crm-side-card">
            <span>{{ card.label }}</span>
            <strong>{{ card.value }}</strong>
            <p>{{ card.note }}</p>
          </article>
        </aside>
      </div>
    </div>
  </InnerPageLayout>
</template>

<script setup>
import InnerPageLayout from '../website/shared/InnerPageLayout.vue'
import { crmPageContent, crmRoleMeta, crmNav } from '../../data/crm'
import { useAuth } from '../../composables/useAuth'
import { computed } from 'vue'

const props = defineProps({
  path: { type: String, default: '' }
})

const { auth } = useAuth()

const currentRole = computed(() => auth.user?.role ?? 'user')

const normalizedPath = computed(() => {
  const clean = props.path.split('?')[0]
  const nav = crmNav[currentRole.value]
  if (nav.some(item => item.path === clean)) return clean
  return crmRoleMeta[currentRole.value].defaultPath
})

const page = computed(() => crmPageContent[normalizedPath.value] ?? crmPageContent[crmRoleMeta[currentRole.value].defaultPath])
</script>
