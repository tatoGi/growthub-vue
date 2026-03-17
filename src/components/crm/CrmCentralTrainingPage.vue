<template>
  <InnerPageLayout title="ტრენინგ კომპანიები" breadcrumb="ტრენინგ კომპანიები">
    <div class="mem-page-bg">
    <div class="container mem-body">

      <!-- Stats -->
      <div class="mem-stats-bar">
        <div class="mem-stat"><strong>{{ companies.length }}</strong><span>სულ</span></div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat"><strong>{{ activeCount }}</strong><span>აქტიური</span></div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat"><strong>{{ totalTrainers }}</strong><span>სულ ტრენერი</span></div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat"><strong>{{ uniqueTopics }}</strong><span>სასწავლო სფერო</span></div>
        <div class="mem-stats-actions" style="margin-left:auto">
          <button type="button" class="crm-btn-primary emp-add-btn" @click="openAdd">+ კომპანიის დამატება</button>
        </div>
      </div>

      <!-- Filters -->
      <div class="mem-filters">
        <div class="mem-search-wrap">
          <svg class="mem-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" class="mem-search-input" v-model="searchQuery" placeholder="კომპანია, საკონტაქტო, ID კოდი..." />
          <button v-if="searchQuery" type="button" class="mem-search-clear" @click="searchQuery=''">✕</button>
        </div>
        <select class="mem-filter-select" v-model="filterTopic">
          <option value="">ყველა სფერო</option>
          <option v-for="t in topics" :key="t.key" :value="t.key">{{ t.label }}</option>
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
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".25"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
        <p>კომპანია ვერ მოიძებნა</p>
      </div>

      <!-- Table -->
      <div v-else class="mem-table-wrap">
        <table class="mem-table">
          <thead>
            <tr>
              <th class="mem-th-sortable" @click="toggleSort('name')">კომპანია <span class="mem-sort-icon">{{ si('name') }}</span></th>
              <th>საკონტაქტო პირი</th>
              <th>ტელეფონი</th>
              <th class="mem-th-sortable" @click="toggleSort('topicKey')">სასწავლო სფერო <span class="mem-sort-icon">{{ si('topicKey') }}</span></th>
              <th class="mem-th-sortable" @click="toggleSort('region')">რეგიონი <span class="mem-sort-icon">{{ si('region') }}</span></th>
              <th class="mem-th-sortable" @click="toggleSort('trainerCount')">ტრენერები <span class="mem-sort-icon">{{ si('trainerCount') }}</span></th>
              <th>სტატუსი</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in filtered" :key="c.id" class="mem-row" @click="openDetail(c)">
              <td>
                <div class="emp-name">
                  <div class="mem-avatar" :class="`tr-avatar-${c.topicKey}`">{{ c.name.slice(0,2).toUpperCase() }}</div>
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
              <td><span class="cons-field-badge" :class="`cons-field-${c.topicKey}`">{{ c.topicShort }}</span></td>
              <td class="mem-cell-muted">{{ c.region }}</td>
              <td>
                <div class="tr-trainer-count">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  {{ c.trainerCount }}
                </div>
              </td>
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
            <div class="co-drawer-logo" :class="`cons-logo-${detailCo.topicKey}`">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
            <div style="flex:1;min-width:0">
              <div class="mem-drawer-name">{{ detailCo.name }}</div>
              <div class="mem-drawer-sub">{{ detailCo.topic }} · {{ detailCo.region }}</div>
            </div>
            <button type="button" class="mem-drawer-close" @click="detailCo=null">✕</button>
          </div>
          <div class="mem-drawer-body">
            <div class="co-drawer-metrics" style="grid-template-columns:repeat(3,1fr)">
              <div class="co-metric-card">
                <span class="co-metric-label">ტრენერები</span>
                <span class="co-metric-value">{{ detailCo.trainerCount }}</span>
              </div>
              <div class="co-metric-card">
                <span class="co-metric-label">სტატუსი</span>
                <span class="co-status-badge" :class="`co-status-${detailCo.status}`">{{ statusLabel(detailCo.status) }}</span>
              </div>
              <div class="co-metric-card">
                <span class="co-metric-label">გამოცდილება</span>
                <span class="co-metric-value">{{ detailCo.experience }} წ.</span>
              </div>
            </div>

            <div class="mem-drawer-section-title" style="margin-top:1.25rem">კომპანიის ინფორმაცია</div>
            <div class="co-info-list">
              <div class="co-info-row"><span>ID კოდი</span><strong>{{ detailCo.idCode }}</strong></div>
              <div class="co-info-row"><span>ვებ-გვერდი</span><strong>{{ detailCo.website || '—' }}</strong></div>
              <div class="co-info-row"><span>სასწავლო სფერო</span><span class="cons-field-badge" :class="`cons-field-${detailCo.topicKey}`">{{ detailCo.topic }}</span></div>
              <div class="co-info-row"><span>რეგიონი</span><strong>{{ detailCo.region }}</strong></div>
              <div class="co-info-row" v-if="detailCo.topic2"><span>დამატებითი სფერო</span><strong>{{ detailCo.topic2 }}</strong></div>
            </div>

            <div class="mem-drawer-section-title" style="margin-top:1.25rem">საკონტაქტო პირი</div>
            <div class="co-info-list">
              <div class="co-info-row"><span>სახელი გვარი</span><strong>{{ detailCo.contactFirst }} {{ detailCo.contactLast }}</strong></div>
              <div class="co-info-row"><span>პოზიცია</span><strong>{{ detailCo.position }}</strong></div>
              <div class="co-info-row"><span>ტელეფონი</span><strong>{{ detailCo.phone }}</strong></div>
              <div class="co-info-row"><span>ელ. ფოსტა</span><strong>{{ detailCo.email }}</strong></div>
            </div>

            <div v-if="detailCo.trainers && detailCo.trainers.length" style="margin-top:1.25rem">
              <div class="mem-drawer-section-title">ტრენერები / კონსულტანტები</div>
              <div class="tr-trainer-list">
                <div v-for="t in detailCo.trainers" :key="t.name" class="tr-trainer-row">
                  <div class="tr-trainer-avatar">{{ t.name.slice(0,1) }}</div>
                  <div>
                    <div style="font-weight:600;font-size:.84rem">{{ t.name }}</div>
                    <div class="mem-cell-muted" style="font-size:.75rem">{{ t.sphere }}</div>
                  </div>
                </div>
              </div>
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
            <div class="co-drawer-logo" :class="`cons-logo-${form.topicKey||'other'}`">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
            <div>
              <div class="mem-drawer-name">{{ formTarget ? 'კომპანიის რედაქტირება' : 'ახალი ტრენინგ კომპანია' }}</div>
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
                <label>სასწავლო სფერო</label>
                <select v-model="form.topicKey" @change="onTopicChange">
                  <option value="">— აირჩიეთ —</option>
                  <option v-for="t in topics" :key="t.key" :value="t.key">{{ t.label }}</option>
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
                <label>გამოცდილება (წელი)</label>
                <input type="number" v-model.number="form.experience" min="0" max="50" />
              </div>
              <div class="crm-field">
                <label>ტრენერების რაოდენობა</label>
                <input type="number" v-model.number="form.trainerCount" min="0" />
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

            <div v-if="formError" class="cp-error-msg" style="margin-top:1rem">{{ formError }}</div>
            <div v-if="formSaved" class="cp-success-banner" style="margin-top:1rem">{{ formTarget ? 'ცვლილებები შენახულია' : 'კომპანია დამატებულია' }}</div>
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
const filterTopic  = ref('')
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

