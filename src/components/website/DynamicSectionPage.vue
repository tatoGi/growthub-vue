<template>
  <SubmenuLandingPage v-if="page?.kind === 'section'" :slug="slug" />
  <TextPageTemplate v-else :slug="slug" />
</template>

<script setup>
import { computed, watch } from 'vue'
import { useSectionPage } from '../../composables/useSectionPage'
import SubmenuLandingPage from './SubmenuLandingPage.vue'
import TextPageTemplate from './TextPageTemplate.vue'

const props = defineProps({
  slug: {
    type: String,
    default: '',
  },
})

const { pages, loadSectionPage } = useSectionPage()

const page = computed(() => pages[props.slug] ?? null)

watch(
  () => props.slug,
  async (slug) => {
    if (!slug) {
      return
    }

    await loadSectionPage(slug)
  },
  { immediate: true },
)
</script>
