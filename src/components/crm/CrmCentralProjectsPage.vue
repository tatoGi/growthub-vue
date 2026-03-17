<template>
  <InnerPageLayout title="პროექტები" breadcrumb="პროექტები">
    <div class="mem-page-bg">
    <div class="container mem-body">

      <!-- Stats -->
      <div class="mem-stats-bar">
        <div class="mem-stat"><strong>{{ projects.length }}</strong><span>სულ</span></div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat"><strong>{{ ongoingCount }}</strong><span>მიმდინარე</span></div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat"><strong>{{ completedCount }}</strong><span>დასრულებული</span></div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat"><strong>{{ totalBudgetFormatted }}</strong><span>სულ ბიუჯეტი ₾</span></div>
        <div class="mem-stats-actions" style="margin-left:auto">
          <button type="button" class="crm-btn-primary emp-add-btn" @click="openAdd">+ პროექტის დამატება</button>
        </div>
      </div>

      <!-- Status tabs -->
      <div class="rep-period-tabs">
        <button v-for="t in statusTabs" :key="t.key" type="button"
          class="rep-period-tab" :class="{active: activeTab===t.key}"
          @click="activeTab=t.key; page=1">
          {{ t.label }}
          <span v-if="tabCounts[t.key]" class="ev-tab-count">{{ tabCounts[t.key] }}</span>
        </button>
      </div>

      <!-- Filters -->
      <div class="mem-filters">
        <div class="mem-search-wrap">
          <svg class="mem-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" class="mem-search-input" v-model="searchQuery" placeholder="პროექტი, კომპანია, ბენეფიციარი..." />
          <button v-if="searchQuery" type="button" class="mem-search-clear" @click="searchQuery=''">✕</button>
        </div>
        <select class="mem-filter-select" v-model="filterField">
          <option value="">ყველა სფერო</option>
          <option v-for="f in fields" :key="f.key" :value="f.key">{{ f.label }}</option>
        </select>
        <button v-if="hasFilters" type="button" class="mem-clear-filters" @click="clearFilters">გასუფთავება</button>
      </div>

      <!-- Empty -->
      <div v-if="filtered.length===0" class="mat-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".25"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <p>პროექტი ვერ მოიძებნა</p>
      </div>

      <!-- Table -->
      <div v-else class="mem-table-wrap">
        <table class="mem-table">
          <thead>
            <tr>
              <th>სფერო</th>
              <th class="mem-th-sortable" @click="toggleSort('name')">პროექტის დასახელება <span class="mem-sort-icon">{{ si('name') }}</span></th>
              <th class="mem-th-sortable" @click="toggleSort('consultingCompany')">საკ. კომპანია <span class="mem-sort-icon">{{ si('consultingCompany') }}</span></th>
              <th class="mem-th-sortable" @click="toggleSort('beneficiary')">ბენეფ. კომპანია <span class="mem-sort-icon">{{ si('beneficiary') }}</span></th>
              <th class="mem-th-sortable" @click="toggleSort('startDate')">დაწყება <span class="mem-sort-icon">{{ si('startDate') }}</span></th>
              <th class="mem-th-sortable" @click="toggleSort('endDate')">დასრულება <span class="mem-sort-icon">{{ si('endDate') }}</span></th>
              <th class="mem-th-sortable" @click="toggleSort('budget')">ბიუჯეტი <span class="mem-sort-icon">{{ si('budget') }}</span></th>
              <th>სტატუსი</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filtered" :key="p.id" class="mem-row" @click="openDetail(p)">
              <td><span class="cons-field-badge" :class="`cons-field-${p.fieldKey}`">{{ p.fieldShort }}</span></td>
              <td class="mem-cell-company">{{ p.name }}</td>
              <td class="mem-cell-muted">{{ p.consultingCompany }}</td>
              <td class="mem-cell-muted">{{ p.beneficiary }}</td>
              <td>
                <div class="rep-date-cell">
                  <span class="rep-date">{{ formatDate(p.startDate) }}</span>
                </div>
              </td>
              <td>
                <div class="rep-date-cell">
                  <span class="rep-date">{{ formatDate(p.endDate) }}</span>
                </div>
              </td>
              <td class="proj-budget-cell">{{ p.budget.toLocaleString() }} ₾</td>
              <td><span class="proj-status-badge" :class="`proj-status-${p.status}`">{{ statusLabel(p.status) }}</span></td>
              <td class="mem-cell-arrow">›</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="members-pagination">
        <button class="members-page-btn" :disabled="page===1" @click="page--">‹</button>
        <template v-for="pg in visiblePages" :key="pg">
          <span v-if="pg==='…'" class="page-ellipsis">…</span>
          <button v-else class="members-page-btn" :class="{active:page===pg}" @click="page=pg">{{ pg }}</button>
        </template>
        <button class="members-page-btn" :disabled="page===totalPages" @click="page++">›</button>
      </div>

    </div>
    </div>

    <!-- Detail drawer -->
    <transition name="drawer">
      <div v-if="detailProj" class="mem-drawer-root" @click.self="detailProj=null">
        <div class="mem-drawer">
          <div class="mem-drawer-head">
            <div class="co-drawer-logo" style="background:#f0fdf4;color:#16a34a">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div style="flex:1;min-width:0">
              <div class="mem-drawer-name">{{ detailProj.name }}</div>
              <div class="mem-drawer-sub">{{ detailProj.field }} · {{ detailProj.contractNum }}</div>
            </div>
            <button type="button" class="mem-drawer-close" @click="detailProj=null">✕</button>
          </div>
          <div class="mem-drawer-body">
            <div class="co-drawer-metrics" style="grid-template-columns:repeat(3,1fr)">
              <div class="co-metric-card">
                <span class="co-metric-label">სტატუსი</span>
                <span class="proj-status-badge" :class="`proj-status-${detailProj.status}`">{{ statusLabel(detailProj.status) }}</span>
              </div>
              <div class="co-metric-card">
                <span class="co-metric-label">ბიუჯეტი</span>
                <span class="co-metric-value">{{ detailProj.budget.toLocaleString() }} ₾</span>
              </div>
              <div class="co-metric-card">
                <span class="co-metric-label">სააგენტო</span>
                <span class="co-metric-value">{{ detailProj.agencyFunding.toLocaleString() }} ₾</span>
              </div>
            </div>

            <div class="mem-drawer-section-title" style="margin-top:1.25rem">პროექტის ინფორმაცია</div>
            <div class="co-info-list">
              <div class="co-info-row"><span>ხელშ. ნომერი</span><strong>{{ detailProj.contractNum }}</strong></div>
              <div class="co-info-row"><span>სფერო</span><span class="cons-field-badge" :class="`cons-field-${detailProj.fieldKey}`">{{ detailProj.field }}</span></div>
              <div class="co-info-row"><span>საკ. კომპანია</span><strong>{{ detailProj.consultingCompany }}</strong></div>
              <div class="co-info-row"><span>ბენეფიციარი</span><strong>{{ detailProj.beneficiary }}</strong></div>
              <div class="co-info-row"><span>დაწყება</span><strong>{{ formatDate(detailProj.startDate) }}</strong></div>
              <div class="co-info-row"><span>დასრულება</span><strong>{{ formatDate(detailProj.endDate) }}</strong></div>
            </div>

            <div class="mem-drawer-section-title" style="margin-top:1.25rem">ბიუჯეტი</div>
            <div class="co-info-list">
              <div class="co-info-row"><span>ჯამური ბიუჯეტი</span><strong>{{ detailProj.budget.toLocaleString() }} ₾</strong></div>
              <div class="co-info-row"><span>სააგენტოს დაფინ.</span><strong>{{ detailProj.agencyFunding.toLocaleString() }} ₾</strong></div>
              <div class="co-info-row"><span>ბენეფ. თანამონ.</span><strong>{{ detailProj.benContribution.toLocaleString() }} ₾</strong></div>
            </div>

            <div class="mem-drawer-section-title" style="margin-top:1.25rem">დოკუმენტები</div>
            <div class="proj-doc-list">
              <div class="proj-doc-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span>სამმხრივი ხელშეკრულება</span>
                <span class="proj-doc-status" :class="detailProj.docs.tripartite?'proj-doc-yes':'proj-doc-no'">{{ detailProj.docs.tripartite?'ატვირთულია':'არ არის' }}</span>
              </div>
              <div class="proj-doc-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span>სამუშაოს დასრ. რეპორტი</span>
                <span class="proj-doc-status" :class="detailProj.docs.completionReport?'proj-doc-yes':'proj-doc-no'">{{ detailProj.docs.completionReport?'ატვირთულია':'არ არის' }}</span>
              </div>
              <div class="proj-doc-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span>მიღება-ჩაბარების აქტი</span>
                <span class="proj-doc-status" :class="detailProj.docs.acceptanceAct?'proj-doc-yes':'proj-doc-no'">{{ detailProj.docs.acceptanceAct?'ატვირთულია':'არ არის' }}</span>
              </div>
              <div class="proj-doc-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span>რეპორტი 6 თვ. შემდეგ</span>
                <span class="proj-doc-status" :class="detailProj.docs.report6m?'proj-doc-yes':'proj-doc-no'">{{ detailProj.docs.report6m?'ატვირთულია':'არ არის' }}</span>
              </div>
              <div class="proj-doc-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span>გადახდის დამ. დოკ.</span>
                <span class="proj-doc-status" :class="detailProj.docs.paymentProof?'proj-doc-yes':'proj-doc-no'">{{ detailProj.docs.paymentProof?'ატვირთულია':'არ არის' }}</span>
              </div>
            </div>
          </div>
          <div class="mem-drawer-footer">
            <button type="button" class="crm-btn-secondary" @click="detailProj=null">დახურვა</button>
            <button type="button" class="crm-btn-primary" @click="editFromDetail">რედაქტირება</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Add / Edit drawer -->
    <transition name="drawer">
      <div v-if="formOpen" class="mem-drawer-root" @click.self="formOpen=false">
        <div class="mem-drawer">
          <div class="mem-drawer-head">
            <div class="co-drawer-logo" style="background:#f0fdf4;color:#16a34a">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div>
              <div class="mem-drawer-name">{{ formTarget ? 'პროექტის რედაქტირება' : 'ახალი პროექტი' }}</div>
              <div class="mem-drawer-sub">{{ form.name || 'პროექტის სახელი' }}</div>
            </div>
            <button type="button" class="mem-drawer-close" @click="formOpen=false">✕</button>
          </div>
          <div class="mem-drawer-body">
            <div class="mem-drawer-section-title">ძირითადი ინფორმაცია</div>
            <div class="crm-form-grid">
              <div class="crm-field" style="grid-column:1/-1">
                <label>პროექტის დასახელება</label>
                <input type="text" v-model="form.name" placeholder="მაქს. 50 სიმბოლო" maxlength="50" />
              </div>
              <div class="crm-field">
                <label>სფერო</label>
                <select v-model="form.fieldKey" @change="onFieldChange">
                  <option value="">— აირჩიეთ —</option>
                  <option v-for="f in fields" :key="f.key" :value="f.key">{{ f.label }}</option>
                </select>
              </div>
              <div class="crm-field">
                <label>ხელშეკრულების ნომერი</label>
                <input type="text" v-model="form.contractNum" placeholder="CON-2024-XXX" />
              </div>
              <div class="crm-field" style="grid-column:1/-1">
                <label>საკონსულტაციო კომპანია</label>
                <input type="text" v-model="form.consultingCompany" placeholder="კომპანიის სახელი" />
              </div>
              <div class="crm-field" style="grid-column:1/-1">
                <label>ბენეფიციარი კომპანია</label>
                <input type="text" v-model="form.beneficiary" placeholder="კომპანიის სახელი" />
              </div>
              <div class="crm-field">
                <label>დაწყების თარიღი</label>
                <input type="date" v-model="form.startDate" />
              </div>
              <div class="crm-field">
                <label>დასრულების თარიღი</label>
                <input type="date" v-model="form.endDate" />
              </div>
              <div class="crm-field">
                <label>სტატუსი</label>
                <select v-model="form.status">
                  <option value="ongoing">მიმდინარე</option>
                  <option value="completed">დასრულებული</option>
                  <option value="enrolled">ჩარიცხული</option>
                  <option value="cancelled">გაუქმებული</option>
                </select>
              </div>
            </div>

            <div class="mem-drawer-section-title" style="margin-top:1.5rem">ბიუჯეტი</div>
            <div class="crm-form-grid">
              <div class="crm-field">
                <label>ჯამური ბიუჯეტი (₾)</label>
                <input type="number" v-model.number="form.budget" min="0" />
              </div>
              <div class="crm-field">
                <label>სააგენტოს დაფინ. (₾)</label>
                <input type="number" v-model.number="form.agencyFunding" min="0" />
              </div>
              <div class="crm-field">
                <label>ბენეფ. თანამონ. (₾)</label>
                <input type="number" v-model.number="form.benContribution" min="0" />
              </div>
            </div>

            <div v-if="formError" class="cp-error-msg" style="margin-top:1rem">{{ formError }}</div>
            <div v-if="formSaved" class="cp-success-banner" style="margin-top:1rem">{{ formTarget ? 'ცვლილებები შენახულია' : 'პროექტი დამატებულია' }}</div>
          </div>
          <div class="mem-drawer-footer">
            <button type="button" class="crm-btn-secondary" @click="formOpen=false">გაუქმება</button>
            <button type="button" class="crm-btn-primary" @click="saveProject">შენახვა</button>
          </div>
        </div>
      </div>
    </transition>

  </InnerPageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import InnerPageLayout from '../website/shared/InnerPageLayout.vue'

