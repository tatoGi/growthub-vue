<template>
  <InnerPageLayout title="ცენტრის წევრები" breadcrumb="ცენტრის წევრები">
    <div class="mem-page-bg">
    <div class="container mem-body">

      <!-- Stats bar -->
      <div class="mem-stats-bar">
        <div class="mem-stat">
          <strong>{{ members.length }}</strong>
          <span>სულ წევრი</span>
        </div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat">
          <strong>{{ uniqueRegions }}</strong>
          <span>რეგიონი</span>
        </div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat">
          <strong>{{ uniqueActivities }}</strong>
          <span>საქმიანობა</span>
        </div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat">
          <strong>{{ filteredMembers.length }}</strong>
          <span>ნაჩვენები</span>
        </div>
        <div class="mem-stats-actions">
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
          <input
            type="text"
            class="mem-search-input"
            v-model="searchQuery"
            placeholder="ს/კ, სახელი, კომპანია..."
          />
          <button v-if="searchQuery" type="button" class="mem-search-clear" @click="searchQuery = ''">✕</button>
        </div>
        <select class="mem-filter-select" v-model="searchActivity">
          <option value="">ყველა საქმიანობა</option>
          <option v-for="a in activities" :key="a" :value="a">{{ a }}</option>
        </select>
        <select class="mem-filter-select" v-model="searchRegion">
          <option value="">ყველა რეგიონი</option>
          <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
        </select>
        <button v-if="hasActiveFilters" type="button" class="mem-clear-filters" @click="clearFilters">
          გასუფთავება
        </button>
      </div>

      <!-- Table -->
      <div class="mem-table-wrap">
        <table class="mem-table">
          <thead>
            <tr>
              <th class="mem-th-sortable" @click="toggleSort('companyName')">
                კომპანია
                <span class="mem-sort-icon">{{ sortIcon('companyName') }}</span>
              </th>
              <th>ს/კ</th>
              <th class="mem-th-sortable" @click="toggleSort('lastName')">
                წევრი
                <span class="mem-sort-icon">{{ sortIcon('lastName') }}</span>
              </th>
              <th>ტელეფონი</th>
              <th class="mem-th-sortable" @click="toggleSort('municipality')">
                მუნიციპალიტეტი
                <span class="mem-sort-icon">{{ sortIcon('municipality') }}</span>
              </th>
              <th class="mem-th-sortable" @click="toggleSort('activity')">
                საქმიანობა
                <span class="mem-sort-icon">{{ sortIcon('activity') }}</span>
              </th>
              <th class="mem-th-sortable" @click="toggleSort('region')">
                რეგიონი
                <span class="mem-sort-icon">{{ sortIcon('region') }}</span>
              </th>
              <th>როლი</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="m in paginatedMembers"
              :key="m.id"
              class="mem-row"
              :class="{ 'mem-row-active': editTarget?.id === m.id }"
              @click="openEdit(m)"
            >
              <td class="mem-cell-company">{{ m.companyName }}</td>
              <td class="mem-cell-code">{{ m.idCode }}</td>
              <td class="mem-cell-person">
                <span class="mem-avatar">{{ m.firstName.charAt(0) }}{{ m.lastName.charAt(0) }}</span>
                <span>{{ m.firstName }} {{ m.lastName }}</span>
              </td>
              <td class="mem-cell-muted">+995 {{ m.phone }}</td>
              <td class="mem-cell-muted">{{ m.municipality }}</td>
              <td>
                <span class="mem-activity-tag">{{ m.activity }}</span>
              </td>
              <td class="mem-cell-muted">{{ m.region }}</td>
              <td>
                <span class="mem-role-badge" :class="`mem-role-${m.role}`">{{ roleLabel(m.role) }}</span>
              </td>
              <td class="mem-cell-arrow">›</td>
            </tr>
            <tr v-if="filteredMembers.length === 0">
              <td colspan="9" class="mem-empty">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <span>წევრი ვერ მოიძებნა</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="members-pagination">
        <button type="button" class="members-page-btn" :disabled="currentPage === 1" @click="currentPage--">‹</button>
        <button
          v-for="p in visiblePages"
          :key="p"
          type="button"
          class="members-page-btn"
          :class="{ active: p === currentPage, 'page-ellipsis': p === '…' }"
          :disabled="p === '…'"
          @click="p !== '…' && (currentPage = p)"
        >{{ p }}</button>
        <button type="button" class="members-page-btn" :disabled="currentPage === totalPages" @click="currentPage++">›</button>
      </div>

    </div>
    </div><!-- /mem-page-bg -->

    <!-- Edit drawer -->
    <transition name="drawer">
      <div v-if="editTarget" class="mem-drawer-root" @click.self="closeEdit">
        <div class="mem-drawer">

          <!-- Drawer header -->
          <div class="mem-drawer-head">
            <div class="mem-drawer-avatar">{{ editTarget.firstName.charAt(0) }}{{ editTarget.lastName.charAt(0) }}</div>
            <div>
              <div class="mem-drawer-name">{{ editTarget.firstName }} {{ editTarget.lastName }}</div>
              <div class="mem-drawer-sub">{{ editTarget.companyName }} · {{ editTarget.idCode }}</div>
            </div>
            <button type="button" class="mem-drawer-close" @click="closeEdit">✕</button>
          </div>

          <!-- Sections -->
          <div class="mem-drawer-body">

            <div class="mem-drawer-section-title">პირადი ინფორმაცია</div>
            <div class="crm-form-grid">
              <div class="crm-field">
                <label>სახელი</label>
                <input type="text" v-model="editForm.firstName" />
              </div>
              <div class="crm-field">
                <label>გვარი</label>
                <input type="text" v-model="editForm.lastName" />
              </div>
              <div class="crm-field">
                <label>ელ. ფოსტა</label>
                <input type="email" v-model="editForm.email" />
              </div>
              <div class="crm-field">
                <label>ტელეფონი</label>
                <div class="crm-input-prefix">
                  <span>+995</span>
                  <input type="tel" v-model="editForm.phone" />
                </div>
              </div>
              <div class="crm-field">
                <label>პირადი ნომერი</label>
                <input type="text" v-model="editForm.personalId" placeholder="11 ნიშნა კოდი" />
              </div>
            </div>

            <div class="mem-drawer-section-title" style="margin-top:1.5rem">სისტემური მონაცემები</div>
            <div class="crm-form-grid">
              <div class="crm-field">
                <label>როლი</label>
                <select v-model="editForm.role">
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
                <select v-model="editForm.bank">
                  <option value="">— აირჩიეთ —</option>
                  <option v-for="b in banks" :key="b" :value="b">{{ b }}</option>
                </select>
              </div>
              <div class="crm-field">
                <label>რეგიონი</label>
                <select v-model="editForm.region">
                  <option value="">— აირჩიეთ —</option>
                  <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
                </select>
              </div>
            </div>

            <!-- Password section -->
            <div class="mem-drawer-section-title" style="margin-top:1.5rem">
              <button type="button" class="mem-pass-toggle" @click="showPassChange = !showPassChange">
                <span>{{ showPassChange ? '▲' : '▼' }}</span>
                პაროლის შეცვლა
              </button>
            </div>
            <transition name="slide-down">
              <div v-if="showPassChange" class="crm-form-grid">
                <div class="crm-field">
                  <label>ახალი პაროლი</label>
                  <input type="password" v-model="editForm.newPass" placeholder="მინ. 8 სიმბოლო" />
                </div>
                <div class="crm-field">
                  <label>გაიმეორეთ</label>
                  <input type="password" v-model="editForm.confirmPass" placeholder="გაიმეორეთ პაროლი" />
                </div>
              </div>
            </transition>

            <div v-if="editError" class="cp-error-msg" style="margin-top:1rem">{{ editError }}</div>
            <div v-if="editSaved" class="cp-success-banner" style="margin-top:1rem">ცვლილებები შენახულია</div>
          </div>

          <!-- Drawer footer -->
          <div class="mem-drawer-footer">
            <button type="button" class="crm-btn-secondary" @click="closeEdit">გაუქმება</button>
            <button type="button" class="crm-btn-primary" @click="saveEdit">შენახვა</button>
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

