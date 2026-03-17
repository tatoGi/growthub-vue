<template>
  <InnerPageLayout title="ბიზნეს-დიაგნოსტიკა" breadcrumb="ბიზნეს-დიაგნოსტიკა">
    <div class="container diag-page-body">

      <!-- ===== USER VIEW ===== -->
      <template v-if="role === 'user'">

        <!-- No diagnostic yet -->
        <template v-if="!userDiag.completed">
          <div class="diag-intro-card">
            <div class="diag-intro-text">
              <h2>რა არის ბიზნეს-დიაგნოსტიკა?</h2>
              <p>ბიზნეს-დიაგნოსტიკის გავლით შეგიძლიათ გაიგოთ, რა საჭიროების წინაშე დგას თქვენი ბიზნესი, რა არის არსებული გამოწვევები და რისი გადაჭრაც დაეხმარება თქვენს ბიზნესს იყოს უფრო მომგებიანი.</p>
              <p>კითხვარის გავლის შემდგომ, შემოგთავაზებთ კონკრეტულად თქვენს ბიზნეს საჭიროებებზე მორგებულ სერვისებს: გაყიდვები და მარკეტინგი, საგადასახადო, იურიდიული, ფინანსები, ბიზნეს მოდელირება, დიგიტალიზაცია.</p>
            </div>
            <div class="diag-intro-steps">
              <div v-for="(step, i) in startSteps" :key="i" class="diag-step">
                <span class="diag-step-num">{{ i + 1 }}</span>
                <div>
                  <strong>{{ step.title }}</strong>
                  <span>{{ step.desc }}</span>
                </div>
              </div>
            </div>
            <div class="diag-intro-actions">
              <a href="#crm/user/plan-visit" class="crm-btn-primary">ვიზიტის დაჯავშნა</a>
              <a href="#" class="crm-btn-outline">კითხვარის ნიმუში</a>
            </div>
          </div>
        </template>

        <!-- Diagnostic completed — results -->
        <template v-else>
          <!-- Overview strip -->
          <div class="diag-overview-strip">
            <div class="diag-score-main">
              <div class="diag-score-ring">
                <svg viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#f1f5f9" stroke-width="8"/>
                  <circle cx="40" cy="40" r="34" fill="none" :stroke="scoreColor(userDiag.overallScore)"
                    stroke-width="8" stroke-linecap="round"
                    :stroke-dasharray="`${userDiag.overallScore * 2.136} 213.6`"
                    transform="rotate(-90 40 40)"/>
                </svg>
                <span class="diag-score-num">{{ userDiag.overallScore }}</span>
              </div>
              <div class="diag-score-info">
                <span class="diag-score-eyebrow">საერთო ქულა</span>
                <strong class="diag-score-label" :style="{ color: scoreColor(userDiag.overallScore) }">{{ scoreLabel(userDiag.overallScore) }}</strong>
                <span class="diag-score-date">შეფასების თარიღი: {{ userDiag.date }}</span>
              </div>
            </div>
            <div class="diag-overview-meta">
              <div v-for="m in userDiag.meta" :key="m.label" class="diag-meta-item">
                <span>{{ m.label }}</span>
                <strong>{{ m.value }}</strong>
              </div>
            </div>
          </div>

          <!-- Category scores -->
          <div class="diag-categories">
            <h3 class="diag-section-title">კატეგორიების შეფასება</h3>
            <div class="diag-cat-grid">
              <div v-for="cat in userDiag.categories" :key="cat.key" class="diag-cat-card">
                <div class="diag-cat-head">
                  <span class="diag-cat-name">{{ cat.name }}</span>
                  <span class="diag-cat-score" :style="{ color: scoreColor(cat.score) }">{{ cat.score }}/100</span>
                </div>
                <div class="diag-bar-track">
                  <div class="diag-bar-fill" :style="{ width: cat.score + '%', background: scoreColor(cat.score) }"></div>
                </div>
                <p class="diag-cat-note">{{ cat.note }}</p>
              </div>
            </div>
          </div>

          <!-- Recommendations -->
          <div class="diag-recommendations">
            <h3 class="diag-section-title">რეკომენდებული სერვისები</h3>
            <div class="diag-rec-grid">
              <div v-for="rec in userDiag.recommendations" :key="rec.title" class="diag-rec-card">
                <div class="diag-rec-priority" :class="rec.priority">{{ rec.priorityLabel }}</div>
                <strong>{{ rec.title }}</strong>
                <p>{{ rec.desc }}</p>
                <a href="#crm/user/plan-visit" class="diag-rec-link">კონსულტაციის დაჯავშნა →</a>
              </div>
            </div>
          </div>

          <div class="diag-user-actions">
            <button type="button" class="crm-btn-primary">ანგარიშის ჩამოტვირთვა (PDF)</button>
            <a href="#crm/user/plan-visit" class="crm-btn-outline">კონსულტაციის დაჯავშნა</a>
          </div>
        </template>

      </template>

      <!-- ===== CENTRAL / REGIONAL VIEW ===== -->
      <template v-else>

        <!-- Search bar -->
        <div class="diag-search-bar">
          <div class="crm-field" style="flex:1; min-width: 200px">
            <label>საიდენტიფიკაციო / პირადი ნომერი</label>
            <input type="text" v-model="searchId" placeholder="ს/კ ან პირადი ნომერი" />
          </div>
          <div class="crm-field" style="min-width: 180px">
            <label>რეგიონი</label>
            <select v-model="searchRegion">
              <option value="">ყველა რეგიონი</option>
              <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>
          <div class="crm-field" style="min-width: 160px">
            <label>სტატუსი</label>
            <select v-model="searchStatus">
              <option value="">ყველა</option>
              <option value="completed">დასრულებული</option>
              <option value="in_progress">მიმდინარე</option>
              <option value="pending">მოლოდინში</option>
            </select>
          </div>
          <div class="diag-search-btn-wrap">
            <button type="button" class="crm-btn-primary" @click="doSearch">ძიება</button>
            <button type="button" class="crm-btn-ghost" @click="resetSearch">გასუფთავება</button>
          </div>
        </div>

        <!-- Results table -->
        <div class="diag-table-block">
          <div class="diag-table-head">
            <span class="diag-table-count">{{ filteredEntries.length }} ჩანაწერი</span>
            <div class="diag-table-actions">
              <button type="button" class="crm-btn-outline" @click="showAddModal = true">+ დიაგნოსტიკის დამატება</button>
              <button type="button" class="crm-btn-ghost">გადმოწერა (Excel)</button>
            </div>
          </div>

          <div v-if="filteredEntries.length === 0" class="crm-empty-state">
            <span>ჩანაწერი ვერ მოიძებნა</span>
          </div>

          <table v-else class="crm-table diag-table">
            <thead>
              <tr>
                <th>იურიდიული პირი</th>
                <th>საიდ. კოდი</th>
                <th>რეგიონი</th>
                <th>დაწყება</th>
                <th>დასრულება</th>
                <th>ქულა</th>
                <th>სტატუსი</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entry in filteredEntries" :key="entry.id">
                <td class="diag-company-cell">
                  <strong>{{ entry.company }}</strong>
                </td>
                <td class="mono">{{ entry.idCode }}</td>
                <td>{{ entry.region }}</td>
                <td>{{ entry.startDate }}</td>
                <td>{{ entry.endDate || '—' }}</td>
                <td>
                  <span v-if="entry.score" class="diag-score-badge" :style="{ color: scoreColor(entry.score), background: scoreBg(entry.score) }">
                    {{ entry.score }}
                  </span>
                  <span v-else class="diag-score-badge pending">—</span>
                </td>
                <td>
                  <span class="diag-status-tag" :class="entry.status">{{ statusLabel(entry.status) }}</span>
                </td>
                <td>
                  <div class="diag-row-actions">
                    <button type="button" class="crm-btn-outline diag-action-btn" @click="viewEntry(entry)">ნახვა</button>
                    <button type="button" class="crm-btn-ghost diag-action-btn">PDF</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Entry detail panel -->
        <div v-if="activeEntry" class="diag-detail-panel">
          <div class="diag-detail-header">
            <h3>{{ activeEntry.company }}</h3>
            <button type="button" class="crm-btn-ghost" @click="activeEntry = null">დახურვა ✕</button>
          </div>
          <div class="diag-cat-grid">
            <div v-for="cat in activeEntry.categories" :key="cat.key" class="diag-cat-card">
              <div class="diag-cat-head">
                <span class="diag-cat-name">{{ cat.name }}</span>
                <span class="diag-cat-score" :style="{ color: scoreColor(cat.score) }">{{ cat.score }}/100</span>
              </div>
              <div class="diag-bar-track">
                <div class="diag-bar-fill" :style="{ width: cat.score + '%', background: scoreColor(cat.score) }"></div>
              </div>
            </div>
          </div>
        </div>

      </template>

    </div>
  </InnerPageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import InnerPageLayout from '../website/shared/InnerPageLayout.vue'
