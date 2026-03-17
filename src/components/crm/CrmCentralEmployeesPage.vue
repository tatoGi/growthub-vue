<template>
  <InnerPageLayout title="თანამშრომლები" breadcrumb="თანამშრომლები">
    <div class="mem-page-bg">
    <div class="container mem-body">

      <!-- Stats bar -->
      <div class="mem-stats-bar">
        <div class="mem-stat">
          <strong>{{ employees.length }}</strong>
          <span>სულ</span>
        </div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat">
          <strong>{{ activeCount }}</strong>
          <span>აქტიური</span>
        </div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat">
          <strong>{{ centralCount }}</strong>
          <span>ცენტრალური</span>
        </div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat">
          <strong>{{ regionalCount }}</strong>
          <span>რეგიონული</span>
        </div>
        <div class="mem-stats-actions" style="display:flex;gap:.6rem">
          <button type="button" class="crm-btn-primary emp-add-btn" @click="openAdd">
            + თანამშრომლის დამატება
          </button>
          <button type="button" class="members-download-btn" @click="downloadCsv" title="ჩამოტვირთვა">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            CSV
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="mem-filters">
        <div class="mem-search-wrap">
          <svg class="mem-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" class="mem-search-input" v-model="searchQuery" placeholder="სახელი, გვარი, ელ. ფოსტა..." />
          <button v-if="searchQuery" type="button" class="mem-search-clear" @click="searchQuery = ''">✕</button>
        </div>
        <select class="mem-filter-select" v-model="filterRole">
          <option value="">ყველა როლი</option>
          <option value="central">ცენტრალური</option>
          <option value="regional">რეგიონული</option>
          <option value="consulting">საკონსულტაციო</option>
          <option value="training">ტრენინგი</option>
          <option value="bank">ბანკი</option>
        </select>
        <select class="mem-filter-select" v-model="filterRegion">
          <option value="">ყველა რეგიონი</option>
          <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
        </select>
        <select class="mem-filter-select" v-model="filterStatus" style="flex:0 1 130px">
          <option value="">ყველა სტატუსი</option>
          <option value="active">აქტიური</option>
          <option value="inactive">არააქტიური</option>
        </select>
        <button v-if="hasFilters" type="button" class="mem-clear-filters" @click="clearFilters">გასუფთავება</button>
      </div>

      <!-- Table -->
      <div class="mem-table-wrap">
        <table class="mem-table">
          <thead>
            <tr>
              <th class="mem-th-sortable" @click="toggleSort('lastName')">
                თანამშრომელი <span class="mem-sort-icon">{{ sortIcon('lastName') }}</span>
              </th>
              <th>ელ. ფოსტა</th>
              <th>ტელეფონი</th>
              <th class="mem-th-sortable" @click="toggleSort('position')">
                პოზიცია <span class="mem-sort-icon">{{ sortIcon('position') }}</span>
              </th>
              <th class="mem-th-sortable" @click="toggleSort('role')">
                როლი <span class="mem-sort-icon">{{ sortIcon('role') }}</span>
              </th>
              <th class="mem-th-sortable" @click="toggleSort('region')">
                რეგიონი <span class="mem-sort-icon">{{ sortIcon('region') }}</span>
              </th>
              <th>სტატუსი</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="e in paginatedEmployees"
              :key="e.id"
              class="mem-row"
              :class="{ 'mem-row-active': drawerTarget?.id === e.id }"
              @click="openEdit(e)"
            >
              <td class="mem-cell-person">
                <span class="mem-avatar" :class="`mem-avatar-${e.role}`">{{ e.firstName.charAt(0) }}{{ e.lastName.charAt(0) }}</span>
                <div>
                  <div class="emp-name">{{ e.firstName }} {{ e.lastName }}</div>
                </div>
              </td>
              <td class="mem-cell-muted">{{ e.email }}</td>
              <td class="mem-cell-muted">+995 {{ e.phone }}</td>
              <td class="mem-cell-muted">{{ e.position }}</td>
              <td>
                <span class="mem-role-badge" :class="`mem-role-${e.role}`">{{ roleLabel(e.role) }}</span>
              </td>
              <td class="mem-cell-muted">{{ e.region }}</td>
              <td>
                <span class="emp-status-badge" :class="e.status === 'active' ? 'emp-status-active' : 'emp-status-inactive'">
                  {{ e.status === 'active' ? 'აქტიური' : 'გათიშული' }}
                </span>
              </td>
              <td class="mem-cell-arrow">›</td>
            </tr>
            <tr v-if="filteredEmployees.length === 0">
              <td colspan="8" class="mem-empty">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <span>თანამშრომელი ვერ მოიძებნა</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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
    </div><!-- /mem-page-bg -->

    <!-- Drawer (edit & add) -->
    <transition name="drawer">
      <div v-if="drawerOpen" class="mem-drawer-root" @click.self="closeDrawer">
        <div class="mem-drawer">

          <div class="mem-drawer-head">
            <div v-if="drawerTarget" class="mem-drawer-avatar" :class="`mem-avatar-${drawerTarget.role}`">
              {{ drawerTarget.firstName.charAt(0) }}{{ drawerTarget.lastName.charAt(0) }}
            </div>
            <div v-else class="mem-drawer-avatar mem-avatar-central">+</div>
            <div>
              <div class="mem-drawer-name">
                {{ drawerTarget ? `${drawerTarget.firstName} ${drawerTarget.lastName}` : 'ახალი თანამშრომელი' }}
              </div>
              <div class="mem-drawer-sub">
                {{ drawerTarget ? drawerTarget.position : 'შეავსეთ ინფორმაცია' }}
              </div>
            </div>
            <button type="button" class="mem-drawer-close" @click="closeDrawer">✕</button>
          </div>

          <div class="mem-drawer-body">
            <div class="mem-drawer-section-title">პირადი ინფორმაცია</div>
            <div class="crm-form-grid">
              <div class="crm-field">
                <label>სახელი</label>
                <input type="text" v-model="form.firstName" />
              </div>
              <div class="crm-field">
                <label>გვარი</label>
                <input type="text" v-model="form.lastName" />
              </div>
              <div class="crm-field">
                <label>ელ. ფოსტა</label>
                <input type="email" v-model="form.email" />
              </div>
              <div class="crm-field">
                <label>ტელეფონი</label>
                <div class="crm-input-prefix">
                  <span>+995</span>
                  <input type="tel" v-model="form.phone" />
                </div>
              </div>
              <div class="crm-field">
                <label>პირადი ნომერი</label>
                <input type="text" v-model="form.personalId" placeholder="11 ნიშნა კოდი" />
              </div>
              <div class="crm-field">
                <label>პოზიცია</label>
                <input type="text" v-model="form.position" placeholder="მაგ. კოორდინატორი" />
              </div>
            </div>

            <div class="mem-drawer-section-title" style="margin-top:1.5rem">სისტემური მონაცემები</div>
            <div class="crm-form-grid">
              <div class="crm-field">
                <label>როლი</label>
                <select v-model="form.role">
                  <option value="">— აირჩიეთ —</option>
                  <option value="central">ცენტრალური</option>
                  <option value="regional">რეგიონული</option>
                  <option value="consulting">საკონსულტაციო</option>
                  <option value="training">ტრენინგი</option>
                  <option value="bank">ბანკი</option>
                </select>
              </div>
              <div class="crm-field">
                <label>ბანკი</label>
                <select v-model="form.bank">
                  <option value="">— არ ვრიცხვარ —</option>
                  <option v-for="b in banks" :key="b" :value="b">{{ b }}</option>
                </select>
              </div>
              <div class="crm-field">
                <label>რეგიონი</label>
                <select v-model="form.region">
                  <option value="">— აირჩიეთ —</option>
                  <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
                </select>
              </div>
              <div v-if="drawerTarget" class="crm-field">
                <label>სტატუსი</label>
                <select v-model="form.status">
                  <option value="active">აქტიური</option>
                  <option value="inactive">გათიშული</option>
                </select>
              </div>
            </div>

            <!-- Password -->
            <div class="mem-drawer-section-title" style="margin-top:1.5rem">
              <button type="button" class="mem-pass-toggle" @click="showPass = !showPass">
                <span>{{ showPass ? '▲' : '▼' }}</span>
                {{ drawerTarget ? 'პაროლის შეცვლა' : 'პაროლი' }}
              </button>
            </div>
            <transition name="slide-down">
              <div v-if="showPass" class="crm-form-grid">
                <div class="crm-field">
                  <label>{{ drawerTarget ? 'ახალი პაროლი' : 'პაროლი' }}</label>
                  <input type="password" v-model="form.newPass" placeholder="მინ. 8 სიმბოლო" />
                </div>
                <div class="crm-field">
                  <label>გაიმეორეთ</label>
                  <input type="password" v-model="form.confirmPass" />
                </div>
              </div>
            </transition>

            <div v-if="formError" class="cp-error-msg" style="margin-top:1rem">{{ formError }}</div>
            <div v-if="formSaved" class="cp-success-banner" style="margin-top:1rem">
              {{ drawerTarget ? 'ცვლილებები შენახულია' : 'თანამშრომელი დამატებულია' }}
            </div>
          </div>

          <div class="mem-drawer-footer">
            <button type="button" class="crm-btn-secondary" @click="closeDrawer">გაუქმება</button>
            <button type="button" class="crm-btn-primary" @click="saveForm">შენახვა</button>
          </div>

        </div>
      </div>
    </transition>

  </InnerPageLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import InnerPageLayout from '../website/shared/InnerPageLayout.vue'