// ─── filters (live) ───────────────────────────────────
const searchQuery    = ref('')
const searchActivity = ref('')
const searchRegion   = ref('')
const currentPage    = ref(1)

const hasActiveFilters = computed(() =>
  searchQuery.value || searchActivity.value || searchRegion.value
)
const clearFilters = () => {
  searchQuery.value = ''
  searchActivity.value = ''
  searchRegion.value = ''
  currentPage.value = 1
}

// ─── sorting ──────────────────────────────────────────
const sortKey = ref('companyName')
const sortDir = ref(1) // 1=asc, -1=desc

const toggleSort = (key) => {
  if (sortKey.value === key) sortDir.value *= -1
  else { sortKey.value = key; sortDir.value = 1 }
  currentPage.value = 1
}
const sortIcon = (key) => {
  if (sortKey.value !== key) return '↕'
  return sortDir.value === 1 ? '↑' : '↓'
}

// ─── edit drawer ──────────────────────────────────────
const editTarget    = ref(null)
const editForm      = reactive({})
const showPassChange = ref(false)
const editError     = ref('')
const editSaved     = ref(false)

// ─── static data ──────────────────────────────────────
const activities = [
  'სოფლის მეურნეობა', 'ტურიზმი', 'წარმოება', 'ვაჭრობა',
  'მომსახურება', 'IT', 'სამშენებლო', 'ჯანდაცვა', 'განათლება',
]
const regions = [
  'თბილისი', 'იმერეთი', 'კახეთი', 'აჭარა', 'სამეგრელო',
  'შიდა ქართლი', 'ქვემო ქართლი', 'მცხეთა-მთიანეთი',
  'სამცხე-ჯავახეთი', 'გურია', 'რაჭა-ლეჩხუმი',
]
const banks = [
  'TBC Bank', 'Bank of Georgia', 'Liberty Bank', 'VTB Bank Georgia',
  'Credo Bank', 'Progress Bank', 'Crystal', 'Pasha Bank',
]

