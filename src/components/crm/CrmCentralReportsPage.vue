<template>
  <InnerPageLayout title="რეპორტები" breadcrumb="რეპორტები">
    <div class="mem-page-bg">
    <div class="container mem-body">

      <!-- KPI bar -->
      <div class="mem-stats-bar">
        <div class="mem-stat">
          <strong>{{ filteredReports.length }}</strong>
          <span>ჩანაწერი</span>
        </div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat">
          <strong>{{ totalAttendees }}</strong>
          <span>დამსწრე</span>
        </div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat">
          <strong>{{ uniqueEmployees }}</strong>
          <span>თანამშრომელი</span>
        </div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat">
          <strong>{{ avgAttendees }}</strong>
          <span>საშ. დამსწრე</span>
        </div>
        <div class="mem-stats-actions">
          <button type="button" class="members-download-btn" @click="downloadCsv">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            CSV
          </button>
        </div>
      </div>

      <!-- Period tabs -->
      <div class="rep-period-tabs">
        <button
          v-for="p in periods" :key="p.key"
          type="button"
          class="rep-period-tab"
          :class="{ active: activePeriod === p.key }"
          @click="activePeriod = p.key; currentPage = 1"
        >{{ p.label }}</button>
      </div>

      <!-- Monthly mini-chart -->
      <div class="rep-chart-wrap">
        <div class="rep-chart-title">ჩანაწერები თვეების მიხედვით</div>
        <div class="rep-bars">
          <div v-for="bar in monthlyBars" :key="bar.month" class="rep-bar-col">
            <div class="rep-bar-track">
              <div class="rep-bar-fill" :style="{ height: bar.pct + '%' }"></div>
            </div>
            <span class="rep-bar-count">{{ bar.count }}</span>
            <span class="rep-bar-label">{{ bar.month }}</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="mem-filters">
        <div class="mem-search-wrap">
          <svg class="mem-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" class="mem-search-input" v-model="searchQuery" placeholder="ღონისძიება, თანამშრომელი, ადგილი..." />
          <button v-if="searchQuery" type="button" class="mem-search-clear" @click="searchQuery = ''">✕</button>
        </div>
        <select class="mem-filter-select" v-model="filterType">
          <option value="">ყველა ტიპი</option>
          <option v-for="t in eventTypes" :key="t" :value="t">{{ t }}</option>
        </select>
        <select class="mem-filter-select" v-model="filterRegion">
          <option value="">ყველა რეგიონი</option>
          <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
        </select>
        <button v-if="hasFilters" type="button" class="mem-clear-filters" @click="clearFilters">გასუფთავება</button>
      </div>

      <!-- Table -->
      <div class="mem-table-wrap">
        <table class="mem-table">
          <thead>
            <tr>
              <th class="mem-th-sortable" @click="toggleSort('dateTs')">
                თარიღი, დრო <span class="mem-sort-icon">{{ sortIcon('dateTs') }}</span>
              </th>
              <th class="mem-th-sortable" @click="toggleSort('employee')">
                თანამშრომელი <span class="mem-sort-icon">{{ sortIcon('employee') }}</span>
              </th>
              <th class="mem-th-sortable" @click="toggleSort('eventType')">
                ტიპი <span class="mem-sort-icon">{{ sortIcon('eventType') }}</span>
              </th>
              <th class="mem-th-sortable" @click="toggleSort('eventName')">
                ღონისძიება <span class="mem-sort-icon">{{ sortIcon('eventName') }}</span>
              </th>
              <th>ადგილი</th>
              <th class="mem-th-sortable" @click="toggleSort('attendees')">
                დამსწრე <span class="mem-sort-icon">{{ sortIcon('attendees') }}</span>
              </th>
              <th class="mem-th-sortable" @click="toggleSort('region')">
                რეგიონი <span class="mem-sort-icon">{{ sortIcon('region') }}</span>
              </th>
              <th>უკუკავშირი</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in paginatedReports" :key="r.id"
              class="mem-row"
              :class="{ 'mem-row-active': detailTarget?.id === r.id }"
              @click="detailTarget = detailTarget?.id === r.id ? null : r"
            >
              <td>
                <div class="rep-date-cell">
                  <span class="rep-date">{{ r.date }}</span>
                  <span class="rep-time">{{ r.time }}</span>
                </div>
              </td>
              <td class="mem-cell-person">
                <span class="mem-avatar" style="background:#e0f2fe;color:#0369a1;font-size:.68rem">{{ initials(r.employee) }}</span>
                <span style="font-size:.875rem">{{ r.employee }}</span>
              </td>
              <td>
                <span class="rep-type-badge" :class="`rep-type-${r.eventTypeKey}`">{{ r.eventType }}</span>
              </td>
              <td class="mem-cell-company" style="max-width:200px">{{ r.eventName }}</td>
              <td class="mem-cell-muted">{{ r.location }}</td>
              <td>
                <div class="rep-attendees">
                  <span class="rep-attendees-num">{{ r.attendees }}</span>
                  <div class="rep-attendees-bar">
                    <div class="rep-attendees-fill" :style="{ width: Math.min(r.attendees / maxAttendees * 100, 100) + '%' }"></div>
                  </div>
                </div>
              </td>
              <td class="mem-cell-muted">{{ r.region }}</td>
              <td>
                <button
                  v-if="r.hasFeedback"
                  type="button"
                  class="rep-feedback-btn"
                  @click.stop="downloadFeedback(r)"
                  title="უკუკავშირის ჩამოტვირთვა"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  PDF
                </button>
                <span v-else class="rep-no-feedback">—</span>
              </td>
            </tr>
            <tr v-if="filteredReports.length === 0">
              <td colspan="8" class="mem-empty">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span>ჩანაწერი ვერ მოიძებნა</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Detail expand row -->
      <transition name="slide-down">
        <div v-if="detailTarget" class="rep-detail-panel">
          <div class="rep-detail-head">
            <span class="rep-type-badge" :class="`rep-type-${detailTarget.eventTypeKey}`">{{ detailTarget.eventType }}</span>
            <strong>{{ detailTarget.eventName }}</strong>
            <span class="mem-cell-muted">{{ detailTarget.date }}, {{ detailTarget.time }}</span>
            <button type="button" class="mem-drawer-close" style="margin-left:auto" @click="detailTarget = null">✕</button>
          </div>
          <div class="rep-detail-grid">
            <div class="co-info-row"><span>თანამშრომელი</span><strong>{{ detailTarget.employee }}</strong></div>
            <div class="co-info-row"><span>ადგილი</span><strong>{{ detailTarget.location }}</strong></div>
            <div class="co-info-row"><span>რეგიონი</span><strong>{{ detailTarget.region }}</strong></div>
            <div class="co-info-row"><span>დამსწრეთა რაოდ.</span><strong>{{ detailTarget.attendees }}</strong></div>
            <div class="co-info-row"><span>ხანგრძლივობა</span><strong>{{ detailTarget.duration }}</strong></div>
            <div class="co-info-row"><span>სატარიფო კოდი</span><strong>{{ detailTarget.code }}</strong></div>
          </div>
          <p v-if="detailTarget.note" class="rep-detail-note">{{ detailTarget.note }}</p>
        </div>
      </transition>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="members-pagination">
        <button type="button" class="members-page-btn" :disabled="currentPage === 1" @click="currentPage--">‹</button>
        <button
          v-for="p in visiblePages" :key="p"
          type="button" class="members-page-btn"
          :class="{ active: p === currentPage, 'page-ellipsis': p === '…' }"
          :disabled="p === '…'"
          @click="p !== '…' && (currentPage = p)"
        >{{ p }}</button>
        <button type="button" class="members-page-btn" :disabled="currentPage === totalPages" @click="currentPage++">›</button>
      </div>

    </div>
    </div>
  </InnerPageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import InnerPageLayout from '../website/shared/InnerPageLayout.vue'