const PAGE_SIZE = 10

// ─── filters ──────────────────────────────────────────
const searchQuery  = ref('')
const filterRole   = ref('')
const filterRegion = ref('')
const filterStatus = ref('')
const currentPage  = ref(1)

const hasFilters = computed(() =>
  searchQuery.value || filterRole.value || filterRegion.value || filterStatus.value
)
const clearFilters = () => {
  searchQuery.value = filterRole.value = filterRegion.value = filterStatus.value = ''
  currentPage.value = 1
}

// ─── sorting ──────────────────────────────────────────
const sortKey = ref('lastName')
const sortDir = ref(1)
const toggleSort = (key) => {
  if (sortKey.value === key) sortDir.value *= -1
  else { sortKey.value = key; sortDir.value = 1 }
  currentPage.value = 1
}
const sortIcon = (key) => sortKey.value !== key ? '↕' : sortDir.value === 1 ? '↑' : '↓'

// ─── drawer ───────────────────────────────────────────
const drawerOpen   = ref(false)
const drawerTarget = ref(null) // null = add mode
const form         = reactive({})
const showPass     = ref(false)
const formError    = ref('')
const formSaved    = ref(false)

// ─── static data ──────────────────────────────────────
const regions = [
  'თბილისი','იმერეთი','კახეთი','აჭარა','სამეგრელო',
  'შიდა ქართლი','ქვემო ქართლი','მცხეთა-მთიანეთი',
  'სამცხე-ჯავახეთი','გურია','რაჭა-ლეჩხუმი',
]
const banks = ['TBC Bank','Bank of Georgia','Liberty Bank','VTB Bank Georgia','Credo Bank','Progress Bank','Crystal','Pasha Bank']