const PER_PAGE = 10

const searchQuery = ref('')
const filterField = ref('')
const activeTab   = ref('all')
const sortKey     = ref('startDate')
const sortDir     = ref(-1)
const page        = ref(1)
const detailProj  = ref(null)
const formOpen    = ref(false)
const formTarget  = ref(null)
const formError   = ref('')
const formSaved   = ref(false)

const fields = [
  { key:'sales',   label:'გაყიდვები და მარკეტინგი',                   short:'გაყიდვები' },
  { key:'tax',     label:'საგადასახადო საკითხები',                    short:'გადასახ.' },
  { key:'finance', label:'ფინანსები და ბუღალტერია',                   short:'ფინანსები' },
  { key:'legal',   label:'იურიდიული საკითხები',                       short:'იურიდიული' },
  { key:'digital', label:'გაციფრულება',                               short:'ციფრული' },
  { key:'biz',     label:'ბიზნეს მოდელირება და სტრატეგიული დაგეგმვა', short:'ბიზნეს სტრ.' },
  { key:'other',   label:'სხვა',                                       short:'სხვა' },
]

const statusTabs = [
  { key:'all',       label:'ყველა' },
  { key:'ongoing',   label:'მიმდინარე' },
  { key:'completed', label:'დასრულებული' },
  { key:'enrolled',  label:'ჩარიცხული' },
  { key:'cancelled', label:'გაუქმებული' },
]