import { useAuth } from '../../composables/useAuth'

const { auth } = useAuth()
const role = computed(() => auth.user?.role ?? 'user')

/* ---- helpers ---- */
const scoreColor = (s) => s >= 70 ? '#10b981' : s >= 45 ? '#f59e0b' : '#ef4444'
const scoreBg    = (s) => s >= 70 ? '#f0fdf4' : s >= 45 ? '#fffbeb' : '#fef2f2'
const scoreLabel = (s) => s >= 70 ? 'კარგი' : s >= 45 ? 'საშუალო' : 'საჭიროებს გაუმჯობესებას'
const statusLabel = (s) => ({ completed: 'დასრულებული', in_progress: 'მიმდინარე', pending: 'მოლოდინში' })[s] ?? s

/* ---- USER data ---- */
const userDiag = {
  completed: true,
  overallScore: 68,
  date: '10 მარტი 2026',
  meta: [
    { label: 'შეფასებული კატეგორია', value: '6' },
    { label: 'კონსულტანტი', value: 'ლაშა კვარაცხელია' },
    { label: 'ღია რეკომენდაცია', value: '3' },
  ],
  categories: [
    { key: 'finance',    name: 'ფინანსები და ბუღალტერია',       score: 72, note: 'ფინანსური ჩანაწერები სრულია, ბიუჯეტირება საჭიროებს გაუმჯობესებას.' },
    { key: 'sales',      name: 'გაყიდვები და მარკეტინგი',        score: 58, note: 'ციფრული მარკეტინგი სუსტია, გაყიდვების სისტემა — საშუალო.' },
    { key: 'digital',    name: 'დიგიტალიზაცია',                  score: 41, note: 'ციფრული ინსტრუმენტები მინიმალურად გამოიყენება.' },
    { key: 'legal',      name: 'იურიდიული და საგადასახადო',       score: 79, note: 'დოკუმენტაცია სრულია, კომპლაიანსი — კარგ მდგომარეობაში.' },
    { key: 'hr',         name: 'ადამიანური რესურსები',            score: 63, note: 'გუნდის სტრუქტურა არსებობს, HR პოლიტიკა — ჩამოყალიბების პროცესში.' },
    { key: 'strategy',   name: 'ბიზნეს მოდელი და სტრატეგია',     score: 55, note: 'ბიზნეს-გეგმა შედგენილია, სტრატეგიული მიზნები — განსაზღვრის პროცესში.' },
  ],
  recommendations: [
    { title: 'ციფრული ტრანსფორმაციის კონსულტაცია', desc: 'ონლაინ ყოფნისა და ავტომატიზაციის გაძლიერება', priority: 'high', priorityLabel: 'მაღალი პრიორიტეტი' },
    { title: 'მარკეტინგის სერია — 3 სესია', desc: 'ციფრული არხები, სოც. ქსელი, e-commerce', priority: 'high', priorityLabel: 'მაღალი პრიორიტეტი' },
    { title: 'ბიზნეს-გეგმის დახვეწა', desc: 'სტრატეგიული მიზნების ფორმალიზება', priority: 'medium', priorityLabel: 'საშუალო პრიორიტეტი' },
  ],
}