const topics = [
  { key:'biz',     label:'ბიზნეს უნარები',              short:'ბიზნეს' },
  { key:'digital', label:'ციფრული ტრენინგი',             short:'ციფრული' },
  { key:'sales',   label:'გაყიდვები',                   short:'გაყიდვები' },
  { key:'finance', label:'ფინანსები',                   short:'ფინანსები' },
  { key:'legal',   label:'იურიდიული',                   short:'იურიდიული' },
  { key:'agro',    label:'სოფლის მეურნეობა',            short:'აგრო' },
  { key:'mgt',     label:'მენეჯმენტი',                  short:'მენეჯ.' },
  { key:'hr',      label:'ადამიანური რესურსები',        short:'HR' },
  { key:'export',  label:'ექსპორტი',                    short:'ექსპორტი' },
  { key:'innov',   label:'ინოვაციები',                   short:'ინოვ.' },
]
const regions = ['თბილისი','ქუთაისი','ბათუმი','რუსთავი','გორი','ზუგდიდი','ახალციხე','თელავი','ამბროლაური','ოზურგეთი']

const blankForm = () => ({
  name:'', idCode:'', website:'', topicKey:'', topic:'', topicShort:'', topic2:'',
  region:'', experience:0, trainerCount:0, status:'active',
  contactFirst:'', contactLast:'', position:'', phone:'', email:'',
  trainers:[],
})
const form = ref(blankForm())