const PAGE_SIZE = 12

const searchQuery  = ref('')
const filterType   = ref('')
const filterRegion = ref('')
const activePeriod = ref('month')
const currentPage  = ref(1)
const detailTarget = ref(null)
const sortKey = ref('dateTs')
const sortDir = ref(-1)

const hasFilters = computed(() => searchQuery.value || filterType.value || filterRegion.value)
const clearFilters = () => { searchQuery.value = filterType.value = filterRegion.value = ''; currentPage.value = 1 }

const toggleSort = (key) => {
  if (sortKey.value === key) sortDir.value *= -1
  else { sortKey.value = key; sortDir.value = -1 }
  currentPage.value = 1
}
const sortIcon = (k) => sortKey.value !== k ? '↕' : sortDir.value === 1 ? '↑' : '↓'

const initials = (name) => name.split(' ').map(w => w.charAt(0)).join('').slice(0, 2)

const periods = [
  { key: 'week',    label: 'ამ კვირაში' },
  { key: 'month',   label: 'ამ თვეში' },
  { key: 'quarter', label: 'კვარტალი' },
  { key: 'all',     label: 'ყველა' },
]

const eventTypes = ['ტრენინგი', 'ვიზიტი', 'ვორქშოპი', 'კონსულტაცია', 'შეხვედრა', 'ვებინარი']
const regions    = ['თბილისი','იმერეთი','კახეთი','აჭარა','სამეგრელო','შიდა ქართლი','ქვემო ქართლი','გურია','სამცხე-ჯავახეთი']

