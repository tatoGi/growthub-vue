<template>
  <InnerPageLayout title="მეწარმეთა ბაზა" breadcrumb="მეწარმეთა ბაზა">
    <div class="mem-page-bg">
    <div class="container mem-body">

      <!-- Stats bar -->
      <div class="mem-stats-bar">
        <div class="mem-stat">
          <strong>{{ companies.length }}</strong>
          <span>სულ მეწარმე</span>
        </div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat">
          <strong>{{ activeCount }}</strong>
          <span>აქტიური</span>
        </div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat">
          <strong>{{ sectorsCount }}</strong>
          <span>სექტორი</span>
        </div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat">
          <strong>{{ avgScore }}</strong>
          <span>საშ. ქულა</span>
        </div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat">
          <strong>{{ filteredCompanies.length }}</strong>
          <span>ნაჩვენები</span>
        </div>
        <div class="mem-stats-actions">
          <button type="button" class="members-download-btn" @click="downloadCsv">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            CSV
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="mem-filters">
        <div class="mem-search-wrap">
          <svg class="mem-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" class="mem-search-input" v-model="searchQuery" placeholder="კომპანია, ს/კ, მეწარმე..." />
          <button v-if="searchQuery" type="button" class="mem-search-clear" @click="searchQuery = ''">✕</button>
        </div>
        <select class="mem-filter-select" v-model="filterSector">
          <option value="">ყველა სექტორი</option>
          <option v-for="s in sectors" :key="s" :value="s">{{ s }}</option>
        </select>
        <select class="mem-filter-select" v-model="filterRegion">
          <option value="">ყველა რეგიონი</option>
          <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
        </select>
        <select class="mem-filter-select" v-model="filterStatus" style="flex:0 1 140px">
          <option value="">ყველა სტატუსი</option>
          <option value="active">აქტიური</option>
          <option value="pending">მოლოდინში</option>
          <option value="inactive">გათიშული</option>
        </select>
        <button v-if="hasFilters" type="button" class="mem-clear-filters" @click="clearFilters">გასუფთავება</button>
      </div>

      <!-- Table -->
      <div class="mem-table-wrap">
        <table class="mem-table">
          <thead>
            <tr>
              <th class="mem-th-sortable" @click="toggleSort('companyName')">
                კომპანია <span class="mem-sort-icon">{{ sortIcon('companyName') }}</span>
              </th>
              <th>ს/კ</th>
              <th class="mem-th-sortable" @click="toggleSort('ownerLastName')">
                მეწარმე <span class="mem-sort-icon">{{ sortIcon('ownerLastName') }}</span>
              </th>
              <th>ტელეფონი</th>
              <th class="mem-th-sortable" @click="toggleSort('municipality')">
                მუნიციპ. <span class="mem-sort-icon">{{ sortIcon('municipality') }}</span>
              </th>
              <th class="mem-th-sortable" @click="toggleSort('sector')">
                სექტორი <span class="mem-sort-icon">{{ sortIcon('sector') }}</span>
              </th>
              <th class="mem-th-sortable" @click="toggleSort('score')">
                ქულა <span class="mem-sort-icon">{{ sortIcon('score') }}</span>
              </th>
              <th>სტატუსი</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in paginatedCompanies"
              :key="c.id"
              class="mem-row"
              :class="{ 'mem-row-active': drawerTarget?.id === c.id }"
              @click="openDrawer(c)"
            >
              <td>
                <div class="co-company-cell">
                  <span class="co-type-badge">{{ c.type }}</span>
                  <span class="mem-cell-company">{{ c.companyName }}</span>
                </div>
              </td>
              <td class="mem-cell-code">{{ c.idCode }}</td>
              <td class="mem-cell-person">
                <span class="mem-avatar" style="background:#e0f2fe;color:#0369a1">{{ c.ownerFirstName.charAt(0) }}{{ c.ownerLastName.charAt(0) }}</span>
                <span>{{ c.ownerFirstName }} {{ c.ownerLastName }}</span>
              </td>
              <td class="mem-cell-muted">+995 {{ c.phone }}</td>
              <td class="mem-cell-muted">{{ c.municipality }}</td>
              <td>
                <span class="mem-activity-tag">{{ c.sector }}</span>
              </td>
              <td>
                <span v-if="c.score !== null" class="co-score-badge" :class="scoreClass(c.score)">{{ c.score }}</span>
                <span v-else class="co-score-none">—</span>
              </td>
              <td>
                <span class="co-status-badge" :class="`co-status-${c.status}`">{{ statusLabel(c.status) }}</span>
              </td>
              <td class="mem-cell-arrow">›</td>
            </tr>
            <tr v-if="filteredCompanies.length === 0">
              <td colspan="9" class="mem-empty">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".3"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                <span>კომპანია ვერ მოიძებნა</span>
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
    </div>

    <!-- Detail drawer -->
    <transition name="drawer">
      <div v-if="drawerTarget" class="mem-drawer-root" @click.self="closeDrawer">
        <div class="mem-drawer">

          <!-- Head -->
          <div class="mem-drawer-head">
            <div class="co-drawer-logo">{{ drawerTarget.companyName.charAt(0) }}</div>
            <div style="flex:1;min-width:0">
              <div class="mem-drawer-name" style="display:flex;align-items:center;gap:.5rem">
                {{ drawerTarget.companyName }}
                <span class="co-type-badge">{{ drawerTarget.type }}</span>
              </div>
              <div class="mem-drawer-sub">ს/კ: {{ drawerTarget.idCode }} · {{ drawerTarget.municipality }}, {{ drawerTarget.region }}</div>
            </div>
            <button type="button" class="mem-drawer-close" @click="closeDrawer">✕</button>
          </div>

          <div class="mem-drawer-body">

            <!-- Score + status row -->
            <div class="co-drawer-metrics">
              <div class="co-metric-card">
                <span class="co-metric-label">დიაგნ. ქულა</span>
                <span class="co-metric-value" :class="drawerTarget.score !== null ? scoreClass(drawerTarget.score) + '-text' : ''">
                  {{ drawerTarget.score ?? '—' }}
                </span>
              </div>
              <div class="co-metric-card">
                <span class="co-metric-label">სტატუსი</span>
                <span class="co-status-badge" :class="`co-status-${drawerTarget.status}`">{{ statusLabel(drawerTarget.status) }}</span>
              </div>
              <div class="co-metric-card">
                <span class="co-metric-label">სექტორი</span>
                <span class="mem-activity-tag">{{ drawerTarget.sector }}</span>
              </div>
              <div class="co-metric-card">
                <span class="co-metric-label">ბოლო ვიზიტი</span>
                <span class="co-metric-value">{{ drawerTarget.lastVisit ?? '—' }}</span>
              </div>
            </div>

            <!-- Company info -->
            <div class="mem-drawer-section-title" style="margin-top:1.25rem">კომპანიის ინფორმაცია</div>
            <div class="co-info-list">
              <div class="co-info-row">
                <span>საიდენტიფიკაციო კოდი</span>
                <strong>{{ drawerTarget.idCode }}</strong>
              </div>
              <div class="co-info-row">
                <span>სამართლებრივი ფორმა</span>
                <strong>{{ drawerTarget.type }}</strong>
              </div>
              <div class="co-info-row">
                <span>სექტორი</span>
                <strong>{{ drawerTarget.sector }}</strong>
              </div>
              <div class="co-info-row">
                <span>NACE კოდი</span>
                <strong>{{ drawerTarget.nace ?? '—' }}</strong>
              </div>
              <div class="co-info-row">
                <span>მუნიციპალიტეტი</span>
                <strong>{{ drawerTarget.municipality }}</strong>
              </div>
              <div class="co-info-row">
                <span>რეგიონი</span>
                <strong>{{ drawerTarget.region }}</strong>
              </div>
              <div class="co-info-row">
                <span>დარეგისტრირდა</span>
                <strong>{{ drawerTarget.registeredDate }}</strong>
              </div>
            </div>

            <!-- Owner info -->
            <div class="mem-drawer-section-title" style="margin-top:1.5rem">მეწარმის ინფორმაცია</div>
            <div class="co-info-list">
              <div class="co-info-row">
                <span>სახელი, გვარი</span>
                <strong>{{ drawerTarget.ownerFirstName }} {{ drawerTarget.ownerLastName }}</strong>
              </div>
              <div class="co-info-row">
                <span>ელ. ფოსტა</span>
                <strong>{{ drawerTarget.email }}</strong>
              </div>
              <div class="co-info-row">
                <span>ტელეფონი</span>
                <strong>+995 {{ drawerTarget.phone }}</strong>
              </div>
            </div>

            <!-- Services -->
            <div class="mem-drawer-section-title" style="margin-top:1.5rem">სერვისები</div>
            <div class="co-services-list">
              <span
                v-for="s in drawerTarget.services"
                :key="s"
                class="co-service-chip"
              >{{ s }}</span>
              <span v-if="!drawerTarget.services?.length" class="co-no-services">სერვისი არ არის შერჩეული</span>
            </div>

            <!-- Notes -->
            <div v-if="drawerTarget.note" class="co-note-block">
              <div class="co-note-label">შენიშვნა</div>
              <p>{{ drawerTarget.note }}</p>
            </div>

          </div>

          <div class="mem-drawer-footer">
            <button type="button" class="crm-btn-secondary" @click="closeDrawer">დახურვა</button>
            <a
              :href="`#crm/central/diagnostic?company=${drawerTarget.idCode}`"
              class="crm-btn-primary"
              style="text-decoration:none;display:inline-flex;align-items:center"
            >დიაგნოსტიკა</a>
          </div>

        </div>
      </div>
    </transition>

  </InnerPageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import InnerPageLayout from '../website/shared/InnerPageLayout.vue'