const blankForm = () => ({
  name:'', fieldKey:'', field:'', fieldShort:'', contractNum:'',
  consultingCompany:'', beneficiary:'',
  startDate:'', endDate:'', status:'ongoing',
  budget:0, agencyFunding:0, benContribution:0,
  docs:{ tripartite:false, completionReport:false, acceptanceAct:false, report6m:false, paymentProof:false },
})
const form = ref(blankForm())

const projects = ref([
  { id:1,  name:'ბიზნეს ტრანსფორმაცია',           fieldKey:'biz',     field:'ბიზნეს მოდელირება', fieldShort:'ბიზნეს სტრ.',  contractNum:'CON-2024-001', consultingCompany:'GrowthPoint Advisory',  beneficiary:'ლიდერ შპს',            startDate:'2024-03-01', endDate:'2024-08-31', budget:45000,  agencyFunding:25000, benContribution:20000, status:'completed', docs:{tripartite:true,  completionReport:true,  acceptanceAct:true,  report6m:true,  paymentProof:true}  },
  { id:2,  name:'ციფრული მარკეტინგი',              fieldKey:'digital', field:'გაციფრულება',        fieldShort:'ციფრული',      contractNum:'CON-2024-002', consultingCompany:'DigitalEdge',          beneficiary:'ალფა ი.პ.',            startDate:'2024-05-15', endDate:'2024-11-15', budget:32000,  agencyFunding:18000, benContribution:14000, status:'completed', docs:{tripartite:true,  completionReport:true,  acceptanceAct:true,  report6m:false, paymentProof:true}  },
  { id:3,  name:'გაყიდვების სისტემის გაუმჯობ.',    fieldKey:'sales',   field:'გაყიდვები',          fieldShort:'გაყიდვები',    contractNum:'CON-2024-003', consultingCompany:'MarketWise',           beneficiary:'ნოვა სს',              startDate:'2024-06-01', endDate:'2024-12-01', budget:28000,  agencyFunding:15000, benContribution:13000, status:'completed', docs:{tripartite:true,  completionReport:true,  acceptanceAct:false, report6m:false, paymentProof:true}  },
  { id:4,  name:'ფინანსური მართვა',                fieldKey:'finance', field:'ფინანსები',           fieldShort:'ფინანსები',    contractNum:'CON-2024-004', consultingCompany:'FinStar Consulting',   beneficiary:'მზე შპს',              startDate:'2024-07-01', endDate:'2025-01-01', budget:38000,  agencyFunding:20000, benContribution:18000, status:'ongoing',   docs:{tripartite:true,  completionReport:false, acceptanceAct:false, report6m:false, paymentProof:false} },
  { id:5,  name:'სამართლებრივი შეფასება',          fieldKey:'legal',   field:'იურიდიული',          fieldShort:'იურიდიული',    contractNum:'CON-2024-005', consultingCompany:'LexGroup Georgia',     beneficiary:'გამარჯვება შპს',       startDate:'2024-08-01', endDate:'2025-02-01', budget:22000,  agencyFunding:12000, benContribution:10000, status:'ongoing',   docs:{tripartite:true,  completionReport:false, acceptanceAct:false, report6m:false, paymentProof:true}  },
  { id:6,  name:'საგადასახადო ოპტიმიზაცია',       fieldKey:'tax',     field:'გადასახადები',       fieldShort:'გადასახ.',     contractNum:'CON-2024-006', consultingCompany:'TaxPro Consulting',    beneficiary:'ბეთა ი.პ.',            startDate:'2024-09-01', endDate:'2025-03-01', budget:25000,  agencyFunding:14000, benContribution:11000, status:'ongoing',   docs:{tripartite:true,  completionReport:false, acceptanceAct:false, report6m:false, paymentProof:false} },
  { id:7,  name:'ექსპორტის სტრატეგია',             fieldKey:'sales',   field:'გაყიდვები',          fieldShort:'გაყიდვები',    contractNum:'CON-2024-007', consultingCompany:'SalesBoost Partners',  beneficiary:'ქართლი შპს',           startDate:'2024-09-15', endDate:'2025-03-15', budget:42000,  agencyFunding:23000, benContribution:19000, status:'ongoing',   docs:{tripartite:true,  completionReport:false, acceptanceAct:false, report6m:false, paymentProof:true}  },
  { id:8,  name:'ბიზნეს პროცესების ავტომ.',        fieldKey:'digital', field:'გაციფრულება',        fieldShort:'ციფრული',      contractNum:'CON-2024-008', consultingCompany:'DigitalPro Georgia',   beneficiary:'ახალი ალქიმია შპს',    startDate:'2024-10-01', endDate:'2025-04-01', budget:55000,  agencyFunding:30000, benContribution:25000, status:'enrolled',  docs:{tripartite:false, completionReport:false, acceptanceAct:false, report6m:false, paymentProof:false} },
  { id:9,  name:'სტრატეგიული დაგეგმვა',            fieldKey:'biz',     field:'ბიზნეს მოდელირება', fieldShort:'ბიზნეს სტრ.',  contractNum:'CON-2024-009', consultingCompany:'Strategic Partners GE', beneficiary:'ინოვა სს',             startDate:'2024-10-15', endDate:'2025-04-15', budget:48000,  agencyFunding:26000, benContribution:22000, status:'enrolled',  docs:{tripartite:false, completionReport:false, acceptanceAct:false, report6m:false, paymentProof:false} },
  { id:10, name:'HR სისტემის განვითარება',          fieldKey:'other',   field:'სხვა',               fieldShort:'სხვა',         contractNum:'CON-2024-010', consultingCompany:'AgroConsult Georgia',  beneficiary:'ველი შპს',             startDate:'2024-11-01', endDate:'2025-05-01', budget:30000,  agencyFunding:16000, benContribution:14000, status:'enrolled',  docs:{tripartite:false, completionReport:false, acceptanceAct:false, report6m:false, paymentProof:false} },
  { id:11, name:'ბაზრის შეფასება',                 fieldKey:'sales',   field:'გაყიდვები',          fieldShort:'გაყიდვები',    contractNum:'CON-2024-011', consultingCompany:'MarketWise',           beneficiary:'პლატინი ი.პ.',         startDate:'2023-11-01', endDate:'2024-05-01', budget:20000,  agencyFunding:11000, benContribution:9000,  status:'completed', docs:{tripartite:true,  completionReport:true,  acceptanceAct:true,  report6m:true,  paymentProof:true}  },
  { id:12, name:'საფინანსო ანგარიშგება',           fieldKey:'finance', field:'ფინანსები',           fieldShort:'ფინანსები',    contractNum:'CON-2023-012', consultingCompany:'BudgetMasters',        beneficiary:'სინათლე შპს',          startDate:'2023-09-01', endDate:'2024-03-01', budget:18000,  agencyFunding:10000, benContribution:8000,  status:'completed', docs:{tripartite:true,  completionReport:true,  acceptanceAct:true,  report6m:true,  paymentProof:true}  },
  { id:13, name:'E-commerce პლატფ. შექმნა',        fieldKey:'digital', field:'გაციფრულება',        fieldShort:'ციფრული',      contractNum:'CON-2023-013', consultingCompany:'DigitalEdge',          beneficiary:'მზიური ი.პ.',          startDate:'2023-10-01', endDate:'2024-04-01', budget:60000,  agencyFunding:33000, benContribution:27000, status:'completed', docs:{tripartite:true,  completionReport:true,  acceptanceAct:true,  report6m:false, paymentProof:true}  },
  { id:14, name:'საგადასახადო სტრატეგია',          fieldKey:'tax',     field:'გადასახადები',       fieldShort:'გადასახ.',     contractNum:'CON-2024-014', consultingCompany:'TaxPro Consulting',    beneficiary:'გაზაფხული შპს',        startDate:'2024-04-01', endDate:'2024-09-30', budget:15000,  agencyFunding:8000,  benContribution:7000,  status:'cancelled', docs:{tripartite:true,  completionReport:false, acceptanceAct:false, report6m:false, paymentProof:false} },
  { id:15, name:'იურ. დოკუმენტაციის გაუმ.',        fieldKey:'legal',   field:'იურიდიული',          fieldShort:'იურიდიული',    contractNum:'CON-2024-015', consultingCompany:'LegalAid Partners',    beneficiary:'ჰელიო შპს',            startDate:'2024-02-01', endDate:'2024-07-31', budget:17000,  agencyFunding:9000,  benContribution:8000,  status:'cancelled', docs:{tripartite:false, completionReport:false, acceptanceAct:false, report6m:false, paymentProof:false} },
])