const typeKeyMap = { 'ტრენინგი':'training', 'ვიზიტი':'visit', 'ვორქშოპი':'workshop', 'კონსულტაცია':'consulting', 'შეხვედრა':'meeting', 'ვებინარი':'webinar' }

const today = new Date()
const y = today.getFullYear()
const m = today.getMonth()

const d = (mo, day, hr = 10) => new Date(y, mo, day, hr)
const fmt = (dt) => `${dt.getDate()} ${['იან','თებ','მარ','აპრ','მაი','ივნ','ივლ','აგვ','სექ','ოქტ','ნოე','დეკ'][dt.getMonth()]}`
const fmtT = (dt) => `${String(dt.getHours()).padStart(2,'0')}:00`

const raw = [
  { id:1,  dt:d(m,4,11),  employee:'მარინე გელაშვილი',  eventType:'ტრენინგი',    eventName:'ბიზნეს გეგმის შედგენა',          location:'ონლაინ (Zoom)',          attendees:24, region:'იმერეთი',       hasFeedback:true,  duration:'4 სთ', code:'TRN-001', note:'მაღალი მონაწილეობა, კარგი შეფასება' },
  { id:2,  dt:d(m,4,14),  employee:'გიორგი ბერიძე',     eventType:'ვიზიტი',      eventName:'ვიზიტი — ასი პლუს შპს',          location:'ქუთაისი, ხვამლის ქ.',     attendees:3,  region:'იმერეთი',       hasFeedback:true,  duration:'1.5 სთ', code:'VIS-012', note:null },
  { id:3,  dt:d(m,7,10),  employee:'ნინო კვარაცხელია',  eventType:'ვორქშოპი',    eventName:'ციფრული მარკეტინგი',              location:'GrowthHub ქუთაისი',       attendees:18, region:'იმერეთი',       hasFeedback:true,  duration:'3 სთ', code:'WRK-005', note:null },
  { id:4,  dt:d(m,7,15),  employee:'დავით ელიავა',       eventType:'ვიზიტი',      eventName:'ვიზიტი — კახი ფარმი',             location:'თელავი',                  attendees:2,  region:'კახეთი',        hasFeedback:false, duration:'2 სთ', code:'VIS-013', note:'ახალი კომპანია, პირველი ვიზიტი' },
  { id:5,  dt:d(m,10,9),  employee:'ანა ჩხიკვაძე',      eventType:'კონსულტაცია', eventName:'ფინანსური კონსულტაცია',            location:'ბათუმი, ნინოშვილის ქ.',   attendees:4,  region:'აჭარა',         hasFeedback:true,  duration:'2 სთ', code:'CON-021', note:null },
  { id:6,  dt:d(m,10,11), employee:'ლაშა ნადირაძე',     eventType:'ტრენინგი',    eventName:'ფინანსური ანალიზის საფუძვლები',   location:'GrowthHub თბილისი',       attendees:31, region:'თბილისი',       hasFeedback:true,  duration:'6 სთ', code:'TRN-002', note:null },
  { id:7,  dt:d(m,14,10), employee:'მარინე გელაშვილი',  eventType:'შეხვედრა',    eventName:'კვარტალური მიმოხილვა',             location:'GrowthHub თბილისი',       attendees:12, region:'თბილისი',       hasFeedback:false, duration:'2 სთ', code:'MTG-008', note:'შიდა შეხვედრა' },
  { id:8,  dt:d(m,14,14), employee:'ნიკა ბეჟანიძე',     eventType:'ვიზიტი',      eventName:'ვიზიტი — ედუ ცენტრი',             location:'ქუთაისი',                 attendees:2,  region:'იმერეთი',       hasFeedback:true,  duration:'1 სთ', code:'VIS-014', note:null },
  { id:9,  dt:d(m,17,11), employee:'სოფო გოგოლაძე',     eventType:'ვებინარი',    eventName:'სოფლის მეურნეობის სუბსიდიები',    location:'ონლაინ',                  attendees:47, region:'კახეთი',        hasFeedback:true,  duration:'2 სთ', code:'WEB-003', note:'ყველაზე მაღალი attendance ამ თვეში' },
  { id:10, dt:d(m,18,9),  employee:'ბაკური ცხოვრებაძე', eventType:'ვიზიტი',      eventName:'ვიზიტი — ახალი ფუძე',             location:'თბილისი',                 attendees:3,  region:'თბილისი',       hasFeedback:false, duration:'1.5 სთ', code:'VIS-015', note:null },
  { id:11, dt:d(m,21,10), employee:'თამარი ნადირაძე',   eventType:'ტრენინგი',    eventName:'ციფრული მარკეტინგი II',            location:'ონლაინ (Zoom)',           attendees:29, region:'სამეგრელო',     hasFeedback:true,  duration:'4 სთ', code:'TRN-003', note:null },
  { id:12, dt:d(m,21,14), employee:'ანა ჩხიკვაძე',      eventType:'კონსულტაცია', eventName:'ბიზნეს-კონსულტაცია — ბიო ვენი',   location:'ბათუმი',                  attendees:3,  region:'აჭარა',         hasFeedback:true,  duration:'1.5 სთ', code:'CON-022', note:null },
  { id:13, dt:d(m,25,15), employee:'გიორგი ბერიძე',     eventType:'ვორქშოპი',    eventName:'ფინანსური ანალიზის სემინარი',      location:'თბილისი, რუსთაველი 52',   attendees:22, region:'თბილისი',       hasFeedback:true,  duration:'3 სთ', code:'WRK-006', note:null },
  { id:14, dt:d(m-1,15,10),employee:'ნინო კვარაცხელია', eventType:'ვიზიტი',      eventName:'ვიზიტი — სტილი ჯგ',               location:'ქუთაისი',                 attendees:2,  region:'იმერეთი',       hasFeedback:true,  duration:'1 სთ', code:'VIS-010', note:null },
  { id:15, dt:d(m-1,20,14),employee:'ლაშა ნადირაძე',    eventType:'ტრენინგი',    eventName:'ბიზნეს მოდელის გაანალიზება',       location:'GrowthHub ქუთაისი',       attendees:20, region:'იმერეთი',       hasFeedback:true,  duration:'5 სთ', code:'TRN-009', note:null },
  { id:16, dt:d(m-1,22,9), employee:'მარინე გელაშვილი', eventType:'ვებინარი',    eventName:'ექსპორტის შესაძლებლობები',          location:'ონლაინ',                  attendees:38, region:'შიდა ქართლი',  hasFeedback:true,  duration:'2 სთ', code:'WEB-002', note:null },
  { id:17, dt:d(m-2,5,11), employee:'სოფო გოგოლაძე',    eventType:'კონსულტაცია', eventName:'ბიზნეს-კონსულტაცია — ჰელსი მედი', location:'გორი',                    attendees:4,  region:'შიდა ქართლი',  hasFeedback:false, duration:'2 სთ', code:'CON-018', note:null },
  { id:18, dt:d(m-2,12,10),employee:'დავით ელიავა',      eventType:'ვორქშოპი',    eventName:'აგრო-ტექნოლოგია',                  location:'თელავი, ტრenინგ-ცენტრი', attendees:15, region:'კახეთი',        hasFeedback:true,  duration:'3 სთ', code:'WRK-004', note:null },
  { id:19, dt:d(m-2,18,14),employee:'ბაკური ცხოვრებაძე',eventType:'შეხვედრა',    eventName:'სამეგრელოს საოპერაციო მიმოხილვა',  location:'ზუგდიდი',                 attendees:8,  region:'სამეგრელო',     hasFeedback:false, duration:'2 სთ', code:'MTG-007', note:null },
  { id:20, dt:d(m-2,25,9), employee:'თამარი ნადირაძე',  eventType:'ტრენინგი',    eventName:'საბუღალტრო პროგრამები',             location:'ონლაინ (Zoom)',           attendees:26, region:'ქვემო ქართლი',  hasFeedback:true,  duration:'4 სთ', code:'TRN-008', note:null },
].map(r => ({
  ...r,
  dateTs:    r.dt.getTime(),
  date:      fmt(r.dt),
  time:      fmtT(r.dt),
  eventTypeKey: typeKeyMap[r.eventType] ?? 'meeting',
}))