const companies = ref([
  { id:1,  name:'LearnHub Georgia',  idCode:'201234567', website:'learnhub.ge',    contactFirst:'მარიამ',  contactLast:'გელაშვილი', position:'დირექტორი',    phone:'591 111 222', email:'info@learnhub.ge',     region:'თბილისი',  topicKey:'biz',     topic:'ბიზნეს უნარები',       topicShort:'ბიზნეს',     topic2:'მენეჯმენტი',           experience:9,  trainerCount:12, status:'active',   trainers:[{name:'ნინო ბერიძე', sphere:'ლიდერობა'},{name:'დავით კობა', sphere:'სტრატეგია'},{name:'ანა ჩხეიძე', sphere:'HR'}] },
  { id:2,  name:'TechTrain',         idCode:'212345678', website:'techtrain.ge',   contactFirst:'გიორგი',  contactLast:'სამხარაძე', position:'CEO',           phone:'577 222 333', email:'g.samkha@techtrain.ge', region:'თბილისი',  topicKey:'digital', topic:'ციფრული ტრენინგი',      topicShort:'ციფრული',    topic2:'',                     experience:6,  trainerCount:8,  status:'active',   trainers:[{name:'ლუკა ნიკო', sphere:'AI/ML'},{name:'ეკა ლომი', sphere:'UX/UI'}] },
  { id:3,  name:'SalesAcademy GE',   idCode:'223456789', website:'salesacademy.ge',contactFirst:'ანა',     contactLast:'ლომიძე',    position:'ტრენინგ მენ.',  phone:'598 333 444', email:'a.lomidze@salesacad.ge',region:'ქუთაისი',  topicKey:'sales',   topic:'გაყიდვები',            topicShort:'გაყიდვები',  topic2:'მარკეტინგი',           experience:7,  trainerCount:6,  status:'active',   trainers:[{name:'ზურა ფარ.', sphere:'გაყიდვები'},{name:'თამარ ბე.', sphere:'მარკ.'}] },
  { id:4,  name:'FinanceSchool',      idCode:'234567890', website:'finschool.ge',   contactFirst:'დავით',  contactLast:'ჯაფარიძე', position:'დირექტორი',    phone:'593 444 555', email:'d.japa@finschool.ge',   region:'თბილისი',  topicKey:'finance', topic:'ფინანსები',             topicShort:'ფინანსები',  topic2:'ბუღალტერია',           experience:11, trainerCount:9,  status:'active',   trainers:[{name:'ირა კობ.', sphere:'ფინ. ანალიზი'},{name:'ნათია ბე.', sphere:'ბუღ.'}] },
  { id:5,  name:'LegalWorkshops',     idCode:'245678901', website:'legalws.ge',     contactFirst:'სოფია',  contactLast:'ხარაბაძე', position:'პარტნიორი',    phone:'555 555 666', email:'sofia@legalws.ge',       region:'ბათუმი',   topicKey:'legal',   topic:'იურიდიული',            topicShort:'იურიდიული',  topic2:'',                     experience:8,  trainerCount:4,  status:'active',   trainers:[{name:'ნუნუ ბაქ.', sphere:'სახელშ. სამ.'}] },
  { id:6,  name:'AgroTrain',          idCode:'256789012', website:'agrotrain.ge',   contactFirst:'ირაკლი', contactLast:'ქობულია',  position:'ხელმძღვ.',     phone:'568 666 777', email:'irakli@agrotrain.ge',    region:'ზუგდიდი',  topicKey:'agro',    topic:'სოფლის მეურნეობა',     topicShort:'აგრო',       topic2:'',                     experience:5,  trainerCount:7,  status:'active',   trainers:[{name:'ლელა გვ.', sphere:'მეცხოველ.'},{name:'ბადრი მ.', sphere:'მებ.'}] },
  { id:7,  name:'MarketTrainers',     idCode:'267890123', website:'mkttrain.ge',    contactFirst:'ეკა',    contactLast:'ჩაგელიშვ.', position:'CMO',           phone:'571 777 888', email:'eka@mkttrain.ge',         region:'თბილისი',  topicKey:'sales',   topic:'გაყიდვები',            topicShort:'გაყიდვები',  topic2:'ციფრული მარკ.',        experience:4,  trainerCount:5,  status:'active',   trainers:[{name:'გიო ქობ.', sphere:'Social Media'},{name:'ანა ნი.', sphere:'SEO'}] },
  { id:8,  name:'DigiSkills',         idCode:'278901234', website:'digiskills.ge',  contactFirst:'ნიკოლოზ',contactLast:'ბარბაქაძე',position:'IT Dir.',        phone:'574 888 999', email:'n.barbakadze@digi.ge',   region:'ქუთაისი',  topicKey:'digital', topic:'ციფრული ტრენინგი',      topicShort:'ციფრული',    topic2:'ინოვაციები',           experience:3,  trainerCount:10, status:'active',   trainers:[{name:'სანდრო ვ.', sphere:'Dev'},{name:'მარი ო.', sphere:'Data'}] },
  { id:9,  name:'ManagementPro',      idCode:'289012345', website:'mgtpro.ge',      contactFirst:'თამარ',  contactLast:'კვარაცხ.', position:'დირექტორი',    phone:'579 999 000', email:'t.kvaratskhelia@mgt.ge',region:'გორი',     topicKey:'mgt',     topic:'მენეჯმენტი',           topicShort:'მენეჯ.',     topic2:'ბიზნეს უნარები',       experience:12, trainerCount:8,  status:'active',   trainers:[{name:'ლაშა ბე.', sphere:'OKR/KPI'},{name:'ნინო ჩ.', sphere:'PM'}] },
  { id:10, name:'HRMasters',          idCode:'290123456', website:'hrmasters.ge',   contactFirst:'ნინო',   contactLast:'შავლეგი',  position:'HR Dir.',        phone:'596 000 111', email:'nino@hrmasters.ge',       region:'თბილისი',  topicKey:'hr',      topic:'ადამიანური რესურსები',  topicShort:'HR',         topic2:'',                     experience:7,  trainerCount:6,  status:'pending',  trainers:[{name:'სოფო ბა.', sphere:'Recruitment'}] },
  { id:11, name:'ExportTrain',        idCode:'201122334', website:'exporttrain.ge', contactFirst:'ზაზა',   contactLast:'ჭელიძე',   position:'ექსპ. სპეც.',  phone:'577 111 222', email:'zaza@exporttrain.ge',     region:'ბათუმი',   topicKey:'export',  topic:'ექსპორტი',             topicShort:'ექსპორტი',   topic2:'',                     experience:6,  trainerCount:4,  status:'active',   trainers:[{name:'ბექა ნა.', sphere:'ექსპ. ბაზ.'},{name:'მარინე ო.', sphere:'ლოჯ.'}] },
  { id:12, name:'InnovationLab GE',   idCode:'201233445', website:'innovlab.ge',    contactFirst:'ლუკა',   contactLast:'გომელაური',position:'Dir. Innov.',    phone:'591 222 333', email:'luka@innovlab.ge',         region:'თბილისი',  topicKey:'innov',   topic:'ინოვაციები',            topicShort:'ინოვ.',      topic2:'ციფრული',              experience:5,  trainerCount:11, status:'active',   trainers:[{name:'ნათია ს.', sphere:'Startup'},{name:'გიო მ.', sphere:'Design Thinking'}] },
])