const roleLabels = { central:'ცენტრალური', regional:'რეგიონული', consulting:'კონსულტანტი', training:'ტრენინგი', bank:'ბანკი' }
const roleLabel = (r) => roleLabels[r] ?? r

// ─── employees data ───────────────────────────────────
let nextId = 21
const employees = ref([
  { id: 1,  firstName:'მარინე',  lastName:'გელაშვილი',  email:'m.gelashvili@growthhub.ge',  phone:'555 12 34 56', personalId:'11111111111', role:'central',    bank:'',              region:'თბილისი',        position:'ოფისის მენეჯერი',        status:'active' },
  { id: 2,  firstName:'გიორგი', lastName:'ბერიძე',      email:'g.beridze@growthhub.ge',     phone:'599 23 45 67', personalId:'22222222222', role:'central',    bank:'',              region:'თბილისი',        position:'პროგრამის კოორდინატორი', status:'active' },
  { id: 3,  firstName:'ნინო',   lastName:'კვარაცხელია', email:'n.kvar@growthhub.ge',        phone:'577 34 56 78', personalId:'33333333333', role:'regional',   bank:'',              region:'იმერეთი',        position:'რეგიონული კოორდინატორი', status:'active' },
  { id: 4,  firstName:'დავით',  lastName:'ელიავა',       email:'d.eliava@growthhub.ge',      phone:'555 45 67 89', personalId:'44444444444', role:'regional',   bank:'',              region:'კახეთი',         position:'რეგიონული კოორდინატორი', status:'active' },
  { id: 5,  firstName:'ანა',    lastName:'ჩხიკვაძე',     email:'a.chkhik@growthhub.ge',      phone:'551 56 78 90', personalId:'55555555555', role:'regional',   bank:'',              region:'აჭარა',          position:'ბიზნეს კონსულტანტი',     status:'active' },
  { id: 6,  firstName:'ლაშა',   lastName:'ნადირაძე',     email:'l.nad@consultinge.ge',       phone:'595 67 89 01', personalId:'66666666666', role:'consulting', bank:'',              region:'თბილისი',        position:'მთავარი კონსულტანტი',    status:'active' },
  { id: 7,  firstName:'თამარი', lastName:'სიხარულიძე',   email:'t.sikh@consultinge.ge',      phone:'599 78 90 12', personalId:'77777777777', role:'consulting', bank:'',              region:'იმერეთი',        position:'ბიზნეს კონსულტანტი',     status:'active' },
  { id: 8,  firstName:'ირაკლი', lastName:'გოგოლაძე',     email:'i.gog@trainco.ge',           phone:'577 89 01 23', personalId:'88888888888', role:'training',   bank:'',              region:'კახეთი',         position:'ტრენერი',                 status:'active' },
  { id: 9,  firstName:'ეკა',    lastName:'ბეჟანიძე',     email:'e.bezh@trainco.ge',          phone:'568 90 12 34', personalId:'99999999999', role:'training',   bank:'',              region:'ქვემო ქართლი',   position:'სასწავლო მენეჯერი',       status:'active' },
  { id: 10, firstName:'ბაკური', lastName:'ლომიძე',       email:'b.lom@tbcbank.ge',           phone:'591 01 23 45', personalId:'10101010101', role:'bank',       bank:'TBC Bank',      region:'თბილისი',        position:'ბანკის მენეჯერი',         status:'active' },
  { id: 11, firstName:'მზია',   lastName:'დადიანი',      email:'m.dad@bog.ge',               phone:'555 12 23 34', personalId:'11121314151', role:'bank',       bank:'Bank of Georgia',region:'სამეგრელო',      position:'ფინანსური ოფიცერი',       status:'active' },
  { id: 12, firstName:'გია',    lastName:'ქობულაძე',     email:'g.kob@growthhub.ge',         phone:'551 23 34 45', personalId:'12131415161', role:'central',    bank:'',              region:'თბილისი',        position:'IT სპეციალისტი',          status:'active' },
  { id: 13, firstName:'სოფო',   lastName:'ახვლედიანი',   email:'s.akhv@growthhub.ge',        phone:'595 34 45 56', personalId:'13141516171', role:'regional',   bank:'',              region:'გურია',          position:'ბიზნეს კოორდინატორი',    status:'inactive' },
  { id: 14, firstName:'ნიკა',   lastName:'ჯაფარიძე',     email:'n.jap@growthhub.ge',         phone:'599 45 56 67', personalId:'14151617181', role:'regional',   bank:'',              region:'შიდა ქართლი',    position:'კოორდინატორი',            status:'active' },
  { id: 15, firstName:'მარიამი',lastName:'ცხოვრებაძე',   email:'m.ts@growthhub.ge',          phone:'577 56 67 78', personalId:'15161718191', role:'central',    bank:'',              region:'თბილისი',        position:'HR მენეჯერი',             status:'active' },
  { id: 16, firstName:'ნათია',  lastName:'ჩიქოვანი',     email:'n.chiq@consultinge.ge',      phone:'568 67 78 89', personalId:'16171819201', role:'consulting', bank:'',              region:'სამეგრელო',      position:'ბიზნეს ანალიტიკოსი',     status:'active' },
  { id: 17, firstName:'ზურაბი', lastName:'გელაძე',       email:'z.gel@trainco.ge',           phone:'591 78 89 90', personalId:'17181920211', role:'training',   bank:'',              region:'რაჭა-ლეჩხუმი',  position:'ტრენერი',                 status:'inactive' },
  { id: 18, firstName:'ლია',    lastName:'ბერიაშვილი',   email:'l.ber@libertybank.ge',       phone:'555 89 90 01', personalId:'18192021221', role:'bank',       bank:'Liberty Bank',  region:'ქვემო ქართლი',   position:'კრედიტის ოფიცერი',        status:'active' },
  { id: 19, firstName:'ლევანი', lastName:'ზარდიაშვილი',  email:'l.zard@growthhub.ge',        phone:'551 90 01 12', personalId:'19202122231', role:'regional',   bank:'',              region:'მცხეთა-მთიანეთი', position:'რეგიონული კოორდინატორი', status:'active' },
  { id: 20, firstName:'ხათუნა', lastName:'ნარიმანიძე',   email:'kh.nar@growthhub.ge',        phone:'595 01 12 23', personalId:'20212223241', role:'central',    bank:'',              region:'თბილისი',        position:'პროექტის მენეჯერი',       status:'active' },
])