let nextId = 16

const ongoingCount   = computed(() => projects.value.filter(p => p.status==='ongoing').length)
const completedCount = computed(() => projects.value.filter(p => p.status==='completed').length)
const totalBudgetFormatted = computed(() => {
  const sum = projects.value.reduce((s,p) => s+p.budget, 0)
  return sum >= 1000000 ? (sum/1000000).toFixed(1)+'M' : sum >= 1000 ? (sum/1000).toFixed(0)+'K' : sum
})

const tabCounts = computed(() => {
  const c = {}
  statusTabs.forEach(t => { c[t.key] = t.key==='all' ? projects.value.length : projects.value.filter(p=>p.status===t.key).length })
  return c
})

const hasFilters = computed(() => searchQuery.value || filterField.value)
const clearFilters = () => { searchQuery.value=''; filterField.value='' }

const allFiltered = computed(() => {
  let list = projects.value
  if (activeTab.value !== 'all') list = list.filter(p => p.status === activeTab.value)
  const q = searchQuery.value.toLowerCase()
  if (q) list = list.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.consultingCompany.toLowerCase().includes(q) ||
    p.beneficiary.toLowerCase().includes(q) ||
    p.contractNum.toLowerCase().includes(q)
  )
  if (filterField.value) list = list.filter(p => p.fieldKey === filterField.value)
  return [...list].sort((a,b) => {
    const av = a[sortKey.value] ?? '', bv = b[sortKey.value] ?? ''
    return av < bv ? -sortDir.value : av > bv ? sortDir.value : 0
  })
})
const totalPages = computed(() => Math.max(1, Math.ceil(allFiltered.value.length / PER_PAGE)))
const filtered   = computed(() => allFiltered.value.slice((page.value-1)*PER_PAGE, page.value*PER_PAGE))