const startSteps = [
  { title: 'კრიტერიუმების დადასტურება', desc: 'ატვირთეთ კრიტერიუმების დამადასტურებელი დოკუმენტები „კრიტერიუმები" ჩანართში.' },
  { title: 'ვიზიტის დაჯავშნა', desc: 'დაჯავშნეთ ვიზიტი თქვენი რეგიონის საკონსულტაციო ცენტრში.' },
  { title: 'კითხვარის შევსება ცენტრში', desc: 'ცენტრის სპეციალისტი დაგეხმარებათ კითხვარის სრულყოფილად შევსებაში.' },
]

/* ---- CENTRAL data ---- */
const regions = ['თბილისი', 'აჭარა', 'გურია', 'იმერეთი', 'კახეთი', 'მცხეთა-მთიანეთი', 'სამეგრელო', 'სამცხე-ჯავახეთი', 'ქვემო ქართლი', 'შიდა ქართლი']

const sharedCats = [
  { key: 'finance', name: 'ფინანსები', score: 0 },
  { key: 'sales', name: 'გაყიდვები', score: 0 },
  { key: 'digital', name: 'დიგიტალიზაცია', score: 0 },
  { key: 'legal', name: 'იურიდიული', score: 0 },
  { key: 'hr', name: 'HR', score: 0 },
  { key: 'strategy', name: 'სტრატეგია', score: 0 },
]

