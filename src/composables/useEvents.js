import { readonly, ref, reactive } from 'vue'
import http from '../api/http'

const _page = ref({
  title: 'ღონისძიებები',
  description: '',
  cover: null,
  filters: {
    types: [],
    locations: [],
  },
})

const _events = ref([])
const _details = reactive({})
const _eventsLoaded = ref(false)
const _eventsPending = ref(false)
const _detailPending = reactive({})

export function useEvents() {
  async function loadEvents(locale = 'ka') {
    if (_eventsLoaded.value || _eventsPending.value) {
      return
    }

    _eventsPending.value = true

    try {
      const { data } = await http.get('/website/events', { params: { locale } })
      const payload = data?.data ?? {}

      _page.value = {
        title: payload.title || 'ღონისძიებები',
        description: payload.description || '',
        cover: payload.cover || null,
        filters: {
          types: payload.filters?.types || [],
          locations: payload.filters?.locations || [],
        },
      }
      _events.value = payload.events || []

      for (const event of _events.value) {
        if (event?.slug) {
          _details[event.slug] = event
        }
      }
    } catch {
      _events.value = []
    } finally {
      _eventsLoaded.value = true
      _eventsPending.value = false
    }
  }

  async function loadEvent(slug, locale = 'ka') {
    if (!slug || Object.prototype.hasOwnProperty.call(_details, slug) || _detailPending[slug]) {
      return
    }

    _detailPending[slug] = true

    try {
      const { data } = await http.get(`/website/events/${encodeURIComponent(slug)}`, { params: { locale } })
      _details[slug] = data?.data?.event ?? null
    } catch {
      _details[slug] = null
    } finally {
      delete _detailPending[slug]
    }
  }

  return {
    page: readonly(_page),
    events: readonly(_events),
    eventDetails: readonly(_details),
    eventsLoaded: readonly(_eventsLoaded),
    eventsPending: readonly(_eventsPending),
    detailPending: readonly(_detailPending),
    loadEvents,
    loadEvent,
  }
}
