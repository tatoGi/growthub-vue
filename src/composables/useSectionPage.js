import { readonly, reactive } from 'vue'

const _pages = reactive({})
const _pending = reactive({})

export function useSectionPage() {
  async function loadSectionPage(slug, locale = 'ka') {
    if (!slug || Object.prototype.hasOwnProperty.call(_pages, slug) || _pending[slug]) {
      return
    }

    _pending[slug] = true

    try {
      // Mock page data for any requested section slug
      await new Promise(resolve => setTimeout(resolve, 300))
      _pages[slug] = {
        title: 'Mock Section Page',
        slug: slug,
        blocks: [
          {
            type: 'text',
            data: {
              content: `<h2>This is a static mock for section: ${slug}</h2><p>Since the app is fully static now, all sections return this fallback content.</p>`
            }
          }
        ]
      }
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
