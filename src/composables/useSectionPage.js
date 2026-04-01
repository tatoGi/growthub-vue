import { readonly, reactive } from 'vue'
import http from '../api/http'

const _pages = reactive({})
const _pending = reactive({})

export function useSectionPage() {
  async function loadSectionPage(slug, locale = 'ka') {
    if (!slug || Object.prototype.hasOwnProperty.call(_pages, slug) || _pending[slug]) {
      return
    }

    _pending[slug] = true

    try {
      const { data } = await http.get(`/website/sections/${encodeURI(slug)}`, { params: { locale } })
      _pages[slug] = data?.data ?? null
    } catch {
      _pages[slug] = null
    } finally {
      delete _pending[slug]
    }
  }

  return {
    pages: readonly(_pages),
    pending: readonly(_pending),
    loadSectionPage,
  }
}
