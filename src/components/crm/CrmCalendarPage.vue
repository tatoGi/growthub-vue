<template>
  <InnerPageLayout title="კალენდარი" breadcrumb="კალენდარი">
    <div class="container cal-page-body">

      <!-- Toolbar -->
      <div class="cal-toolbar">
        <div class="cal-nav">
          <button type="button" class="cal-nav-btn" @click="prevMonth">‹</button>
          <h2 class="cal-month-label">{{ monthLabel }}</h2>
          <button type="button" class="cal-nav-btn" @click="nextMonth">›</button>
        </div>

        <div class="cal-toolbar-center">
          <button type="button" class="cal-today-btn" @click="goToday">დღეს</button>
        </div>

        <div class="cal-view-tabs">
          <button
            v-for="v in views"
            :key="v.key"
            type="button"
            class="cal-view-tab"
            :class="{ active: activeView === v.key }"
            @click="activeView = v.key"
          >{{ v.label }}</button>
        </div>
      </div>

      <!-- Legend -->
      <div class="cal-legend">
        <span v-for="cat in categories" :key="cat.key" class="cal-legend-item">
          <span class="cal-legend-dot" :style="{ background: cat.color }"></span>
          {{ cat.label }}
        </span>
      </div>

      <!-- Month View -->
      <div v-if="activeView === 'month'" class="cal-month">
        <div class="cal-weekdays">
          <div v-for="d in weekdays" :key="d" class="cal-weekday">{{ d }}</div>
        </div>
        <div class="cal-grid">
          <div
            v-for="cell in monthCells"
            :key="cell.key"
            class="cal-cell"
            :class="{
              'other-month': !cell.currentMonth,
              'is-today': cell.isToday,
              'has-events': cell.events.length > 0
            }"
          >
            <span class="cal-day-num">{{ cell.day }}</span>
            <div class="cal-cell-events">
              <button
                v-for="ev in cell.events.slice(0, 2)"
                :key="ev.id"
                type="button"
                class="cal-event-chip"
                :style="{ background: categoryColor(ev.category) }"
                @click.stop="openEvent(ev)"
              >{{ ev.title }}</button>
              <span v-if="cell.events.length > 2" class="cal-more-chip" @click.stop="openDayEvents(cell)">
                +{{ cell.events.length - 2 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Week View -->
      <div v-else-if="activeView === 'week'" class="cal-week">
        <div class="cal-week-header">
          <div class="cal-week-time-col"></div>
          <div
            v-for="day in weekDays"
            :key="day.key"
            class="cal-week-day-head"
            :class="{ 'is-today': day.isToday }"
          >
            <span class="cal-week-dayname">{{ day.dayName }}</span>
            <span class="cal-week-daynum">{{ day.dayNum }}</span>
          </div>
        </div>
        <div class="cal-week-body">
          <div v-for="hour in workHours" :key="hour" class="cal-week-row">
            <div class="cal-week-time">{{ hour }}:00</div>
            <div
              v-for="day in weekDays"
              :key="day.key"
              class="cal-week-slot"
            >
              <button
                v-for="ev in eventsAtHour(day.date, hour)"
                :key="ev.id"
                type="button"
                class="cal-week-event"
                :style="{ background: categoryColor(ev.category) }"
                @click="openEvent(ev)"
              >{{ ev.title }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Day View -->
      <div v-else-if="activeView === 'day'" class="cal-day-view">
        <div class="cal-day-header">
          <button type="button" class="cal-nav-btn" @click="prevDay">‹</button>
          <h3 class="cal-day-title">{{ dayViewLabel }}</h3>
          <button type="button" class="cal-nav-btn" @click="nextDay">›</button>
        </div>
        <div class="cal-day-body">
          <div v-for="hour in workHours" :key="hour" class="cal-day-row">
            <span class="cal-day-time">{{ hour }}:00</span>
            <div class="cal-day-slot">
              <button
                v-for="ev in eventsAtHour(selectedDay, hour)"
                :key="ev.id"
                type="button"
                class="cal-day-event"
                :style="{ borderLeftColor: categoryColor(ev.category) }"
                @click="openEvent(ev)"
              >
                <strong>{{ ev.title }}</strong>
                <span>{{ ev.timeLabel }} · {{ ev.location }}</span>
              </button>
            </div>
          </div>
          <div v-if="dayEvents(selectedDay).length === 0" class="cal-day-empty">
            <span>ამ დღეს ჩანაწერი არ არის</span>
          </div>
        </div>
      </div>

      <!-- Event detail modal -->
      <div v-if="activeEvent" class="cal-modal-root" @click.self="activeEvent = null">
        <div class="cal-modal">
          <button type="button" class="cal-modal-close" @click="activeEvent = null">✕</button>
          <div class="cal-modal-tag" :style="{ background: categoryColor(activeEvent.category) }">
            {{ categoryLabel(activeEvent.category) }}
          </div>
          <h2 class="cal-modal-title">{{ activeEvent.title }}</h2>
          <div class="cal-modal-meta">
            <div class="cal-modal-row">
              <span class="cal-modal-icon">📅</span>
              <span>{{ activeEvent.dateLabel }}</span>
            </div>
            <div class="cal-modal-row">
              <span class="cal-modal-icon">🕐</span>
              <span>{{ activeEvent.timeLabel }}</span>
            </div>
            <div v-if="activeEvent.location" class="cal-modal-row">
              <span class="cal-modal-icon">📍</span>
              <span>{{ activeEvent.location }}</span>
            </div>
            <div v-if="activeEvent.person" class="cal-modal-row">
              <span class="cal-modal-icon">👤</span>
              <span>{{ activeEvent.person }}</span>
            </div>
          </div>
          <p v-if="activeEvent.note" class="cal-modal-note">{{ activeEvent.note }}</p>
          <div class="cal-modal-actions">
            <button type="button" class="crm-btn-primary" @click="activeEvent = null">დახურვა</button>
          </div>
        </div>
      </div>

    </div>
  </InnerPageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import InnerPageLayout from '../website/shared/InnerPageLayout.vue'

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth()) // 0-based
const selectedDay = ref(new Date(today.getFullYear(), today.getMonth(), today.getDate()))
const activeView = ref('month')
const activeEvent = ref(null)

const views = [
  { key: 'month', label: 'თვე' },
  { key: 'week',  label: 'კვირა' },
  { key: 'day',   label: 'დღე' },
]

const weekdays = ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვი']

const GEO_MONTHS = ['იანვარი','თებერვალი','მარტი','აპრილი','მაისი','ივნისი','ივლისი','აგვისტო','სექტემბერი','ოქტომბერი','ნოემბერი','დეკემბერი']
const GEO_DAYS   = ['ორშ','სამ','ოთხ','ხუთ','პარ','შაბ','კვი']

const categories = [
  { key: 'visit',    label: 'ვიზიტი',        color: '#10b981' },
  { key: 'training', label: 'ტრენინგი',       color: '#6366f1' },
  { key: 'event',    label: 'ღონისძიება',     color: '#f59e0b' },
  { key: 'deadline', label: 'ვადა',           color: '#ef4444' },
  { key: 'meeting',  label: 'შეხვედრა',       color: '#0ea5e9' },
]

const categoryColor = (key) => categories.find(c => c.key === key)?.color ?? '#94a3b8'
const categoryLabel = (key) => categories.find(c => c.key === key)?.label ?? key

// Mock events – dates relative to current month (March 2026)
const y = today.getFullYear()
const m = today.getMonth()

const events = ref([
  { id: 1,  date: new Date(y, m, 4),  hour: 11, title: 'ვიზიტი ქუთაისის ცენტრში',        category: 'visit',    timeLabel: '11:00 – 12:00', dateLabel: `4 ${GEO_MONTHS[m]}`,  location: 'ქუთაისი, ხვამლის ქ. №5', person: 'მარინე გელაშვილი', note: 'მოიტანეთ კომპანიის ამონაწერი.' },
  { id: 2,  date: new Date(y, m, 7),  hour: 10, title: 'ტრენინგი — ბიზნეს გეგმა',         category: 'training', timeLabel: '10:00 – 14:00', dateLabel: `7 ${GEO_MONTHS[m]}`,  location: 'ონლაინ (Zoom)', person: null, note: 'ლინკი გამოგეგზავნებათ ღონისძიებამდე.' },
  { id: 3,  date: new Date(y, m, 10), hour: 14, title: 'თხილის სექტორის შეხვედრა',        category: 'event',    timeLabel: '14:00 – 16:00', dateLabel: `10 ${GEO_MONTHS[m]}`, location: 'GrowthHub ქუთაისი', person: null, note: null },
  { id: 4,  date: new Date(y, m, 14), hour: 9,  title: 'საკონსულტაციო სესია',              category: 'meeting',  timeLabel: '09:00 – 10:00', dateLabel: `14 ${GEO_MONTHS[m]}`, location: 'ონლაინ', person: 'ლაშა კვარაცხელია', note: null },
  { id: 5,  date: new Date(y, m, 14), hour: 15, title: 'დოკუმენტების ვადა',                category: 'deadline', timeLabel: '15:00',          dateLabel: `14 ${GEO_MONTHS[m]}`, location: null, person: null, note: 'კრიტერიუმების დოკუმენტების ატვირთვის ბოლო ვადა.' },
  { id: 6,  date: new Date(y, m, 18), hour: 11, title: 'ვიზიტი — ბათუმის ცენტრი',         category: 'visit',    timeLabel: '11:00 – 12:30', dateLabel: `18 ${GEO_MONTHS[m]}`, location: 'ბათუმი, ჩაქვის ქ. №3', person: 'ნინო ბერიძე', note: null },
  { id: 7,  date: new Date(y, m, 21), hour: 10, title: 'ტრენინგი — ციფრული მარკეტინგი',   category: 'training', timeLabel: '10:00 – 13:00', dateLabel: `21 ${GEO_MONTHS[m]}`, location: 'ონლაინ (Zoom)', person: null, note: null },
  { id: 8,  date: new Date(y, m, 25), hour: 16, title: 'ფინანსური ანალიზის სემინარი',      category: 'event',    timeLabel: '16:00 – 18:00', dateLabel: `25 ${GEO_MONTHS[m]}`, location: 'თბილისი, რუსთაველი №52', person: null, note: null },
  { id: 9,  date: new Date(y, m+1, 2),hour: 10, title: 'ვიზიტი — თბილისის ცენტრი',        category: 'visit',    timeLabel: '10:00 – 11:00', dateLabel: `2 ${GEO_MONTHS[m+1]}`, location: 'თბილისი', person: 'გიორგი ელიავა', note: null },
])

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const dayEvents = (date) => events.value.filter(e => sameDay(e.date, date))
const eventsAtHour = (date, hour) => events.value.filter(e => sameDay(e.date, date) && e.hour === hour)

// ---- Month view ----
const monthLabel = computed(() => `${GEO_MONTHS[currentMonth.value]} ${currentYear.value}`)

const monthCells = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1)
  // Monday-first: Sunday=6, Mon=0 ...
  let startDow = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev  = new Date(year, month, 0).getDate()
  const cells = []

  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, daysInPrev - i)
    cells.push({ key: `p${i}`, day: daysInPrev - i, date: d, currentMonth: false, isToday: false, events: dayEvents(d) })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    cells.push({ key: `c${d}`, day: d, date, currentMonth: true, isToday: sameDay(date, today), events: dayEvents(date) })
  }
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    const date = new Date(year, month + 1, d)
    cells.push({ key: `n${d}`, day: d, date, currentMonth: false, isToday: false, events: dayEvents(date) })
  }
  return cells
})

