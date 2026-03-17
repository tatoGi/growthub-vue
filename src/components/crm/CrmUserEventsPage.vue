<template>
  <InnerPageLayout title="ღონისძიებები" breadcrumb="ღონისძიებები">
    <div class="mem-page-bg">
    <div class="container mem-body">

      <!-- Stats -->
      <div class="mem-stats-bar">
        <div class="mem-stat"><strong>{{ registeredCount }}</strong><span>დარეგ.</span></div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat"><strong>{{ upcomingCount }}</strong><span>მომავალი</span></div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat"><strong>{{ availableCount }}</strong><span>ხელმისაწვდ.</span></div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat"><strong>{{ completedCount }}</strong><span>დასრულებ.</span></div>
      </div>

      <!-- Tabs -->
      <div class="rep-period-tabs">
        <button v-for="t in tabs" :key="t.key" type="button" class="rep-period-tab" :class="{active:activeTab===t.key}" @click="activeTab=t.key">
          {{ t.label }}
          <span v-if="tabCounts[t.key]" class="ev-tab-count">{{ tabCounts[t.key] }}</span>
        </button>
      </div>

      <!-- Filters -->
      <div class="mem-filters">
        <div class="mem-search-wrap">
          <svg class="mem-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" class="mem-search-input" v-model="searchQuery" placeholder="ღონისძიების სახელი, ადგილი..." />
          <button v-if="searchQuery" type="button" class="mem-search-clear" @click="searchQuery=''">✕</button>
        </div>
        <select class="mem-filter-select" v-model="filterType">
          <option value="">ყველა ტიპი</option>
          <option v-for="t in eventTypes" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>

      <!-- Empty -->
      <div v-if="filtered.length===0" class="mat-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".25"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <p>ღონისძიება ვერ მოიძებნა</p>
      </div>

      <!-- Grid -->
      <div v-else class="uev-grid">
        <div v-for="ev in filtered" :key="ev.id" class="uev-card">
          <!-- Top color strip -->
          <div class="uev-card-strip" :class="`uev-strip-${ev.typeKey}`">
            <div class="uev-strip-left">
              <div class="uev-day">{{ ev.dayNum }}</div>
              <div class="uev-month">{{ ev.monthName }}</div>
            </div>
            <span class="rep-type-badge" :class="`rep-type-${ev.typeKey}`" style="border:1.5px solid rgba(255,255,255,.35)">{{ ev.eventType }}</span>
          </div>

          <div class="uev-card-body">
            <div class="uev-title">{{ ev.title }}</div>
            <div class="uev-meta">
              <span class="ev-meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ ev.location }}
              </span>
              <span class="ev-meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ ev.timeLabel }}
              </span>
            </div>
            <div class="uev-card-footer">
              <span class="uev-reg-badge" :class="`uev-reg-${ev.regStatus}`">{{ regLabel(ev.regStatus) }}</span>
              <button type="button" class="uev-reg-btn" :class="`uev-reg-btn-${ev.regStatus}`"
                v-if="ev.regStatus !== 'completed'"
                @click="toggleReg(ev)">
                {{ ev.regStatus === 'registered' ? 'გაუქმება' : 'დარეგისტრირება' }}
              </button>
              <span v-else class="uev-attended">✓ დასწრებული</span>
            </div>
          </div>
        </div>
      </div>

    </div>
    </div>
  </InnerPageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import InnerPageLayout from '../website/shared/InnerPageLayout.vue'

const searchQuery = ref('')
const filterType  = ref('')
const activeTab   = ref('all')

const eventTypes = ['ტრენინგი','ვორქშოფი','ვებინარი','კონსულტაცია','საინფ. შეხვედრა']

const tabs = [
  { key:'all',        label:'ყველა' },
  { key:'registered', label:'დარეგ.' },
  { key:'available',  label:'ხელმისაწვდ.' },
  { key:'completed',  label:'დასრულ.' },
]

const events = ref([
  { id:1,  title:'ციფრული ტრანსფორმაცია — ფინანსური სექტ.',  typeKey:'training',  eventType:'ტრენინგი',         dayNum:18, monthName:'მარ', timeLabel:'10:00–14:00', location:'თბილისი, იუსტ. სახლი', regStatus:'registered' },
  { id:2,  title:'ფინანსებზე წვდომა — პრაქტიკული სახელმ.',    typeKey:'workshop',  eventType:'ვორქშოფი',         dayNum:22, monthName:'მარ', timeLabel:'11:00–16:00', location:'ქუთაისი, ბიზნეს ცენტ.', regStatus:'registered' },
  { id:3,  title:'ბიზნეს მოდელირება — სტრატეგიული ხედვა',     typeKey:'webinar',   eventType:'ვებინარი',          dayNum:25, monthName:'მარ', timeLabel:'15:00–17:00', location:'ონლაინ (Zoom)',          regStatus:'available' },
  { id:4,  title:'გაყიდვების ტექნიკები — B2B სეგმენტი',        typeKey:'training',  eventType:'ტრენინგი',         dayNum:2,  monthName:'აპრ', timeLabel:'09:00–13:00', location:'ბათუმი, ექსპო ცენტ.',   regStatus:'available' },
  { id:5,  title:'საგადასახადო დაგეგმვა 2025',                 typeKey:'consulting',eventType:'კონსულტაცია',      dayNum:5,  monthName:'აპრ', timeLabel:'14:00–16:00', location:'თბილისი, A. სახ. 7',    regStatus:'available' },
  { id:6,  title:'ექსპორტის შესაძლებლობები',                   typeKey:'meeting',   eventType:'საინფ. შეხვედრა',  dayNum:9,  monthName:'აპრ', timeLabel:'10:00–12:00', location:'ქუთაისი, IDP',          regStatus:'available' },
  { id:7,  title:'HR მართვა — პრაქტიკული სემინარი',            typeKey:'workshop',  eventType:'ვორქშოფი',         dayNum:15, monthName:'თებ', timeLabel:'10:00–15:00', location:'თბილისი, Green B.',     regStatus:'completed' },
  { id:8,  title:'ელექტრონული ვაჭრობა — დამწყებთათვის',       typeKey:'webinar',   eventType:'ვებინარი',          dayNum:8,  monthName:'თებ', timeLabel:'16:00–18:00', location:'ონლაინ (Zoom)',          regStatus:'completed' },
])

const registeredCount = computed(() => events.value.filter(e=>e.regStatus==='registered').length)
const upcomingCount   = computed(() => events.value.filter(e=>e.regStatus==='registered'||e.regStatus==='available').length)
const availableCount  = computed(() => events.value.filter(e=>e.regStatus==='available').length)
const completedCount  = computed(() => events.value.filter(e=>e.regStatus==='completed').length)

const tabCounts = computed(() => {
  const c = { all: events.value.length }
  tabs.slice(1).forEach(t => { c[t.key] = events.value.filter(e => e.regStatus===t.key).length })
  return c
})

const filtered = computed(() => {
  let list = events.value
  if (activeTab.value !== 'all') list = list.filter(e => e.regStatus === activeTab.value)
  const q = searchQuery.value.toLowerCase()
  if (q) list = list.filter(e => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q))
  if (filterType.value) list = list.filter(e => e.eventType === filterType.value)
  return list
})

const regLabel = (s) => ({ registered:'დარეგ.', available:'ხელმისაწვდ.', completed:'დასრულ.' })[s] || s

const toggleReg = (ev) => {
  ev.regStatus = ev.regStatus === 'registered' ? 'available' : 'registered'
}
</script>