const PAGE_SIZE = 12

// ─── filters ──────────────────────────────────────────
const searchQuery  = ref('')
const filterSector = ref('')
const filterRegion = ref('')
const filterStatus = ref('')
const currentPage  = ref(1)
const drawerTarget = ref(null)

const hasFilters = computed(() =>
  searchQuery.value || filterSector.value || filterRegion.value || filterStatus.value
)
const clearFilters = () => {
  searchQuery.value = filterSector.value = filterRegion.value = filterStatus.value = ''
  currentPage.value = 1
}

// ─── sorting ──────────────────────────────────────────
const sortKey = ref('companyName')
const sortDir = ref(1)
const toggleSort = (key) => {
  if (sortKey.value === key) sortDir.value *= -1
  else { sortKey.value = key; sortDir.value = 1 }
  currentPage.value = 1
}
const sortIcon = (k) => sortKey.value !== k ? '↕' : sortDir.value === 1 ? '↑' : '↓'

// ─── helpers ──────────────────────────────────────────
const statusLabel = (s) => ({ active:'აქტიური', pending:'მოლოდინში', inactive:'გათიშული' })[s] ?? s
const scoreClass  = (n) => n >= 70 ? 'co-score-high' : n >= 40 ? 'co-score-mid' : 'co-score-low'