const entries = ref([
  { id: 1, company: 'შპს ჭამასმა', idCode: '205123456', region: 'იმერეთი', startDate: '21.11.2022', endDate: '04.12.2022', score: 74, status: 'completed', categories: sharedCats.map(c => ({ ...c, score: [74, 62, 55, 80, 71, 66][sharedCats.indexOf(c)] })) },
  { id: 2, company: 'ინდ. მ. გოგიაშვილი', idCode: '01012345678', region: 'კახეთი', startDate: '15.01.2023', endDate: '28.01.2023', score: 51, status: 'completed', categories: sharedCats.map(c => ({ ...c, score: [51, 48, 38, 60, 55, 44][sharedCats.indexOf(c)] })) },
  { id: 3, company: 'შპს სოფლის სიკეთე', idCode: '405987654', region: 'სამეგრელო', startDate: '03.03.2026', endDate: null, score: null, status: 'in_progress', categories: [] },
  { id: 4, company: 'შპს ინოვაცია+', idCode: '204567890', region: 'თბილისი', startDate: '10.03.2026', endDate: null, score: null, status: 'pending', categories: [] },
  { id: 5, company: 'შპს აჭარის ჩაი', idCode: '405112233', region: 'აჭარა', startDate: '01.02.2026', endDate: '14.02.2026', score: 83, status: 'completed', categories: sharedCats.map(c => ({ ...c, score: [83, 78, 70, 88, 76, 82][sharedCats.indexOf(c)] })) },
  { id: 6, company: 'ინდ. მ. ქობულაძე', idCode: '60198765', region: 'გურია', startDate: '20.02.2026', endDate: null, score: null, status: 'in_progress', categories: [] },
])

const searchId     = ref('')
const searchRegion = ref('')
const searchStatus = ref('')
const activeEntry  = ref(null)
const showAddModal = ref(false)

const filteredEntries = computed(() => entries.value.filter(e => {
  if (searchId.value && !e.idCode.includes(searchId.value) && !e.company.toLowerCase().includes(searchId.value.toLowerCase())) return false
  if (searchRegion.value && e.region !== searchRegion.value) return false
  if (searchStatus.value && e.status !== searchStatus.value) return false
  return true
}))

const doSearch = () => {}
const resetSearch = () => { searchId.value = ''; searchRegion.value = ''; searchStatus.value = '' }
const viewEntry = (entry) => { activeEntry.value = entry }
</script>
