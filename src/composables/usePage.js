import { ref } from 'vue'
import http from '../api/http'

const _cache = {}

export function usePage() {
  const page = ref(null)
  const loading = ref(false)
  const error = ref(false)

  async function load(slug, locale = 'ka') {
    if (_cache[slug]) {
      page.value = _cache[slug]
      return
    }

    loading.value = true
    error.value = false
    page.value = null

    try {
      const { data } = await http.get(`/website/sections/${slug}`, { params: { locale } })
      page.value = data?.data ?? null
      if (page.value) _cache[slug] = page.value
    } catch {
      error.value = true
    } finally {
      loading.value = false
    }
  }

  return { page, loading, error, load }
}