const visiblePages = computed(() => {
  const t = totalPages.value, p = page.value, pages = []
  for (let i=1;i<=t;i++) { if(i===1||i===t||Math.abs(i-p)<=1) pages.push(i); else if(pages[pages.length-1]!=='…') pages.push('…') }
  return pages
})

const toggleSort = (key) => {
  if (sortKey.value===key) sortDir.value *= -1
  else { sortKey.value=key; sortDir.value=1 }
  page.value=1
}
const si = (key) => sortKey.value===key ? (sortDir.value===1?'↑':'↓') : '↕'

const statusLabel = (s) => ({ ongoing:'მიმდინარე', completed:'დასრულებული', enrolled:'ჩარიცხული', cancelled:'გაუქმებული' })[s] || s

const formatDate = (d) => {
  if (!d) return '—'
  const [y,m,dd] = d.split('-')
  const months = ['იან','თებ','მარ','აპრ','მაი','ივნ','ივლ','აგვ','სექ','ოქტ','ნოე','დეკ']
  return `${parseInt(dd)} ${months[parseInt(m)-1]} ${y}`
}

const openDetail = (p) => { detailProj.value = p }
const editFromDetail = () => {
  const p = detailProj.value
  Object.assign(form.value, { ...p })
  formTarget.value = p
  detailProj.value = null
  formOpen.value = true
  formError.value = ''; formSaved.value = false
}
const openAdd = () => {
  form.value = blankForm()
  formTarget.value = null
  formOpen.value = true
  formError.value = ''; formSaved.value = false
}
const onFieldChange = () => {
  const f = fields.find(f => f.key===form.value.fieldKey)
  if (f) { form.value.field = f.label; form.value.fieldShort = f.short }
}
const saveProject = () => {
  if (!form.value.name.trim())          { formError.value='პროექტის სახელი სავალდებულოა'; return }
  if (!form.value.consultingCompany)    { formError.value='საკ. კომპანია სავალდებულოა'; return }
  if (!form.value.beneficiary)          { formError.value='ბენეფიციარი სავალდებულოა'; return }
  formError.value = ''
  if (formTarget.value) {
    Object.assign(formTarget.value, { ...form.value })
  } else {
    projects.value.unshift({ id: nextId++, ...form.value })
  }
  formSaved.value = true
  setTimeout(() => { formOpen.value=false; formSaved.value=false }, 900)
}
</script>