// ─── static data ──────────────────────────────────────
const sectors = ['სოფლის მეურნეობა','ტურიზმი','წარმოება','ვაჭრობა','მომსახურება','IT','სამშენებლო','ჯანდაცვა','განათლება','ენერგეტიკა']
const regions  = ['თბილისი','იმერეთი','კახეთი','აჭარა','სამეგრელო','შიდა ქართლი','ქვემო ქართლი','მცხეთა-მთიანეთი','სამცხე-ჯავახეთი','გურია','რაჭა-ლეჩხუმი']

// ─── companies data ───────────────────────────────────
const companies = ref([
  { id:1,  companyName:'ასი პლუს',         type:'შპს', idCode:'205123456', ownerFirstName:'გიორგი',  ownerLastName:'ბერიძე',      email:'g.beridze@asipluse.ge',   phone:'599 11 22 33', municipality:'ქუთაისი',    region:'იმერეთი',         sector:'წარმოება',         nace:'C25.1', registeredDate:'12 მარ 2023', lastVisit:'4 მარ 2026',  status:'active',   score:82, services:['კონსულტაცია','ტრენინგი','ფინანსური პროგრამა'],       note:null },
  { id:2,  companyName:'მზე ჯგუფი',        type:'სს',  idCode:'205234567', ownerFirstName:'ნინო',    ownerLastName:'გელაშვილი',   email:'n.gel@mzegroup.ge',       phone:'577 22 33 44', municipality:'თბილისი',    region:'თბილისი',         sector:'მომსახურება',      nace:'N77.1', registeredDate:'3 ივნ 2022',  lastVisit:'7 მარ 2026',  status:'active',   score:91, services:['კონსულტაცია','დიაგნოსტიკა'],                          note:'მაღალი პოტენციალის კომპანია' },
  { id:3,  companyName:'კახი ფარმი',        type:'ი.პ.',idCode:'205345678', ownerFirstName:'დავით',   ownerLastName:'კვარაცხელია', email:'d.kvar@kakhifarm.ge',     phone:'555 33 44 55', municipality:'თელავი',     region:'კახეთი',           sector:'სოფლის მეურნეობა', nace:'A01.1', registeredDate:'19 სექ 2022', lastVisit:'3 მარ 2026',  status:'active',   score:67, services:['ტრენინგი','ფინანსური პროგრამა'],                       note:null },
  { id:4,  companyName:'ბათო ტური',         type:'შპს', idCode:'205456789', ownerFirstName:'მარიამი', ownerLastName:'ახვლედიანი',  email:'m.akhv@batotour.ge',      phone:'568 44 55 66', municipality:'ბათუმი',     region:'აჭარა',            sector:'ტურიზმი',           nace:'I55.1', registeredDate:'8 იან 2023',  lastVisit:'18 მარ 2026', status:'active',   score:74, services:['კონსულტაცია','მარკეტინგი'],                           note:null },
  { id:5,  companyName:'ნარინჯი IT',        type:'ი.პ.',idCode:'205567890', ownerFirstName:'ლაშა',    ownerLastName:'ელიავა',      email:'l.el@narinjiit.ge',       phone:'595 55 66 77', municipality:'თბილისი',    region:'თბილისი',          sector:'IT',               nace:'J62.0', registeredDate:'14 მაი 2023', lastVisit:'21 მარ 2026', status:'active',   score:88, services:['დიაგნოსტიკა','ფინანსური პროგრამა','ტრენინგი'],       note:'სტარტაპი, სწრაფი ზრდა' },
  { id:6,  companyName:'ზღვის ბაღი',        type:'სს',  idCode:'205678901', ownerFirstName:'ანა',     ownerLastName:'ჩხიკვაძე',    email:'a.chk@zghvisbaghi.ge',    phone:'551 66 77 88', municipality:'ოზურგეთი',   region:'გურია',            sector:'სოფლის მეურნეობა', nace:'A01.3', registeredDate:'22 ოქტ 2021', lastVisit:'6 მარ 2026',  status:'active',   score:55, services:['კონსულტაცია'],                                        note:null },
  { id:7,  companyName:'სტილი ჯგ',          type:'შპს', idCode:'205789012', ownerFirstName:'თამარი',  ownerLastName:'ნადირაძე',    email:'t.nad@stilijg.ge',        phone:'599 77 88 99', municipality:'ქუთაისი',    region:'იმერეთი',          sector:'ვაჭრობა',           nace:'G46.4', registeredDate:'5 ივლ 2022',  lastVisit:'14 მარ 2026', status:'active',   score:69, services:['ტრენინგი'],                                           note:null },
  { id:8,  companyName:'მთის ბალახი',       type:'ი.პ.',idCode:'205890123', ownerFirstName:'ირაკლი',  ownerLastName:'ჯაფარიძე',    email:'i.jap@mtisbalakhi.ge',    phone:'577 88 99 00', municipality:'ამბროლაური',  region:'რაჭა-ლეჩხუმი',    sector:'სოფლის მეურნეობა', nace:'A01.2', registeredDate:'11 ნოე 2021', lastVisit:null,          status:'inactive', score:38, services:[],                                                     note:'კავშირი გაწყვეტილია' },
  { id:9,  companyName:'ჰელსი მედი',        type:'შპს', idCode:'205901234', ownerFirstName:'სოფო',    ownerLastName:'გოგოლაძე',    email:'s.gog@helsimedic.ge',     phone:'555 99 00 11', municipality:'გორი',       region:'შიდა ქართლი',      sector:'ჯანდაცვა',         nace:'Q86.1', registeredDate:'28 თებ 2023', lastVisit:'10 მარ 2026', status:'active',   score:79, services:['კონსულტაცია','დიაგნოსტიკა','ფინანსური პროგრამა'],   note:null },
  { id:10, companyName:'ედუ ცენტრი',        type:'სს',  idCode:'206012345', ownerFirstName:'ნიკა',    ownerLastName:'ბეჟანიძე',    email:'n.bezh@educenter.ge',     phone:'568 00 11 22', municipality:'ქუთაისი',    region:'იმერეთი',          sector:'განათლება',        nace:'P85.5', registeredDate:'16 აპრ 2022', lastVisit:'25 მარ 2026', status:'active',   score:83, services:['ტრენინგი','კონსულტაცია'],                             note:null },
  { id:11, companyName:'სამი მთა',           type:'ი.პ.',idCode:'206123456', ownerFirstName:'ეკა',     ownerLastName:'სიხარულიძე',  email:'e.sikh@samamtha.ge',      phone:'595 11 22 33', municipality:'მცხეთა',     region:'მცხეთა-მთიანეთი', sector:'ტურიზმი',           nace:'I55.2', registeredDate:'9 ოქტ 2023',  lastVisit:'11 მარ 2026', status:'pending',  score:null,services:['კონსულტაცია'],                                        note:'ელოდება სრეინინგ-კომპანიის დამატებას' },
  { id:12, companyName:'კონსტრუქტი',        type:'შპს', idCode:'206234567', ownerFirstName:'გია',     ownerLastName:'ქობულაძე',    email:'g.kob@konstruqti.ge',     phone:'551 22 33 44', municipality:'რუსთავი',    region:'ქვემო ქართლი',    sector:'სამშენებლო',       nace:'F41.2', registeredDate:'2 მარ 2022',  lastVisit:'18 მარ 2026', status:'active',   score:61, services:['კონსულტაცია','ფინანსური პროგრამა'],                   note:null },
  { id:13, companyName:'სვანეთი ტური',      type:'ი.პ.',idCode:'206345678', ownerFirstName:'მზია',    ownerLastName:'დადიანი',     email:'m.dad@svanetitur.ge',     phone:'599 33 44 55', municipality:'მესტია',     region:'სამეგრელო',        sector:'ტურიზმი',           nace:'I55.1', registeredDate:'30 ივნ 2023', lastVisit:'5 მარ 2026',  status:'active',   score:72, services:['მარკეტინგი','კონსულტაცია'],                           note:null },
  { id:14, companyName:'ახალი ფუძე',        type:'შპს', idCode:'206456789', ownerFirstName:'ბაკური',  ownerLastName:'ცხოვრებაძე',  email:'b.ts@akhalifudze.ge',     phone:'577 44 55 66', municipality:'თბილისი',    region:'თბილისი',          sector:'სამშენებლო',       nace:'F43.1', registeredDate:'17 იან 2024', lastVisit:'21 მარ 2026', status:'pending',  score:null,services:[],                                                     note:null },
  { id:15, companyName:'ტყის პროდუქტი',     type:'სს',  idCode:'206567890', ownerFirstName:'ნათია',   ownerLastName:'ლომიძე',      email:'n.lom@tkisprod.ge',       phone:'595 55 66 77', municipality:'ზუგდიდი',    region:'სამეგრელო',        sector:'სოფლის მეურნეობა', nace:'A02.1', registeredDate:'4 მაი 2021',  lastVisit:'1 მარ 2026',  status:'active',   score:49, services:['ტრენინგი'],                                           note:null },
  { id:16, companyName:'ენერგო გრუპი',      type:'სს',  idCode:'206678901', ownerFirstName:'ლევანი',  ownerLastName:'ზარდიაშვილი', email:'l.zard@energogroup.ge',   phone:'591 66 77 88', municipality:'თბილისი',    region:'თბილისი',          sector:'ენერგეტიკა',       nace:'D35.1', registeredDate:'21 სექ 2022', lastVisit:'15 მარ 2026', status:'active',   score:86, services:['კონსულტაცია','დიაგნოსტიკა','ტრენინგი'],              note:'პარტნიორი ბანკი: TBC' },
  { id:17, companyName:'ფარმა ქართლი',     type:'შპს', idCode:'206789012', ownerFirstName:'ხათუნა',  ownerLastName:'ნარიმანიძე',  email:'kh.nar@pharmakartli.ge',  phone:'568 77 88 99', municipality:'გორი',       region:'შიდა ქართლი',      sector:'ჯანდაცვა',         nace:'Q86.9', registeredDate:'13 ოქტ 2023', lastVisit:null,          status:'inactive', score:29, services:[],                                                     note:'გათიშულია — პასუხი არ არის' },
  { id:18, companyName:'ბიო ვენი',          type:'ი.პ.',idCode:'206890123', ownerFirstName:'ზურაბი',  ownerLastName:'გელაძე',      email:'z.gel@bioveni.ge',        phone:'591 88 99 00', municipality:'ბათუმი',     region:'აჭარა',            sector:'სოფლის მეურნეობა', nace:'A01.1', registeredDate:'6 ივლ 2023',  lastVisit:'8 მარ 2026',  status:'active',   score:58, services:['კონსულტაცია','ფინანსური პროგრამა'],                   note:null },
  { id:19, companyName:'ტექ ჰაბი',          type:'შპს', idCode:'206901234', ownerFirstName:'ლია',     ownerLastName:'ბერიაშვილი',  email:'l.ber@techhub.ge',        phone:'555 99 00 11', municipality:'თბილისი',    region:'თბილისი',          sector:'IT',               nace:'J62.0', registeredDate:'25 თებ 2024', lastVisit:'19 მარ 2026', status:'active',   score:95, services:['დიაგნოსტიკა','კონსულტაცია','ტრენინგი','მარკეტინგი'], note:'საუკეთესო ქულა კვარტალში' },
  { id:20, companyName:'ალის ფარმი',        type:'ი.პ.',idCode:'207012345', ownerFirstName:'სოფო',    ownerLastName:'ჩიქოვანი',    email:'s.chiq@alisfarm.ge',      phone:'551 00 11 22', municipality:'ოზურგეთი',   region:'გურია',            sector:'სოფლის მეურნეობა', nace:'A01.5', registeredDate:'18 მაი 2023', lastVisit:'12 მარ 2026', status:'active',   score:63, services:['ტრენინგი','კონსულტაცია'],                             note:null },
  { id:21, companyName:'სამხრეთის ვენახი',  type:'ი.პ.',idCode:'207123456', ownerFirstName:'გურამ',   ownerLastName:'ავალიანი',    email:'g.aval@samkhreti.ge',     phone:'595 11 33 55', municipality:'ახალციხე',   region:'სამცხე-ჯავახეთი',  sector:'სოფლის მეურნეობა', nace:'A01.2', registeredDate:'3 მარ 2022',  lastVisit:'9 მარ 2026',  status:'active',   score:44, services:['კონსულტაცია'],                                        note:null },
  { id:22, companyName:'დასავლეთის ლოჯი',   type:'შპს', idCode:'207234567', ownerFirstName:'ნინო',    ownerLastName:'მიქელაძე',    email:'n.mik@westernlodge.ge',   phone:'599 22 44 66', municipality:'ხარაგაული',   region:'იმერეთი',          sector:'ტურიზმი',           nace:'I55.2', registeredDate:'14 ივნ 2023', lastVisit:'22 მარ 2026', status:'active',   score:77, services:['მარკეტინგი','ტრენინგი'],                              note:null },
])

