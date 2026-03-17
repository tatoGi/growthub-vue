<template>
  <InnerPageLayout title="საკონსულტაციო ორგანიზაციები" breadcrumb="საკონსულტაციო ორგანიზაციები">
    <div class="mem-page-bg">
    <div class="container mem-body">

      <!-- Stats -->
      <div class="mem-stats-bar">
        <div class="mem-stat"><strong>{{ companies.length }}</strong><span>სულ</span></div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat"><strong>{{ activeCount }}</strong><span>აქტიური</span></div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat"><strong>{{ uniqueFields }}</strong><span>მიმართულება</span></div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat"><strong>{{ totalProjects }}</strong><span>სულ პროექტი</span></div>
        <div class="mem-stats-actions" style="margin-left:auto">
          <button type="button" class="crm-btn-primary emp-add-btn" @click="openAdd">+ ორგანიზაციის დამატება</button>
        </div>
      </div>

      <!-- Filters -->
      <div class="mem-filters">
        <div class="mem-search-wrap">
          <svg class="mem-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" class="mem-search-input" v-model="searchQuery" placeholder="ორგანიზაცია, საკონტაქტო, ID კოდი..." />
          <button v-if="searchQuery" type="button" class="mem-search-clear" @click="searchQuery=''">✕</button>
        </div>
        <select class="mem-filter-select" v-model="filterField">
          <option value="">ყველა მიმართულება</option>
          <option v-for="f in fields" :key="f.key" :value="f.key">{{ f.label }}</option>
        </select>
        <select class="mem-filter-select" v-model="filterRegion">
          <option value="">ყველა რეგიონი</option>
          <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
        </select>
        <select class="mem-filter-select" v-model="filterStatus">
          <option value="">ყველა სტატუსი</option>
          <option value="active">აქტიური</option>
          <option value="pending">განხილვაში</option>
          <option value="inactive">არააქტიური</option>
        </select>
        <button v-if="hasFilters" type="button" class="mem-clear-filters" @click="clearFilters">გასუფთავება</button>
      </div>

      <!-- Empty -->
      <div v-if="filtered.length===0" class="mat-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".25"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
        <p>ორგანიზაცია ვერ მოიძებნა</p>
      </div>

      <!-- Table -->
      <div v-else class="mem-table-wrap">
        <table class="mem-table">
          <thead>
            <tr>
              <th class="mem-th-sortable" @click="toggleSort('name')">კომპანია <span class="mem-sort-icon">{{ si('name') }}</span></th>
              <th>საკონტაქტო პირი</th>
              <th>ტელეფონი</th>
              <th class="mem-th-sortable" @click="toggleSort('field')">სფერო <span class="mem-sort-icon">{{ si('field') }}</span></th>
              <th class="mem-th-sortable" @click="toggleSort('region')">რეგიონი <span class="mem-sort-icon">{{ si('region') }}</span></th>
              <th class="mem-th-sortable" @click="toggleSort('experience')">გამოცდ. <span class="mem-sort-icon">{{ si('experience') }}</span></th>
              <th>სტატუსი</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in filtered" :key="c.id" class="mem-row" @click="openDetail(c)">
              <td>
                <div class="emp-name">
                  <div class="mem-avatar" :class="`cons-avatar-${c.fieldKey}`">{{ c.name.slice(0,2).toUpperCase() }}</div>
                  <div>
                    <div style="font-weight:700;font-size:.875rem">{{ c.name }}</div>
                    <div class="mem-cell-muted" style="font-size:.75rem">{{ c.idCode }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div style="font-size:.82rem;font-weight:600">{{ c.contactFirst }} {{ c.contactLast }}</div>
                <div class="mem-cell-muted" style="font-size:.75rem">{{ c.position }}</div>
              </td>
              <td class="mem-cell-muted">{{ c.phone }}</td>
              <td><span class="cons-field-badge" :class="`cons-field-${c.fieldKey}`">{{ c.fieldShort }}</span></td>
              <td class="mem-cell-muted">{{ c.region }}</td>
              <td style="font-weight:700;text-align:center">{{ c.experience }}წ.</td>
              <td><span class="co-status-badge" :class="`co-status-${c.status}`">{{ statusLabel(c.status) }}</span></td>
              <td class="mem-cell-arrow">›</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="members-pagination">
        <button class="members-page-btn" :disabled="page===1" @click="page--">‹</button>
        <template v-for="p in visiblePages" :key="p">
          <span v-if="p==='…'" class="page-ellipsis">…</span>
          <button v-else class="members-page-btn" :class="{active:page===p}" @click="page=p">{{ p }}</button>
        </template>
        <button class="members-page-btn" :disabled="page===totalPages" @click="page++">›</button>
      </div>

    </div>
    </div>

    <!-- Detail drawer -->
    <transition name="drawer">
      <div v-if="detailCo" class="mem-drawer-root" @click.self="detailCo=null">
        <div class="mem-drawer">
          <div class="mem-drawer-head">
            <div class="co-drawer-logo" :class="`cons-logo-${detailCo.fieldKey}`">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
            </div>
            <div style="flex:1;min-width:0">
              <div class="mem-drawer-name">{{ detailCo.name }}</div>
              <div class="mem-drawer-sub">{{ detailCo.field }} · {{ detailCo.region }}</div>
            </div>
            <button type="button" class="mem-drawer-close" @click="detailCo=null">✕</button>
          </div>
          <div class="mem-drawer-body">
            <div class="co-drawer-metrics" style="grid-template-columns:repeat(3,1fr)">
              <div class="co-metric-card">
                <span class="co-metric-label">გამოცდილება</span>
                <span class="co-metric-value">{{ detailCo.experience }} წელი</span>
              </div>
              <div class="co-metric-card">
                <span class="co-metric-label">სტატუსი</span>
                <span class="co-status-badge" :class="`co-status-${detailCo.status}`">{{ statusLabel(detailCo.status) }}</span>
              </div>
              <div class="co-metric-card">
                <span class="co-metric-label">სულ პროექტი</span>
                <span class="co-metric-value">{{ detailCo.projectsMicro + detailCo.projectsSmall + detailCo.projectsMid }}</span>
              </div>
            </div>

            <div class="mem-drawer-section-title" style="margin-top:1.25rem">კომპანიის ინფორმაცია</div>
            <div class="co-info-list">
              <div class="co-info-row"><span>ID კოდი</span><strong>{{ detailCo.idCode }}</strong></div>
              <div class="co-info-row"><span>ვებ-გვერდი</span><strong>{{ detailCo.website || '—' }}</strong></div>
              <div class="co-info-row"><span>სფერო</span><span class="cons-field-badge" :class="`cons-field-${detailCo.fieldKey}`">{{ detailCo.field }}</span></div>
              <div class="co-info-row"><span>რეგიონი</span><strong>{{ detailCo.region }}</strong></div>
            </div>

            <div class="mem-drawer-section-title" style="margin-top:1.25rem">საკონტაქტო პირი</div>
            <div class="co-info-list">
              <div class="co-info-row"><span>სახელი გვარი</span><strong>{{ detailCo.contactFirst }} {{ detailCo.contactLast }}</strong></div>
              <div class="co-info-row"><span>პოზიცია</span><strong>{{ detailCo.position }}</strong></div>
              <div class="co-info-row"><span>ტელეფონი</span><strong>{{ detailCo.phone }}</strong></div>
              <div class="co-info-row"><span>ელ. ფოსტა</span><strong>{{ detailCo.email }}</strong></div>
            </div>

            <div class="mem-drawer-section-title" style="margin-top:1.25rem">ინდუსტრიები და პროექტები</div>
            <div class="co-info-list">
              <div class="co-info-row" v-if="detailCo.ind1"><span>ინდუსტრია 1</span><strong>{{ detailCo.ind1 }}</strong></div>
              <div class="co-info-row" v-if="detailCo.ind2"><span>ინდუსტრია 2</span><strong>{{ detailCo.ind2 }}</strong></div>
              <div class="co-info-row" v-if="detailCo.ind3"><span>ინდუსტრია 3</span><strong>{{ detailCo.ind3 }}</strong></div>
              <div class="co-info-row"><span>მიკრო</span><strong>{{ detailCo.projectsMicro }}</strong></div>
              <div class="co-info-row"><span>მცირე</span><strong>{{ detailCo.projectsSmall }}</strong></div>
              <div class="co-info-row"><span>საშუალო</span><strong>{{ detailCo.projectsMid }}</strong></div>
            </div>
          </div>
          <div class="mem-drawer-footer">
            <button type="button" class="crm-btn-secondary" @click="detailCo=null">დახურვა</button>
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
            <div class="co-drawer-logo" :class="`cons-logo-${form.fieldKey||'other'}`">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
            </div>
            <div>
              <div class="mem-drawer-name">{{ formTarget ? 'ორგანიზაციის რედაქტირება' : 'ახალი ორგანიზაცია' }}</div>
              <div class="mem-drawer-sub">{{ form.name || 'კომპანიის სახელი' }}</div>
            </div>
            <button type="button" class="mem-drawer-close" @click="formOpen=false">✕</button>
          </div>
          <div class="mem-drawer-body">
            <div class="mem-drawer-section-title">კომპანიის ინფორმაცია</div>
            <div class="crm-form-grid">
              <div class="crm-field" style="grid-column:1/-1">
                <label>კომპანიის სახელი</label>
                <input type="text" v-model="form.name" placeholder="კომპანიის სრული დასახელება" />
              </div>
              <div class="crm-field">
                <label>საიდენტიფიკაციო კოდი</label>
                <input type="text" v-model="form.idCode" placeholder="9-ნიშნა კოდი" />
              </div>
              <div class="crm-field">
                <label>ვებ-გვერდი</label>
                <input type="text" v-model="form.website" placeholder="example.ge" />
              </div>
              <div class="crm-field">
                <label>სფერო</label>
                <select v-model="form.fieldKey" @change="onFieldChange">
                  <option value="">— აირჩიეთ —</option>
                  <option v-for="f in fields" :key="f.key" :value="f.key">{{ f.label }}</option>
                </select>
              </div>
              <div class="crm-field">
                <label>რეგიონი</label>
                <select v-model="form.region">
                  <option value="">— აირჩიეთ —</option>
                  <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
                </select>
              </div>
              <div class="crm-field">
                <label>სამუშაო გამოცდილება (წელი)</label>
                <input type="number" v-model.number="form.experience" min="0" max="50" />
              </div>
              <div class="crm-field">
                <label>სტატუსი</label>
                <select v-model="form.status">
                  <option value="active">აქტიური</option>
                  <option value="pending">განხილვაში</option>
                  <option value="inactive">არააქტიური</option>
                </select>
              </div>
            </div>

            <div class="mem-drawer-section-title" style="margin-top:1.5rem">საკონტაქტო პირი</div>
            <div class="crm-form-grid">
              <div class="crm-field">
                <label>სახელი</label>
                <input type="text" v-model="form.contactFirst" />
              </div>
              <div class="crm-field">
                <label>გვარი</label>
                <input type="text" v-model="form.contactLast" />
              </div>
              <div class="crm-field">
                <label>პოზიცია</label>
                <input type="text" v-model="form.position" />
              </div>
              <div class="crm-field">
                <label>ტელეფონი</label>
                <input type="text" v-model="form.phone" placeholder="5XX XXX XXX" />
              </div>
              <div class="crm-field" style="grid-column:1/-1">
                <label>ელ. ფოსტა</label>
                <input type="email" v-model="form.email" />
              </div>
            </div>

            <div class="mem-drawer-section-title" style="margin-top:1.5rem">ინდუსტრიები</div>
            <div class="crm-form-grid">
              <div class="crm-field">
                <label>ინდუსტრია 1</label>
                <select v-model="form.ind1">
                  <option value="">— აირჩიეთ —</option>
                  <option v-for="i in industries" :key="i" :value="i">{{ i }}</option>
                </select>
              </div>
              <div class="crm-field">
                <label>ინდუსტრია 2</label>
                <select v-model="form.ind2">
                  <option value="">— —</option>
                  <option v-for="i in industries" :key="i" :value="i">{{ i }}</option>
                </select>
              </div>
              <div class="crm-field">
                <label>ინდუსტრია 3</label>
                <select v-model="form.ind3">
                  <option value="">— —</option>
                  <option v-for="i in industries" :key="i" :value="i">{{ i }}</option>
                </select>
              </div>
              <div class="crm-field">
                <label>მიკრო პროექტები</label>
                <input type="number" v-model.number="form.projectsMicro" min="0" />
              </div>
              <div class="crm-field">
                <label>მცირე პროექტები</label>
                <input type="number" v-model.number="form.projectsSmall" min="0" />
              </div>
              <div class="crm-field">
                <label>საშუალო პროექტები</label>
                <input type="number" v-model.number="form.projectsMid" min="0" />
              </div>
            </div>

            <div v-if="formError" class="cp-error-msg" style="margin-top:1rem">{{ formError }}</div>
            <div v-if="formSaved" class="cp-success-banner" style="margin-top:1rem">{{ formTarget ? 'ცვლილებები შენახულია' : 'ორგანიზაცია დამატებულია' }}</div>
          </div>
          <div class="mem-drawer-footer">
            <button type="button" class="crm-btn-secondary" @click="formOpen=false">გაუქმება</button>
            <button type="button" class="crm-btn-primary" @click="saveCompany">შენახვა</button>
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

const searchQuery  = ref('')
const filterField  = ref('')
const filterRegion = ref('')
const filterStatus = ref('')
const sortKey      = ref('name')
const sortDir      = ref(1)
const page         = ref(1)
const detailCo     = ref(null)
const formOpen     = ref(false)
const formTarget   = ref(null)
const formError    = ref('')
const formSaved    = ref(false)

const fields = [
  { key:'sales',   label:'გაყიდვები და მარკეტინგი',                   short:'გაყიდვები' },
  { key:'tax',     label:'გადასახადები',                               short:'გადასახადები' },
  { key:'finance', label:'ფინანსები და ბუღალტერია',                   short:'ფინანსები' },
  { key:'legal',   label:'იურიდიული საკითხები',                       short:'იურიდიული' },
  { key:'digital', label:'გაციფრულება',                               short:'ციფრული' },
  { key:'biz',     label:'ბიზნეს მოდელირება და სტრატეგიული დაგეგმვა', short:'ბიზნეს სტრატ.' },
  { key:'other',   label:'სხვა',                                       short:'სხვა' },
]
const regions = ['თბილისი','ქუთაისი','ბათუმი','რუსთავი','გორი','ზუგდიდი','ახალციხე','თელავი','ამბროლაური','ოზურგეთი']
const industries = ['ვაჭრობა','წარმოება','მომსახურება','ტექნოლოგია','ტურიზმი','სოფლის მეურნეობა','ექსპორტი','ენერგეტიკა','ჯანდაცვა','განათლება']

const blankForm = () => ({
  name:'', idCode:'', website:'', fieldKey:'', field:'', fieldShort:'',
  region:'', experience:0, status:'active',
  contactFirst:'', contactLast:'', position:'', phone:'', email:'',
  ind1:'', ind2:'', ind3:'', projectsMicro:0, projectsSmall:0, projectsMid:0,
})

const form = ref(blankForm())

const companies = ref([
  { id:1,  name:'GrowthPoint Advisory',    idCode:'205678901', website:'growthpoint.ge',  contactFirst:'ნინო',     contactLast:'კვარაცხელია', position:'დირექტორი',           phone:'591 234 567', email:'nino@growthpoint.ge',      region:'თბილისი',   fieldKey:'biz',     field:'ბიზნეს მოდელირება და სტრატეგიული დაგეგმვა', fieldShort:'ბიზნეს სტრატ.', experience:8,  ind1:'წარმოება',        ind2:'მომსახურება', ind3:'ტექნოლოგია', projectsMicro:12, projectsSmall:8,  projectsMid:4, status:'active' },
  { id:2,  name:'TaxPro Consulting',        idCode:'215432109', website:'taxpro.ge',       contactFirst:'გიორგი',   contactLast:'ბერიძე',      position:'პარტნიორი',            phone:'577 345 678', email:'g.beridze@taxpro.ge',       region:'თბილისი',   fieldKey:'tax',     field:'გადასახადები',                                fieldShort:'გადასახადები',  experience:11, ind1:'ვაჭრობა',         ind2:'წარმოება',    ind3:'',            projectsMicro:6,  projectsSmall:14, projectsMid:7, status:'active' },
  { id:3,  name:'LexGroup Georgia',         idCode:'208901234', website:'lexgroup.ge',     contactFirst:'მარინე',   contactLast:'ჯოჯუა',       position:'იურისტი',              phone:'598 456 789', email:'info@lexgroup.ge',           region:'ბათუმი',    fieldKey:'legal',   field:'იურიდიული საკითხები',                         fieldShort:'იურიდიული',    experience:6,  ind1:'ტურიზმი',         ind2:'ვაჭრობა',     ind3:'',            projectsMicro:9,  projectsSmall:5,  projectsMid:2, status:'active' },
  { id:4,  name:'DigitalEdge',              idCode:'203210987', website:'digitaledge.ge',  contactFirst:'ლუკა',     contactLast:'მხეიძე',      position:'CEO',                  phone:'593 567 890', email:'luka@digitaledge.ge',        region:'ქუთაისი',   fieldKey:'digital', field:'გაციფრულება',                                 fieldShort:'ციფრული',      experience:4,  ind1:'ტექნოლოგია',      ind2:'მომსახურება', ind3:'',            projectsMicro:18, projectsSmall:9,  projectsMid:3, status:'active' },
  { id:5,  name:'MarketWise',               idCode:'213765432', website:'marketwise.ge',   contactFirst:'ანა',      contactLast:'სვანიძე',     position:'მარკეტინგის დირ.',     phone:'555 678 901', email:'a.svanidze@marketwise.ge',   region:'თბილისი',   fieldKey:'sales',   field:'გაყიდვები და მარკეტინგი',                     fieldShort:'გაყიდვები',    experience:7,  ind1:'ვაჭრობა',         ind2:'მომსახურება', ind3:'ტურიზმი',     projectsMicro:15, projectsSmall:11, projectsMid:5, status:'active' },
  { id:6,  name:'FinStar Consulting',       idCode:'219876543', website:'finstar.ge',      contactFirst:'დავით',    contactLast:'ღვინიაშვილი', position:'ფინ. ანალიტიკოსი',     phone:'568 789 012', email:'d.ghvinia@finstar.ge',        region:'რუსთავი',   fieldKey:'finance', field:'ფინანსები და ბუღალტერია',                     fieldShort:'ფინანსები',    experience:9,  ind1:'წარმოება',         ind2:'ვაჭრობა',    ind3:'',            projectsMicro:7,  projectsSmall:12, projectsMid:8, status:'active' },
  { id:7,  name:'AgroConsult Georgia',      idCode:'222345678', website:'agroconsult.ge',  contactFirst:'თამარ',    contactLast:'კობაიძე',     position:'ექსპერტი',             phone:'571 890 123', email:'t.kobaidze@agroconsult.ge',   region:'ახალციხე',  fieldKey:'other',   field:'სხვა',                                        fieldShort:'სხვა',         experience:5,  ind1:'სოფლის მეურნეობა', ind2:'ვაჭრობა',    ind3:'',            projectsMicro:8,  projectsSmall:4,  projectsMid:1, status:'pending' },
  { id:8,  name:'SalesBoost Partners',      idCode:'204567890', website:'salesboost.ge',   contactFirst:'ნიკოლოზ',  contactLast:'ფხაკაძე',     position:'პარტნიორი',            phone:'574 901 234', email:'n.phakadze@salesboost.ge',   region:'ქუთაისი',   fieldKey:'sales',   field:'გაყიდვები და მარკეტინგი',                     fieldShort:'გაყიდვები',    experience:6,  ind1:'ვაჭრობა',         ind2:'მომსახურება', ind3:'',            projectsMicro:10, projectsSmall:7,  projectsMid:3, status:'active' },
  { id:9,  name:'LegalAid Partners',        idCode:'207654321', website:'legalaid.ge',     contactFirst:'სოფო',     contactLast:'ბაქრაძე',     position:'იურისტი',              phone:'579 012 345', email:'s.bakradze@legalaid.ge',     region:'ბათუმი',    fieldKey:'legal',   field:'იურიდიული საკითხები',                         fieldShort:'იურიდიული',    experience:12, ind1:'ტურიზმი',         ind2:'ვაჭრობა',     ind3:'მომსახურება', projectsMicro:5,  projectsSmall:9,  projectsMid:6, status:'inactive' },
  { id:10, name:'BudgetMasters',            idCode:'211234567', website:'budgetmasters.ge', contactFirst:'ირაკლი',  contactLast:'შარიქაძე',    position:'დირექტორი',            phone:'596 123 456', email:'i.shariqadze@budgetm.ge',     region:'გორი',      fieldKey:'finance', field:'ფინანსები და ბუღალტერია',                     fieldShort:'ფინანსები',    experience:7,  ind1:'ვაჭრობა',         ind2:'წარმოება',    ind3:'',            projectsMicro:11, projectsSmall:6,  projectsMid:4, status:'active' },
  { id:11, name:'DigitalPro Georgia',       idCode:'216543210', website:'digitalpro.ge',   contactFirst:'ეკა',      contactLast:'ლომიძე',      position:'IT დირექტორი',         phone:'577 234 567', email:'eka@digitalpro.ge',           region:'თბილისი',   fieldKey:'digital', field:'გაციფრულება',                                 fieldShort:'ციფრული',      experience:5,  ind1:'ტექნოლოგია',      ind2:'მომსახურება', ind3:'',            projectsMicro:20, projectsSmall:10, projectsMid:2, status:'active' },
  { id:12, name:'Strategic Partners GE',    idCode:'218765432', website:'strategicge.ge',  contactFirst:'ზაზა',     contactLast:'ჩხაიძე',      position:'სტრატეგი',             phone:'591 345 678', email:'z.chkhaidze@strategicge.ge', region:'თბილისი',   fieldKey:'biz',     field:'ბიზნეს მოდელირება და სტრატეგიული დაგეგმვა', fieldShort:'ბიზნეს სტრატ.', experience:15, ind1:'წარმოება',        ind2:'ტექნოლოგია',  ind3:'ვაჭრობა',    projectsMicro:6,  projectsSmall:10, projectsMid:9, status:'active' },
])

let nextId = 13

const activeCount  = computed(() => companies.value.filter(c => c.status==='active').length)
const uniqueFields = computed(() => new Set(companies.value.map(c => c.fieldKey)).size)
const totalProjects= computed(() => companies.value.reduce((s,c) => s+c.projectsMicro+c.projectsSmall+c.projectsMid, 0))

const hasFilters = computed(() => searchQuery.value || filterField.value || filterRegion.value || filterStatus.value)
const clearFilters = () => { searchQuery.value=''; filterField.value=''; filterRegion.value=''; filterStatus.value='' }

const allFiltered = computed(() => {
  let list = companies.value
  const q = searchQuery.value.toLowerCase()
  if (q) list = list.filter(c => c.name.toLowerCase().includes(q) || c.idCode.includes(q) || `${c.contactFirst} ${c.contactLast}`.toLowerCase().includes(q))
  if (filterField.value)  list = list.filter(c => c.fieldKey === filterField.value)
  if (filterRegion.value) list = list.filter(c => c.region  === filterRegion.value)
  if (filterStatus.value) list = list.filter(c => c.status  === filterStatus.value)
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

const statusLabel = (s) => ({ active:'აქტიური', pending:'განხილვაში', inactive:'არააქტიური' })[s] || s

const openDetail = (c) => { detailCo.value=c }
const editFromDetail = () => {
  const c = detailCo.value
  Object.assign(form.value, { ...c })
  formTarget.value = c
  detailCo.value = null
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
const saveCompany = () => {
  if (!form.value.name.trim()) { formError.value='კომპანიის სახელი სავალდებულოა'; return }
  if (!form.value.fieldKey)    { formError.value='სფერო სავალდებულოა'; return }
  formError.value = ''
  if (formTarget.value) {
    Object.assign(formTarget.value, { ...form.value })
  } else {
    companies.value.unshift({ id: nextId++, ...form.value })
  }
  formSaved.value = true
  setTimeout(() => { formOpen.value=false; formSaved.value=false }, 900)
}
</script>
