<template>
  <InnerPageLayout title="ღონისძიებები" breadcrumb="ღონისძიებები">
    <div class="mem-page-bg">
    <div class="container mem-body">

      <!-- Stats bar -->
      <div class="mem-stats-bar">
        <div class="mem-stat">
          <strong>{{ events.length }}</strong>
          <span>სულ</span>
        </div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat">
          <strong>{{ upcomingCount }}</strong>
          <span>მომავალი</span>
        </div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat">
          <strong>{{ completedCount }}</strong>
          <span>დასრულებული</span>
        </div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat">
          <strong>{{ totalAttendees }}</strong>
          <span>სულ დამსწრე</span>
        </div>
        <div class="mem-stats-actions" style="display:flex;gap:.6rem;align-items:center">
          <div class="mat-view-toggle">
            <button type="button" :class="['mat-view-btn',{active:viewMode==='grid'}]" @click="viewMode='grid'" title="კარტები">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </button>
            <button type="button" :class="['mat-view-btn',{active:viewMode==='list'}]" @click="viewMode='list'" title="სია">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
          <button type="button" class="ev-btn-internal emp-add-btn" @click="openAdd('internal')">+ შიდა</button>
          <button type="button" class="ev-btn-external emp-add-btn" @click="openAdd('external')">+ გარე</button>
        </div>
      </div>

      <!-- Status tabs -->
      <div class="rep-period-tabs">
        <button v-for="t in statusTabs" :key="t.key" type="button"
          class="rep-period-tab" :class="{active: activeTab===t.key}"
          @click="activeTab=t.key">
          {{ t.label }}
          <span v-if="tabCounts[t.key]" class="ev-tab-count">{{ tabCounts[t.key] }}</span>
        </button>
      </div>

      <!-- Filters -->
      <div class="mem-filters">
        <div class="mem-search-wrap">
          <svg class="mem-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" class="mem-search-input" v-model="searchQuery" placeholder="ღონისძიება, პასუხისმგებელი, ადგილი..." />
          <button v-if="searchQuery" type="button" class="mem-search-clear" @click="searchQuery=''">✕</button>
        </div>
        <select class="mem-filter-select" v-model="filterKind">
          <option value="">შიდა / გარე</option>
          <option value="internal">შიდა</option>
          <option value="external">გარე</option>
        </select>
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

      <!-- Empty -->
      <div v-if="filtered.length===0" class="mat-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".25"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <p>ღონისძიება ვერ მოიძებნა</p>
      </div>

      <!-- Grid -->
      <div v-else-if="viewMode==='grid'" class="ev-grid">
        <div v-for="ev in filtered" :key="ev.id" class="ev-card" @click="openDetail(ev)">
          <div class="ev-card-date-strip" :class="`ev-strip-${ev.kind}`">
            <div class="ev-card-day">{{ ev.dayNum }}</div>
            <div class="ev-card-month">{{ ev.monthName }}</div>
            <span class="ev-kind-badge">{{ ev.kind==='internal'?'შიდა':'გარე' }}</span>
          </div>
          <div class="ev-card-body">
            <div class="ev-card-title">{{ ev.title }}</div>
            <div class="ev-card-tags">
              <span class="rep-type-badge" :class="`rep-type-${ev.typeKey}`">{{ ev.eventType }}</span>
              <span class="mem-activity-tag">{{ ev.category }}</span>
            </div>
            <div class="ev-card-meta-row">
              <span class="ev-meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ ev.location }}
              </span>
              <span class="ev-meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                {{ ev.attendees ?? '—' }}
              </span>
            </div>
            <div class="ev-card-footer-row">
              <span class="mat-uploader">{{ ev.responsible }}</span>
              <span class="co-status-badge" :class="`co-status-${ev.status}`">{{ statusLabel(ev.status) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div v-else class="mem-table-wrap">
        <table class="mem-table">
          <thead>
            <tr>
              <th class="mem-th-sortable" @click="toggleSort('startTs')">თარიღი <span class="mem-sort-icon">{{ si('startTs') }}</span></th>
              <th class="mem-th-sortable" @click="toggleSort('title')">დასახელება <span class="mem-sort-icon">{{ si('title') }}</span></th>
              <th>ტიპი</th>
              <th>ღონ. სახეობა</th>
              <th class="mem-th-sortable" @click="toggleSort('region')">რეგიონი <span class="mem-sort-icon">{{ si('region') }}</span></th>
              <th>განმახ. / პასუხ.</th>
              <th class="mem-th-sortable" @click="toggleSort('attendees')">დამსწრე <span class="mem-sort-icon">{{ si('attendees') }}</span></th>
              <th>სტატუსი</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ev in filtered" :key="ev.id" class="mem-row" @click="openDetail(ev)">
              <td>
                <div class="rep-date-cell">
                  <span class="rep-date">{{ ev.dateLabel }}</span>
                  <span class="rep-time">{{ ev.timeLabel }}</span>
                </div>
              </td>
              <td class="mem-cell-company">{{ ev.title }}</td>
              <td>
                <span class="ev-kind-pill" :class="`ev-kind-${ev.kind}`">{{ ev.kind==='internal'?'შიდა':'გარე' }}</span>
              </td>
              <td><span class="rep-type-badge" :class="`rep-type-${ev.typeKey}`">{{ ev.eventType }}</span></td>
              <td class="mem-cell-muted">{{ ev.region }}</td>
              <td>
                <div class="rep-date-cell">
                  <span style="font-size:.82rem;font-weight:600">{{ ev.implementer }}</span>
                  <span class="rep-time">{{ ev.responsible }}</span>
                </div>
              </td>
              <td style="font-weight:700">{{ ev.attendees ?? '—' }}</td>
              <td><span class="co-status-badge" :class="`co-status-${ev.status}`">{{ statusLabel(ev.status) }}</span></td>
              <td class="mem-cell-arrow">›</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
    </div>

    <!-- Detail drawer -->
    <transition name="drawer">
      <div v-if="detailEv" class="mem-drawer-root" @click.self="detailEv=null">
        <div class="mem-drawer">
          <div class="mem-drawer-head">
            <div class="co-drawer-logo" :class="`ev-logo-${detailEv.kind}`">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div style="flex:1;min-width:0">
              <div class="mem-drawer-name">{{ detailEv.title }}</div>
              <div class="mem-drawer-sub">{{ detailEv.dateLabel }} · {{ detailEv.timeLabel }} · {{ detailEv.location }}</div>
            </div>
            <button type="button" class="mem-drawer-close" @click="detailEv=null">✕</button>
          </div>
          <div class="mem-drawer-body">
            <div class="co-drawer-metrics" style="grid-template-columns:repeat(3,1fr)">
              <div class="co-metric-card">
                <span class="co-metric-label">სახეობა</span>
                <span class="ev-kind-pill" :class="`ev-kind-${detailEv.kind}`">{{ detailEv.kind==='internal'?'შიდა':'გარე' }}</span>
              </div>
              <div class="co-metric-card">
                <span class="co-metric-label">სტატუსი</span>
                <span class="co-status-badge" :class="`co-status-${detailEv.status}`">{{ statusLabel(detailEv.status) }}</span>
              </div>
              <div class="co-metric-card">
                <span class="co-metric-label">დამსწრე</span>
                <span class="co-metric-value">{{ detailEv.attendees ?? '—' }}</span>
              </div>
            </div>
            <div class="mem-drawer-section-title" style="margin-top:1.25rem">ღონისძიების ინფორმაცია</div>
            <div class="co-info-list">
              <div class="co-info-row"><span>ტიპი</span><span class="rep-type-badge" :class="`rep-type-${detailEv.typeKey}`">{{ detailEv.eventType }}</span></div>
              <div class="co-info-row"><span>მიმართულება</span><strong>{{ detailEv.category }}</strong></div>
              <div class="co-info-row"><span>თარიღი</span><strong>{{ detailEv.dateLabel }}</strong></div>
              <div class="co-info-row"><span>დრო</span><strong>{{ detailEv.timeLabel }}</strong></div>
              <div class="co-info-row"><span>ადგილი</span><strong>{{ detailEv.location }}</strong></div>
              <div class="co-info-row"><span>რეგიონი</span><strong>{{ detailEv.region }}</strong></div>
              <div class="co-info-row"><span>განმახ.</span><strong>{{ detailEv.implementer }}</strong></div>
              <div class="co-info-row"><span>პასუხისმგ.</span><strong>{{ detailEv.responsible }}</strong></div>
            </div>
            <div v-if="detailEv.description" class="co-note-block" style="margin-top:1.25rem">
              <div class="co-note-label">აღწერა</div>
              <p>{{ detailEv.description }}</p>
            </div>
          </div>
          <div class="mem-drawer-footer">
            <button type="button" class="crm-btn-secondary" @click="detailEv=null">დახურვა</button>
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
            <div class="co-drawer-logo" :class="`ev-logo-${form.kind}`">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div>
              <div class="mem-drawer-name">{{ formTarget ? 'ღონისძიების რედაქტირება' : (form.kind==='internal'?'შიდა ღონისძიების დამატება':'გარე ღონისძიების დამატება') }}</div>
              <div class="mem-drawer-sub">{{ form.kind==='internal'?'შიდა':'გარე' }} · {{ form.eventType || '—' }}</div>
            </div>
            <button type="button" class="mem-drawer-close" @click="formOpen=false">✕</button>
          </div>
          <div class="mem-drawer-body">
            <div class="mem-drawer-section-title">ძირითადი ინფორმაცია</div>
            <div class="crm-form-grid">
              <div class="crm-field" style="grid-column:1/-1">
                <label>დასახელება</label>
                <input type="text" v-model="form.title" placeholder="ღონისძიების სახელი" />
              </div>
              <div class="crm-field">
                <label>სახეობა</label>
                <select v-model="form.kind">
                  <option value="internal">შიდა</option>
                  <option value="external">გარე</option>
                </select>
              </div>
              <div class="crm-field">
                <label>ღონისძიების ტიპი</label>
                <select v-model="form.eventType">
                  <option value="">— აირჩიეთ —</option>
                  <option v-for="t in eventTypes" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
              <div class="crm-field">
                <label>მიმართულება</label>
                <select v-model="form.category">
                  <option value="">— აირჩიეთ —</option>
                  <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
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
                <label>დაწყების თარიღი</label>
                <input type="date" v-model="form.startDate" />
              </div>
              <div class="crm-field">
                <label>დასრულების თარიღი</label>
                <input type="date" v-model="form.endDate" />
              </div>
              <div class="crm-field">
                <label>დრო</label>
                <input type="time" v-model="form.time" />
              </div>
              <div class="crm-field">
                <label>ადგილი / ლინკი</label>
                <input type="text" v-model="form.location" placeholder="მაგ. ქუთაისი ან Zoom-ის ლინკი" />
              </div>
            </div>
            <div class="mem-drawer-section-title" style="margin-top:1.5rem">პასუხისმგებელი პირები</div>
            <div class="crm-form-grid">
              <div class="crm-field">
                <label>განმახორციელებლის სახელი</label>
                <input type="text" v-model="form.implementerFirst" />
              </div>
              <div class="crm-field">
                <label>განმახ. გვარი</label>
                <input type="text" v-model="form.implementerLast" />
              </div>
              <div class="crm-field" style="grid-column:1/-1">
                <label>პასუხისმგებელი პირი</label>
                <input type="text" v-model="form.responsible" placeholder="სახელი გვარი" />
              </div>
              <div class="crm-field">
                <label>დამსწრეთა რაოდ.</label>
                <input type="number" v-model.number="form.attendees" min="0" />
              </div>
            </div>
            <div class="mem-drawer-section-title" style="margin-top:1.5rem">მოკლე აღწერა</div>
            <textarea v-model="form.description" rows="3" placeholder="ღონისძიების შესახებ..." style="width:100%;resize:vertical;padding:.6rem .75rem;border:1.5px solid var(--border);border-radius:10px;font-family:inherit;font-size:.875rem;outline:none;transition:border-color .15s" @focus="e=>e.target.style.borderColor='var(--accent)'" @blur="e=>e.target.style.borderColor='var(--border)'"></textarea>

            <div v-if="formError" class="cp-error-msg" style="margin-top:1rem">{{ formError }}</div>
            <div v-if="formSaved" class="cp-success-banner" style="margin-top:1rem">{{ formTarget?'ცვლილებები შენახულია':'ღონისძიება დამატებულია' }}</div>
          </div>
          <div class="mem-drawer-footer">
            <button type="button" class="crm-btn-secondary" @click="formOpen=false">გაუქმება</button>
            <button type="button" class="crm-btn-primary" @click="saveEvent">შენახვა</button>
          </div>
        </div>
      </div>
    </transition>

  </InnerPageLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import InnerPageLayout from '../website/shared/InnerPageLayout.vue'

const viewMode    = ref('grid')
const activeTab   = ref('all')
const searchQuery = ref('')
const filterKind  = ref('')
const filterType  = ref('')
const filterRegion= ref('')
const detailEv    = ref(null)
const formOpen    = ref(false)
const formTarget  = ref(null)
const formError   = ref('')
const formSaved   = ref(false)
const sortKey     = ref('startTs')
const sortDir     = ref(1)

const toggleSort = (k) => { if(sortKey.value===k) sortDir.value*=-1; else{sortKey.value=k;sortDir.value=1} }
const si = (k) => sortKey.value!==k ? '↕' : sortDir.value===1 ? '↑' : '↓'

const statusLabel = (s) => ({upcoming:'მომავალი',ongoing:'მიმდინარე',completed:'დასრულებული'})[s]??s
const statusTabs  = [{key:'all',label:'ყველა'},{key:'upcoming',label:'მომავალი'},{key:'ongoing',label:'მიმდინარე'},{key:'completed',label:'დასრულებული'}]

const eventTypes = ['ტრენინგი','ვორქშოპი','ვებინარი','სემინარი','კონფერენცია','საჯარო ლექცია','სხვა']
const categories = ['ბიზნეს დაგეგმვა','მარკეტინგი','ფინანსები','ციფრული ტრანსფორმაცია','სოფლის მეურნეობა','ექსპორტი','ინოვაცია','HR']
const regions    = ['თბილისი','იმერეთი','კახეთი','აჭარა','სამეგრელო','შიდა ქართლი','ქვემო ქართლი','გურია','სამცხე-ჯავახეთი']
const typeKeyMap = {'ტრენინგი':'training','ვორქშოპი':'workshop','ვებინარი':'webinar','სემინარი':'meeting','კონფერენცია':'consulting','საჯარო ლექცია':'meeting','სხვა':'meeting'}

const today = new Date()
const y=today.getFullYear(), m=today.getMonth()
const GEO_MONTHS=['იანვარი','თებერვალი','მარტი','აპრილი','მაისი','ივნისი','ივლისი','აგვისტო','სექტემბერი','ოქტომბერი','ნოემბერი','დეკემბერი']
const SHORT_M=['იან','თებ','მარ','აპრ','მაი','ივნ','ივლ','აგვ','სექ','ოქტ','ნოე','დეკ']

const mkEv = (mo,day,hr,title,kind,eventType,category,region,implementer,responsible,attendees,status,location,description='') => {
  const dt = new Date(y,mo,day,hr)
  return {
    title, kind, eventType, category, region,
    implementer, responsible, attendees, status, location, description,
    startTs:   dt.getTime(),
    dateLabel: `${day} ${SHORT_M[mo]}`,
    timeLabel: `${String(hr).padStart(2,'0')}:00`,
    dayNum:    day,
    monthName: SHORT_M[mo],
    typeKey:   typeKeyMap[eventType] ?? 'meeting',
  }
}

let nextId = 15
const events = ref([
  {...mkEv(m+1,5,10,'ბიზნეს გეგმის შედგენა — ვორქშოპი','internal','ვორქშოპი','ბიზნეს დაგეგმვა','იმერეთი','მარინე გელაშვილი','გიორგი ბერიძე',null,'upcoming','GrowthHub ქუთაისი','პრაქტიკული ვორქშოპი ბიზნეს გეგმის შედგენის ნაბიჯ-ნაბიჯ მეთოდოლოგიით.'),id:1},
  {...mkEv(m+1,12,14,'ციფრული მარკეტინგი — ვებინარი','internal','ვებინარი','მარკეტინგი','სამეგრელო','ნინო კვარაცხელია','მარინე გელაშვილი',null,'upcoming','ონლაინ (Zoom)','სოციალური მედია და SEO მცირე ბიზნესისთვის.'),id:2},
  {...mkEv(m+1,18,10,'სოფლის მეურნეობის ფორუმი','external','კონფერენცია','სოფლის მეურნეობა','კახეთი','დავით ელიავა','დავით ელიავა',null,'upcoming','თელავი, კულტურის სახლი','რეგიონული სოფლის მეურნეობის ფორუმი.'),id:3},
  {...mkEv(m+1,22,11,'ფინანსური ანალიზი — ტრენინგი','internal','ტრენინგი','ფინანსები','თბილისი','ლაშა ნადირაძე','გიორგი ბერიძე',null,'upcoming','GrowthHub თბილისი'),id:4},
  {...mkEv(m,today.getDate()+1,10,'სსიპ კონსულტაცია — მეწარმეები','internal','სემინარი','ექსპორტი','აჭარა','ანა ჩხიკვაძე','ანა ჩხიკვაძე',null,'ongoing','ბათუმი, ევროპის ქ. 12','ეუს ბაზარზე გასვლის შესაძლებლობები.'),id:5},
  {...mkEv(m,today.getDate(),9,'HR მართვა — ინტენსიური','internal','ტრენინგი','HR','თბილისი','თამარი ნადირაძე','გიორგი ბერიძე',null,'ongoing','GrowthHub თბილისი'),id:6},
  {...mkEv(m,4,10,'ბიზნეს გეგმის შედგენა','internal','ტრენინგი','ბიზნეს დაგეგმვა','იმერეთი','მარინე გელაშვილი','გიორგი ბერიძე',24,'completed','GrowthHub ქუთაისი'),id:7},
  {...mkEv(m,7,14,'ციფრული მარკეტინგი I','internal','ვორქშოპი','მარკეტინგი','იმერეთი','ნინო კვარაცხელია','მარინე გელაშვილი',18,'completed','GrowthHub ქუთაისი'),id:8},
  {...mkEv(m,10,9,'საბანკო პროდუქტები','external','სემინარი','ფინანსები','აჭარა','ანა ჩხიკვაძე','ანა ჩხიკვაძე',14,'completed','ბათუმი'),id:9},
  {...mkEv(m,14,10,'კვარტალური მიმოხილვა','internal','სემინარი','ბიზნეს დაგეგმვა','თბილისი','მარინე გელაშვილი','მარინე გელაშვილი',12,'completed','GrowthHub თბილისი'),id:10},
  {...mkEv(m,17,11,'სოფლის მეურნეობის სუბსიდიები','external','ვებინარი','სოფლის მეურნეობა','კახეთი','სოფო გოგოლაძე','დავით ელიავა',47,'completed','ონლაინ'),id:11},
  {...mkEv(m,21,10,'ციფრული მარკეტინგი II','internal','ვორქშოპი','მარკეტინგი','სამეგრელო','ნინო კვარაცხელია','მარინე გელაშვილი',29,'completed','ონლაინ (Zoom)'),id:12},
  {...mkEv(m,25,15,'ფინანსური ანალიზის სემინარი','external','კონფერენცია','ფინანსები','თბილისი','გიორგი ბერიძე','მარინე გელაშვილი',22,'completed','თბილისი, რუსთაველი 52'),id:13},
  {...mkEv(m-1,20,14,'ბიზნეს მოდელის გაანალიზება','internal','ტრენინგი','ბიზნეს დაგეგმვა','იმერეთი','ლაშა ნადირაძე','გიორგი ბერიძე',20,'completed','GrowthHub ქუთაისი'),id:14},
])

const upcomingCount  = computed(()=>events.value.filter(e=>e.status==='upcoming').length)
const completedCount = computed(()=>events.value.filter(e=>e.status==='completed').length)
const totalAttendees = computed(()=>events.value.filter(e=>e.attendees).reduce((s,e)=>s+e.attendees,0))
const tabCounts      = computed(()=>({
  upcoming:  upcomingCount.value,
  ongoing:   events.value.filter(e=>e.status==='ongoing').length,
  completed: completedCount.value,
}))
const hasFilters = computed(()=>searchQuery.value||filterKind.value||filterType.value||filterRegion.value)
const clearFilters = ()=>{ searchQuery.value=filterKind.value=filterType.value=filterRegion.value='' }

const filtered = computed(()=>{
  const q=searchQuery.value.trim().toLowerCase()
  let list=events.value.filter(ev=>{
    const matchTab  = activeTab.value==='all' || ev.status===activeTab.value
    const matchQ    = !q || ev.title.toLowerCase().includes(q) || ev.responsible.toLowerCase().includes(q) || ev.location.toLowerCase().includes(q)
    const matchK    = !filterKind.value   || ev.kind===filterKind.value
    const matchT    = !filterType.value   || ev.eventType===filterType.value
    const matchR    = !filterRegion.value || ev.region===filterRegion.value
    return matchTab&&matchQ&&matchK&&matchT&&matchR
  })
  const k=sortKey.value
  return [...list].sort((a,b)=>{
    const av=a[k]??'', bv=b[k]??''
    if(typeof av==='number') return (av-bv)*sortDir.value
    return String(av).localeCompare(String(bv),'ka')*sortDir.value
  })
})

const form = reactive({ kind:'internal',title:'',eventType:'',category:'',region:'',startDate:'',endDate:'',time:'',location:'',implementerFirst:'',implementerLast:'',responsible:'',attendees:'',description:'' })

const resetForm = (ev=null,kind='internal') => {
  Object.assign(form,{
    kind: ev?.kind??kind, title:ev?.title??'', eventType:ev?.eventType??'', category:ev?.category??'',
    region:ev?.region??'', startDate:'', endDate:'', time:ev?.timeLabel?.slice(0,5)??'',
    location:ev?.location??'', implementerFirst:ev?.implementer?.split(' ')[0]??'',
    implementerLast:ev?.implementer?.split(' ')[1]??'', responsible:ev?.responsible??'',
    attendees:ev?.attendees??'', description:ev?.description??'',
  })
  formError.value=''; formSaved.value=false
}
const openAdd = (kind) => { formTarget.value=null; resetForm(null,kind); detailEv.value=null; formOpen.value=true }
const openDetail = (ev) => { detailEv.value=ev; formOpen.value=false }
const editFromDetail = () => { formTarget.value=detailEv.value; resetForm(detailEv.value); detailEv.value=null; formOpen.value=true }

const saveEvent = () => {
  formError.value=''
  if(!form.title||!form.eventType||!form.region) { formError.value='სახელი, ტიპი და რეგიონი სავალდებულოა.'; return }
  const implementer = `${form.implementerFirst} ${form.implementerLast}`.trim()
  if(formTarget.value){
    const idx=events.value.findIndex(e=>e.id===formTarget.value.id)
    if(idx!==-1) Object.assign(events.value[idx],{ title:form.title,kind:form.kind,eventType:form.eventType,
      typeKey:typeKeyMap[form.eventType]??'meeting',category:form.category,region:form.region,
      location:form.location,implementer,responsible:form.responsible,
      attendees:form.attendees||null,description:form.description,
    })
  } else {
    const dt = form.startDate ? new Date(form.startDate) : new Date(today.getFullYear(),today.getMonth()+1,1)
    events.value.unshift({
      id:nextId++, title:form.title, kind:form.kind, eventType:form.eventType,
      typeKey:typeKeyMap[form.eventType]??'meeting', category:form.category,
      region:form.region, location:form.location, implementer,
      responsible:form.responsible, attendees:form.attendees||null,
      description:form.description, status:'upcoming',
      startTs:dt.getTime(),
      dateLabel:`${dt.getDate()} ${SHORT_M[dt.getMonth()]}`,
      timeLabel:form.time||'10:00',
      dayNum:dt.getDate(), monthName:SHORT_M[dt.getMonth()],
    })
  }
  formSaved.value=true
  setTimeout(()=>{ formSaved.value=false; formOpen.value=false },1500)
}
</script>