// ─── stats ────────────────────────────────────────────
const activeCount  = computed(() => companies.value.filter(c => c.status === 'active').length)
const sectorsCount = computed(() => new Set(companies.value.map(c => c.sector)).size)
const avgScore     = computed(() => {
  const scored = companies.value.filter(c => c.score !== null)
  return scored.length ? Math.round(scored.reduce((s, c) => s + c.score, 0) / scored.length) : '—'
})

// ─── filtering + sorting ──────────────────────────────
const filteredCompanies = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  let list = companies.value.filter(c => {
    const matchQ = !q ||
      c.companyName.toLowerCase().includes(q) ||
      c.idCode.includes(q) ||
      (c.ownerFirstName + ' ' + c.ownerLastName).toLowerCase().includes(q)
    const matchS = !filterSector.value || c.sector  === filterSector.value
    const matchR = !filterRegion.value || c.region  === filterRegion.value
    const matchSt= !filterStatus.value || c.status  === filterStatus.value
    return matchQ && matchS && matchR && matchSt
  })
  const k = sortKey.value
  return [...list].sort((a, b) => {
    const av = a[k] ?? '', bv = b[k] ?? ''
    if (typeof av === 'number') return (av - bv) * sortDir.value
    return String(av).localeCompare(String(bv), 'ka') * sortDir.value
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredCompanies.value.length / PAGE_SIZE)))
const paginatedCompanies = computed(() => {
  const s = (currentPage.value - 1) * PAGE_SIZE
  return filteredCompanies.value.slice(s, s + PAGE_SIZE)
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
const openDrawer  = (c) => { drawerTarget.value = c }
const closeDrawer = ()  => { drawerTarget.value = null }

// ─── CSV ──────────────────────────────────────────────
const downloadCsv = () => {
  const hd = ['კომპანია','ტიპი','ს/კ','მეწარმე','ელ. ფოსტა','ტელეფონი','მუნიციპ.','სექტორი','NACE','რეგიონი','ქულა','სტატუსი']
  const rows = filteredCompanies.value.map(c =>
    [c.companyName, c.type, c.idCode, `${c.ownerFirstName} ${c.ownerLastName}`, c.email, `+995 ${c.phone}`,
     c.municipality, c.sector, c.nace ?? '', c.region, c.score ?? '', statusLabel(c.status)]
      .map(v => `"${v}"`).join(',')
  )
  const blob = new Blob(['\uFEFF' + [hd.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' })
  const a    = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'mewarmetha-baza.csv' })
  a.click()
}
</script>