const roleLabels = {
  central: 'ცენტრალური', regional: 'რეგიონული',
  consulting: 'კონსულტანტი', training: 'ტრენინგი', bank: 'ბანკი',
}
const roleLabel = (r) => roleLabels[r] ?? r

// ─── members data ─────────────────────────────────────
const members = ref([
  { id: 1,  companyName: 'ასი პლუს შპს',       idCode: '205123456', firstName: 'გიორგი',  lastName: 'ბერიძე',      email: 'g.beridze@asipluse.ge',   phone: '599 11 22 33', personalId: '01234567890', role: 'regional',   bank: 'TBC Bank',         municipality: 'ქუთაისი',   activity: 'წარმოება',         region: 'იმერეთი' },
  { id: 2,  companyName: 'მზე ჯგუფი სს',        idCode: '205234567', firstName: 'ნინო',    lastName: 'გელაშვილი',   email: 'n.gelashvili@mze.ge',     phone: '577 22 33 44', personalId: '02345678901', role: 'central',    bank: 'Bank of Georgia',  municipality: 'თბილისი',   activity: 'მომსახურება',      region: 'თბილისი' },
  { id: 3,  companyName: 'კახი ფარმი ი.პ.',      idCode: '205345678', firstName: 'დავით',   lastName: 'კვარაცხელია',email: 'd.kvar@kakhifarm.ge',      phone: '555 33 44 55', personalId: '03456789012', role: 'regional',   bank: 'Liberty Bank',     municipality: 'თელავი',    activity: 'სოფლის მეურნეობა', region: 'კახეთი' },
  { id: 4,  companyName: 'ბათო ტური შპს',       idCode: '205456789', firstName: 'მარიამი', lastName: 'ახვლედიანი',  email: 'm.akhv@batotour.ge',      phone: '568 44 55 66', personalId: '04567890123', role: 'consulting', bank: 'TBC Bank',         municipality: 'ბათუმი',    activity: 'ტურიზმი',          region: 'აჭარა' },
  { id: 5,  companyName: 'ნარინჯი IT ი.პ.',      idCode: '205567890', firstName: 'ლაშა',    lastName: 'ელიავა',      email: 'l.eliava@narinjiit.ge',   phone: '595 55 66 77', personalId: '05678901234', role: 'training',   bank: 'Bank of Georgia',  municipality: 'თბილისი',   activity: 'IT',               region: 'თბილისი' },
  { id: 6,  companyName: 'ზღვის ბაღი სს',       idCode: '205678901', firstName: 'ანა',     lastName: 'ჩხიკვაძე',    email: 'a.chkhik@zghvisbaghi.ge', phone: '551 66 77 88', personalId: '06789012345', role: 'regional',   bank: 'Credo Bank',       municipality: 'ოზურგეთი',  activity: 'სოფლის მეურნეობა', region: 'გურია' },
  { id: 7,  companyName: 'სტილი ჯგ შპს',        idCode: '205789012', firstName: 'თამარი',  lastName: 'ნადირაძე',    email: 't.nad@stilijg.ge',        phone: '599 77 88 99', personalId: '07890123456', role: 'central',    bank: 'Liberty Bank',     municipality: 'ქუთაისი',   activity: 'ვაჭრობა',          region: 'იმერეთი' },
  { id: 8,  companyName: 'მთის ბალახი ი.პ.',     idCode: '205890123', firstName: 'ირაკლი',  lastName: 'ჯაფარიძე',    email: 'i.jap@mtisbalakhi.ge',    phone: '577 88 99 00', personalId: '08901234567', role: 'regional',   bank: 'VTB Bank Georgia', municipality: 'ამბროლაური', activity: 'სოფლის მეურნეობა', region: 'რაჭა-ლეჩხუმი' },
  { id: 9,  companyName: 'ჰელსი მედი შპს',      idCode: '205901234', firstName: 'სოფო',    lastName: 'გოგოლაძე',    email: 's.gog@helsimedic.ge',     phone: '555 99 00 11', personalId: '09012345678', role: 'consulting', bank: 'TBC Bank',         municipality: 'გორი',      activity: 'ჯანდაცვა',         region: 'შიდა ქართლი' },
  { id: 10, companyName: 'ედუ ცენტრი სს',       idCode: '206012345', firstName: 'ნიკა',    lastName: 'ბეჟანიძე',    email: 'n.bezh@educenter.ge',     phone: '568 00 11 22', personalId: '10123456789', role: 'training',   bank: 'Progress Bank',    municipality: 'ქუთაისი',   activity: 'განათლება',        region: 'იმერეთი' },
  { id: 11, companyName: 'სამი მთა ი.პ.',        idCode: '206123456', firstName: 'ეკა',     lastName: 'სიხარულიძე',  email: 'e.sikh@samamtha.ge',      phone: '595 11 22 33', personalId: '11234567890', role: 'regional',   bank: 'Bank of Georgia',  municipality: 'მცხეთა',    activity: 'ტურიზმი',          region: 'მცხეთა-მთიანეთი' },
  { id: 12, companyName: 'კონსტრუქტი შპს',      idCode: '206234567', firstName: 'გია',     lastName: 'ქობულაძე',    email: 'g.kob@konstruqti.ge',     phone: '551 22 33 44', personalId: '12345678901', role: 'consulting', bank: 'Credo Bank',       municipality: 'რუსთავი',   activity: 'სამშენებლო',       region: 'ქვემო ქართლი' },
  { id: 13, companyName: 'სვანეთი ტური ი.პ.',    idCode: '206345678', firstName: 'მზია',    lastName: 'დადიანი',     email: 'm.dad@svanetitur.ge',     phone: '599 33 44 55', personalId: '13456789012', role: 'regional',   bank: 'Liberty Bank',     municipality: 'მესტია',    activity: 'ტურიზმი',          region: 'სამეგრელო' },
  { id: 14, companyName: 'ახალი ფუძე შპს',       idCode: '206456789', firstName: 'ბაკური',  lastName: 'ცხოვრებაძე',  email: 'b.ts@akhalifudze.ge',     phone: '577 44 55 66', personalId: '14567890123', role: 'central',    bank: 'TBC Bank',         municipality: 'თბილისი',   activity: 'სამშენებლო',       region: 'თბილისი' },
  { id: 15, companyName: 'ტყის პროდუქტი სს',    idCode: '206567890', firstName: 'ნათია',   lastName: 'ლომიძე',      email: 'n.lom@tkisprodukti.ge',   phone: '595 55 66 77', personalId: '15678901234', role: 'regional',   bank: 'Pasha Bank',       municipality: 'ზუგდიდი',   activity: 'სოფლის მეურნეობა', region: 'სამეგრელო' },
])

