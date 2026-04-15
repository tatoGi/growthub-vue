import { readonly, ref, reactive } from 'vue'
import { events, eventRegions, eventTypes, findEventBySlug } from '../data/events'

const _page = ref({
  title: 'ღონისძიებები',
  description: 'ყველა აქტიური ღონისძიება',
  cover: null,
  filters: {
    types: eventTypes,
    locations: eventRegions,
  },
})

const _events = ref(events)
const _details = reactive(Object.fromEntries(events.map(e => [e.slug, e])))
const _eventsLoaded = ref(true)
const _eventsPending = ref(false)
const _detailPending = reactive({})

export function useEvents() {
  function loadEvents() {
    // data already loaded from static source
  }

  function loadEvent(slug) {
    if (!slug) return
    if (!Object.prototype.hasOwnProperty.call(_details, slug)) {
      const found = findEventBySlug(slug)
      _details[slug] = found ?? null
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