const reports = ref(raw)

// period cutoff
const periodCutoff = computed(() => {
  const now = new Date()
  if (activePeriod.value === 'week') {
    const d = new Date(now); d.setDate(now.getDate() - 7); return d.getTime()
  }
  if (activePeriod.value === 'month') return new Date(y, m, 1).getTime()
  if (activePeriod.value === 'quarter') return new Date(y, m - 2, 1).getTime()
  return 0
})

const filteredReports = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  let list = reports.value.filter(r => {
    const inPeriod = activePeriod.value === 'all' || r.dateTs >= periodCutoff.value
    const matchQ = !q || r.eventName.toLowerCase().includes(q) || r.employee.toLowerCase().includes(q) || r.location.toLowerCase().includes(q)
    const matchT = !filterType.value   || r.eventType === filterType.value
    const matchR = !filterRegion.value || r.region    === filterRegion.value
    return inPeriod && matchQ && matchT && matchR
  })
  const k = sortKey.value
  return [...list].sort((a, b) => {
    const av = a[k] ?? '', bv = b[k] ?? ''
    if (typeof av === 'number') return (av - bv) * sortDir.value
    return String(av).localeCompare(String(bv), 'ka') * sortDir.value
  })
})

const totalAttendees  = computed(() => filteredReports.value.reduce((s, r) => s + r.attendees, 0))
const uniqueEmployees = computed(() => new Set(filteredReports.value.map(r => r.employee)).size)
const avgAttendees    = computed(() => filteredReports.value.length ? Math.round(totalAttendees.value / filteredReports.value.length) : 0)
const maxAttendees    = computed(() => Math.max(...filteredReports.value.map(r => r.attendees), 1))