// ─── stats ────────────────────────────────────────────
const uniqueRegions    = computed(() => new Set(members.value.map(m => m.region)).size)
const uniqueActivities = computed(() => new Set(members.value.map(m => m.activity)).size)

// ─── filtering + sorting ──────────────────────────────
const filteredMembers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  let result = members.value.filter(m => {
    const matchQ = !q || m.idCode.includes(q) ||
      (m.firstName + ' ' + m.lastName).toLowerCase().includes(q) ||
      m.companyName.toLowerCase().includes(q)
    const matchA = !searchActivity.value || m.activity === searchActivity.value
    const matchR = !searchRegion.value   || m.region   === searchRegion.value
    return matchQ && matchA && matchR
  })
  const k = sortKey.value
  const d = sortDir.value
  result = [...result].sort((a, b) =>
    (a[k] ?? '').localeCompare(b[k] ?? '', 'ka') * d
  )
  return result
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredMembers.value.length / PAGE_SIZE)))

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredMembers.value.slice(start, start + PAGE_SIZE)
})

const visiblePages = computed(() => {
  const t = totalPages.value
  const c = currentPage.value
  if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1)
  const pages = new Set([1, t, c - 1, c, c + 1].filter(p => p >= 1 && p <= t))
  const sorted = [...pages].sort((a, b) => a - b)
  const result = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('…')
    result.push(sorted[i])
  }
  return result
})