// ─── stats ────────────────────────────────────────────
const activeCount   = computed(() => employees.value.filter(e => e.status === 'active').length)
const centralCount  = computed(() => employees.value.filter(e => e.role === 'central').length)
const regionalCount = computed(() => employees.value.filter(e => e.role === 'regional').length)

// ─── filtering + sorting ──────────────────────────────
const filteredEmployees = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  let list = employees.value.filter(e => {
    const matchQ = !q ||
      (e.firstName + ' ' + e.lastName).toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.position.toLowerCase().includes(q)
    const matchRole   = !filterRole.value   || e.role   === filterRole.value
    const matchRegion = !filterRegion.value || e.region === filterRegion.value
    const matchStatus = !filterStatus.value || e.status === filterStatus.value
    return matchQ && matchRole && matchRegion && matchStatus
  })
  const k = sortKey.value
  return [...list].sort((a, b) => (a[k] ?? '').localeCompare(b[k] ?? '', 'ka') * sortDir.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredEmployees.value.length / PAGE_SIZE)))
const paginatedEmployees = computed(() => {
  const s = (currentPage.value - 1) * PAGE_SIZE
  return filteredEmployees.value.slice(s, s + PAGE_SIZE)
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

// ─── drawer ───────────────────────────────────────────
const resetForm = (e = null) => {
  Object.assign(form, {
    firstName: e?.firstName ?? '', lastName: e?.lastName ?? '',
    email: e?.email ?? '',  phone: e?.phone ?? '',
    personalId: e?.personalId ?? '', position: e?.position ?? '',
    role: e?.role ?? '', bank: e?.bank ?? '',
    region: e?.region ?? '', status: e?.status ?? 'active',
    newPass: '', confirmPass: '',
  })
  showPass.value = !e // open pass section by default for new employees
  formError.value = ''
  formSaved.value = false
}

const openEdit = (e) => { drawerTarget.value = e; resetForm(e); drawerOpen.value = true }
const openAdd  = ()  => { drawerTarget.value = null; resetForm(); drawerOpen.value = true }
const closeDrawer = () => { drawerOpen.value = false; drawerTarget.value = null }

const saveForm = () => {
  formError.value = ''
  if (!form.firstName || !form.lastName || !form.email) {
    formError.value = 'სახელი, გვარი და ელ. ფოსტა სავალდებულოა.'; return
  }
  if (showPass.value || !drawerTarget.value) {
    if (!drawerTarget.value && !form.newPass) {
      formError.value = 'პაროლი სავალდებულოა ახალი თანამშრომლისთვის.'; return
    }
    if (form.newPass && form.newPass.length < 8) {
      formError.value = 'პაროლი მინიმუმ 8 სიმბოლო.'; return
    }
    if (form.newPass && form.newPass !== form.confirmPass) {
      formError.value = 'პაროლები არ ემთხვევა.'; return
    }
  }

  if (drawerTarget.value) {
    const idx = employees.value.findIndex(e => e.id === drawerTarget.value.id)
    if (idx !== -1) {
      employees.value[idx] = { ...employees.value[idx],
        firstName: form.firstName, lastName: form.lastName,
        email: form.email, phone: form.phone,
        personalId: form.personalId, position: form.position,
        role: form.role, bank: form.bank,
        region: form.region, status: form.status,
      }
    }
  } else {
    employees.value.unshift({
      id: nextId++,
      firstName: form.firstName, lastName: form.lastName,
      email: form.email, phone: form.phone,
      personalId: form.personalId, position: form.position,
      role: form.role || 'central', bank: form.bank,
      region: form.region, status: 'active',
    })
  }

  formSaved.value = true
  setTimeout(() => { formSaved.value = false; closeDrawer() }, 1500)
}

// ─── CSV ──────────────────────────────────────────────
const downloadCsv = () => {
  const headers = ['სახელი','გვარი','ელ. ფოსტა','ტელეფონი','პოზიცია','როლი','რეგიონი','სტატუსი']
  const rows = filteredEmployees.value.map(e =>
    [e.firstName, e.lastName, e.email, `+995 ${e.phone}`, e.position, roleLabel(e.role), e.region, e.status === 'active' ? 'აქტიური' : 'გათიშული']
      .map(v => `"${v}"`).join(',')
  )
  const csv  = [headers.join(','), ...rows].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), { href: url, download: 'employees.csv' })
  a.click(); URL.revokeObjectURL(url)
}
</script>