const prevMonth = () => {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
  else currentMonth.value--
}
const nextMonth = () => {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
  else currentMonth.value++
}
const goToday = () => {
  currentMonth.value = today.getMonth()
  currentYear.value  = today.getFullYear()
  selectedDay.value  = new Date(today.getFullYear(), today.getMonth(), today.getDate())
}

// ---- Week view ----
const workHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

const weekDays = computed(() => {
  const ref = activeView.value === 'day' ? selectedDay.value : today
  const dow = ref.getDay() === 0 ? 6 : ref.getDay() - 1
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(ref)
    d.setDate(ref.getDate() - dow + i)
    return {
      key: d.toISOString(),
      date: d,
      dayName: GEO_DAYS[i],
      dayNum: d.getDate(),
      isToday: sameDay(d, today),
    }
  })
})

// ---- Day view ----
const dayViewLabel = computed(() => {
  const d = selectedDay.value
  return `${d.getDate()} ${GEO_MONTHS[d.getMonth()]} ${d.getFullYear()}`
})
const prevDay = () => { const d = new Date(selectedDay.value); d.setDate(d.getDate() - 1); selectedDay.value = d }
const nextDay = () => { const d = new Date(selectedDay.value); d.setDate(d.getDate() + 1); selectedDay.value = d }

// ---- Event modal ----
const openEvent = (ev) => { activeEvent.value = ev }
const openDayEvents = (cell) => {
  selectedDay.value = cell.date
  activeView.value = 'day'
}
</script>