// monthly chart (last 4 months)
const monthlyBars = computed(() => {
  const months = Array.from({ length: 4 }, (_, i) => {
    const mo = new Date(y, m - 3 + i, 1)
    return {
      month: ['იან','თებ','მარ','აპრ','მაი','ივნ','ივლ','აგვ','სექ','ოქტ','ნოე','დეკ'][mo.getMonth()],
      year:  mo.getFullYear(),
      mo:    mo.getMonth(),
    }
  })
  const counts = months.map(mo =>
    reports.value.filter(r => {
      const d = new Date(r.dateTs)
      return d.getFullYear() === mo.year && d.getMonth() === mo.mo
    }).length
  )
  const max = Math.max(...counts, 1)
  return months.map((mo, i) => ({ month: mo.month, count: counts[i], pct: (counts[i] / max) * 100 }))
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredReports.value.length / PAGE_SIZE)))
const paginatedReports = computed(() => {
  const s = (currentPage.value - 1) * PAGE_SIZE
  return filteredReports.value.slice(s, s + PAGE_SIZE)
})
const visiblePages = computed(() => {
  const t = totalPages.value, c = currentPage.value
  if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1)
  const pages = new Set([1, t, c - 1, c, c + 1].filter(p => p >= 1 && p <= t))
  const sorted = [...pages].sort((a, b) => a - b)
  const res = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) res.push('…')
    res.push(sorted[i])
  }
  return res
})

const downloadFeedback = (r) => {
  alert(`უკუკავშირის ჩამოტვირთვა: ${r.code}`)
}

const downloadCsv = () => {
  const hd = ['თარიღი','დრო','თანამშრომელი','ტიპი','ღონისძიება','ადგილი','დამსწრე','რეგიონი','კოდი']
  const rows = filteredReports.value.map(r =>
    [r.date, r.time, r.employee, r.eventType, r.eventName, r.location, r.attendees, r.region, r.code]
      .map(v => `"${v}"`).join(',')
  )
  const blob = new Blob(['\uFEFF' + [hd.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' })
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'reports.csv' })
  a.click()
}
</script>