// ─── edit drawer ──────────────────────────────────────
const openEdit = (m) => {
  editTarget.value = m
  Object.assign(editForm, {
    firstName: m.firstName, lastName: m.lastName,
    email: m.email, phone: m.phone,
    personalId: m.personalId, role: m.role,
    bank: m.bank, region: m.region,
    newPass: '', confirmPass: '',
  })
  showPassChange.value = false
  editError.value = ''
  editSaved.value = false
}

const closeEdit = () => { editTarget.value = null }

const saveEdit = () => {
  editError.value = ''
  if (showPassChange.value) {
    if (editForm.newPass && editForm.newPass.length < 8) {
      editError.value = 'ახალი პაროლი მინიმუმ 8 სიმბოლოს უნდა შეიცავდეს.'; return
    }
    if (editForm.newPass !== editForm.confirmPass) {
      editError.value = 'პაროლები არ ემთხვევა.'; return
    }
  }
  const idx = members.value.findIndex(m => m.id === editTarget.value.id)
  if (idx !== -1) {
    members.value[idx] = { ...members.value[idx],
      firstName: editForm.firstName, lastName: editForm.lastName,
      email: editForm.email, phone: editForm.phone,
      personalId: editForm.personalId, role: editForm.role,
      bank: editForm.bank, region: editForm.region,
    }
  }
  editSaved.value = true
  setTimeout(() => { editSaved.value = false; closeEdit() }, 1500)
}

// ─── CSV export ───────────────────────────────────────
const downloadCsv = () => {
  const headers = ['ი.პ. დასახელება','ს/კ','სახელი','გვარი','ტელ.','მუნიციპალიტეტი','საქმიანობა','რეგიონი','როლი']
  const rows = filteredMembers.value.map(m =>
    [m.companyName, m.idCode, m.firstName, m.lastName, `+995 ${m.phone}`, m.municipality, m.activity, m.region, roleLabel(m.role)]
      .map(v => `"${v}"`).join(',')
  )
  const csv  = [headers.join(','), ...rows].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), { href: url, download: 'members.csv' })
  a.click(); URL.revokeObjectURL(url)
}
</script>