let nextId = 13

const activeCount   = computed(() => companies.value.filter(c => c.status==='active').length)
const totalTrainers = computed(() => companies.value.reduce((s,c) => s + c.trainerCount, 0))
const uniqueTopics  = computed(() => new Set(companies.value.map(c => c.topicKey)).size)

const hasFilters = computed(() => searchQuery.value || filterTopic.value || filterRegion.value || filterStatus.value)
const clearFilters = () => { searchQuery.value=''; filterTopic.value=''; filterRegion.value=''; filterStatus.value='' }

const allFiltered = computed(() => {
  let list = companies.value
  const q = searchQuery.value.toLowerCase()
  if (q) list = list.filter(c => c.name.toLowerCase().includes(q) || c.idCode.includes(q) || `${c.contactFirst} ${c.contactLast}`.toLowerCase().includes(q))
  if (filterTopic.value)  list = list.filter(c => c.topicKey === filterTopic.value)
  if (filterRegion.value) list = list.filter(c => c.region   === filterRegion.value)
  if (filterStatus.value) list = list.filter(c => c.status   === filterStatus.value)
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
const onTopicChange = () => {
  const t = topics.find(t => t.key===form.value.topicKey)
  if (t) { form.value.topic = t.label; form.value.topicShort = t.short }
}
const saveCompany = () => {
  if (!form.value.name.trim()) { formError.value='კომპანიის სახელი სავალდებულოა'; return }
  if (!form.value.topicKey)    { formError.value='სასწავლო სფერო სავალდებულოა'; return }
  formError.value = ''
  if (formTarget.value) {
    Object.assign(formTarget.value, { ...form.value })
  } else {
    companies.value.unshift({ id: nextId++, ...form.value, trainers:[] })
  }
  formSaved.value = true
  setTimeout(() => { formOpen.value=false; formSaved.value=false }, 900)
}
</script>
