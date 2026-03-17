<template>
  <InnerPageLayout title="სასწავლო მასალები" breadcrumb="სასწავლო მასალები">
    <div class="mem-page-bg">
    <div class="container mem-body">

      <!-- Stats + actions bar -->
      <div class="mem-stats-bar">
        <div class="mem-stat">
          <strong>{{ materials.length }}</strong>
          <span>სულ მასალა</span>
        </div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat">
          <strong>{{ uniqueCategories }}</strong>
          <span>მიმართულება</span>
        </div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat">
          <strong>{{ thisMonthCount }}</strong>
          <span>ამ თვეში</span>
        </div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat">
          <strong>{{ filteredMaterials.length }}</strong>
          <span>ნაჩვენები</span>
        </div>
        <div class="mem-stats-actions" style="display:flex;gap:.6rem;align-items:center">
          <!-- View toggle -->
          <div class="mat-view-toggle">
            <button type="button" :class="['mat-view-btn', { active: viewMode === 'grid' }]" @click="viewMode = 'grid'" title="კარტები">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </button>
            <button type="button" :class="['mat-view-btn', { active: viewMode === 'list' }]" @click="viewMode = 'list'" title="სია">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
          <button type="button" class="crm-btn-primary emp-add-btn" @click="openAdd">
            + მასალის დამატება
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="mem-filters">
        <div class="mem-search-wrap">
          <svg class="mem-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" class="mem-search-input" v-model="searchQuery" placeholder="სახელი, მიმართულება..." />
          <button v-if="searchQuery" type="button" class="mem-search-clear" @click="searchQuery = ''">✕</button>
        </div>
        <select class="mem-filter-select" v-model="filterCategory">
          <option value="">ყველა მიმართულება</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
        <select class="mem-filter-select" v-model="filterEventType">
          <option value="">ყველა ღონისძიება</option>
          <option v-for="t in eventTypes" :key="t" :value="t">{{ t }}</option>
        </select>
        <select class="mem-filter-select" v-model="filterRegion">
          <option value="">ყველა რეგიონი</option>
          <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
        </select>
        <button v-if="hasFilters" type="button" class="mem-clear-filters" @click="clearFilters">გასუფთავება</button>
      </div>

      <!-- Empty state -->
      <div v-if="filteredMaterials.length === 0" class="mat-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".25"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
        <p>მასალა ვერ მოიძებნა</p>
      </div>

      <!-- Grid view -->
      <div v-else-if="viewMode === 'grid'" class="mat-grid">
        <div
          v-for="mat in filteredMaterials" :key="mat.id"
          class="mat-card"
        >
          <div class="mat-card-top" :class="`mat-bg-${mat.categoryKey}`">
            <div class="mat-file-icon">
              <svg v-if="mat.fileType === 'PDF'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="11" y2="17"/></svg>
              <svg v-else-if="mat.fileType === 'PPTX'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              <svg v-else-if="mat.fileType === 'VIDEO'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
              <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <span class="mat-filetype-label">{{ mat.fileType }}</span>
          </div>
          <div class="mat-card-body">
            <div class="mat-card-title" :title="mat.title">{{ mat.title }}</div>
            <div class="mat-card-meta">
              <span class="rep-type-badge" :class="`rep-type-${mat.eventTypeKey}`">{{ mat.eventType }}</span>
              <span class="mem-activity-tag">{{ mat.category }}</span>
            </div>
            <div class="mat-card-info">
              <span>{{ mat.region }}</span>
              <span>{{ mat.eventDate }}</span>
            </div>
            <p v-if="mat.description" class="mat-card-desc">{{ mat.description }}</p>
          </div>
          <div class="mat-card-footer">
            <span class="mat-uploader">{{ mat.uploader }}</span>
            <button type="button" class="rep-feedback-btn" @click="downloadMaterial(mat)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              ჩამოტვირთვა
            </button>
          </div>
        </div>
      </div>

      <!-- List view -->
      <div v-else class="mem-table-wrap">
        <table class="mem-table">
          <thead>
            <tr>
              <th class="mem-th-sortable" @click="toggleSort('uploadDate')">ატვირთვა <span class="mem-sort-icon">{{ sortIcon('uploadDate') }}</span></th>
              <th class="mem-th-sortable" @click="toggleSort('eventDate')">ღონ. თარიღი <span class="mem-sort-icon">{{ sortIcon('eventDate') }}</span></th>
              <th class="mem-th-sortable" @click="toggleSort('title')">დასახელება <span class="mem-sort-icon">{{ sortIcon('title') }}</span></th>
              <th class="mem-th-sortable" @click="toggleSort('uploader')">თანამშრომელი <span class="mem-sort-icon">{{ sortIcon('uploader') }}</span></th>
              <th class="mem-th-sortable" @click="toggleSort('region')">რეგიონი <span class="mem-sort-icon">{{ sortIcon('region') }}</span></th>
              <th class="mem-th-sortable" @click="toggleSort('eventType')">ღონისძიება <span class="mem-sort-icon">{{ sortIcon('eventType') }}</span></th>
              <th class="mem-th-sortable" @click="toggleSort('category')">მიმართულება <span class="mem-sort-icon">{{ sortIcon('category') }}</span></th>
              <th>მასალა</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mat in filteredMaterials" :key="mat.id" class="mem-row">
              <td class="mem-cell-muted" style="white-space:nowrap">{{ mat.uploadDate }}</td>
              <td class="mem-cell-muted" style="white-space:nowrap">{{ mat.eventDate }}</td>
              <td class="mem-cell-company">{{ mat.title }}</td>
              <td class="mem-cell-person">
                <span class="mem-avatar" style="background:#e0f2fe;color:#0369a1;font-size:.68rem">{{ mat.uploader.split(' ').map(w=>w[0]).join('').slice(0,2) }}</span>
                <span style="font-size:.875rem">{{ mat.uploader }}</span>
              </td>
              <td class="mem-cell-muted">{{ mat.region }}</td>
              <td><span class="rep-type-badge" :class="`rep-type-${mat.eventTypeKey}`">{{ mat.eventType }}</span></td>
              <td><span class="mem-activity-tag">{{ mat.category }}</span></td>
              <td>
                <button type="button" class="rep-feedback-btn" @click="downloadMaterial(mat)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  {{ mat.fileType }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
    </div>

    <!-- Add material drawer -->
    <transition name="drawer">
      <div v-if="drawerOpen" class="mem-drawer-root" @click.self="closeDrawer">
        <div class="mem-drawer">

          <div class="mem-drawer-head">
            <div class="co-drawer-logo" style="background:#ede9fe;color:#7c3aed">+</div>
            <div>
              <div class="mem-drawer-name">ახალი მასალის დამატება</div>
              <div class="mem-drawer-sub">შეავსეთ ინფორმაცია და ატვირთეთ ფაილი</div>
            </div>
            <button type="button" class="mem-drawer-close" @click="closeDrawer">✕</button>
          </div>

          <div class="mem-drawer-body">
            <div class="mem-drawer-section-title">მასალის ინფორმაცია</div>
            <div class="crm-form-grid">
              <div class="crm-field" style="grid-column:1/-1">
                <label>დასახელება</label>
                <input type="text" v-model="form.title" placeholder="მასალის სახელი" />
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
                <label>ღონისძიების თარიღი</label>
                <input type="date" v-model="form.eventDate" />
              </div>
              <div class="crm-field" style="grid-column:1/-1">
                <label>მოკლე აღწერა</label>
                <textarea v-model="form.description" rows="3" placeholder="მასალის შესახებ მოკლე ინფორმაცია..." style="width:100%;resize:vertical;padding:.6rem .75rem;border:1.5px solid var(--border);border-radius:10px;font-family:inherit;font-size:.875rem;outline:none;transition:border-color .15s" @focus="e=>e.target.style.borderColor='var(--accent)'" @blur="e=>e.target.style.borderColor='var(--border)'"></textarea>
              </div>
            </div>

            <div class="mem-drawer-section-title" style="margin-top:1.5rem">ფაილი</div>
            <div class="crm-form-grid">
              <div class="crm-field">
                <label>ფაილის ტიპი</label>
                <select v-model="form.fileType">
                  <option value="PDF">PDF</option>
                  <option value="PPTX">PPTX</option>
                  <option value="DOC">DOC</option>
                  <option value="VIDEO">VIDEO</option>
                </select>
              </div>
            </div>
            <div class="mat-upload-zone" @click="triggerFileInput">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span v-if="!form.fileName">ფაილის ასარჩევად დააჭირეთ</span>
              <span v-else class="mat-upload-chosen">{{ form.fileName }}</span>
              <input ref="fileInput" type="file" style="display:none" @change="onFileChange" />
            </div>

            <div v-if="formError" class="cp-error-msg" style="margin-top:1rem">{{ formError }}</div>
            <div v-if="formSaved" class="cp-success-banner" style="margin-top:1rem">მასალა წარმატებით დაემატა</div>
          </div>

          <div class="mem-drawer-footer">
            <button type="button" class="crm-btn-secondary" @click="closeDrawer">გაუქმება</button>
            <button type="button" class="crm-btn-primary" @click="saveMaterial">ატვირთვა</button>
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
const searchQuery = ref('')
const filterCategory  = ref('')
const filterEventType = ref('')
const filterRegion    = ref('')
const drawerOpen  = ref(false)
const formError   = ref('')
const formSaved   = ref(false)
const fileInput   = ref(null)

const sortKey = ref('uploadTs')
const sortDir = ref(-1)
const toggleSort = (k) => { if (sortKey.value === k) sortDir.value *= -1; else { sortKey.value = k; sortDir.value = 1 } }
const sortIcon   = (k) => sortKey.value !== k ? '↕' : sortDir.value === 1 ? '↑' : '↓'

const form = reactive({ title:'', eventType:'', category:'', region:'', eventDate:'', description:'', fileType:'PDF', fileName:'' })

const categories = ['ბიზნეს დაგეგმვა','მარკეტინგი','ფინანსები','ციფრული ტრანსფორმაცია','სოფლის მეურნეობა','ექსპორტი','HR','სამართლებრივი საკითხები','ინოვაცია']
const eventTypes = ['ტრენინგი','ვორქშოპი','ვებინარი','კონსულტაცია','სემინარი','სხვა']
const regions    = ['თბილისი','იმერეთი','კახეთი','აჭარა','სამეგრელო','შიდა ქართლი','ქვემო ქართლი','გურია','სამცხე-ჯავახეთი','მცხეთა-მთიანეთი','რაჭა-ლეჩხუმი']

const typeKeyMap = { 'ტრენინგი':'training','ვორქშოპი':'workshop','ვებინარი':'webinar','კონსულტაცია':'consulting','სემინარი':'meeting','სხვა':'meeting' }
const catKeyMap  = { 'ბიზნეს დაგეგმვა':'biz','მარკეტინგი':'mkt','ფინანსები':'fin','ციფრული ტრანსფორმაცია':'digital','სოფლის მეურნეობა':'agro','ექსპორტი':'exp','HR':'hr','სამართლებრივი საკითხები':'legal','ინოვაცია':'innov' }

const today = new Date()
const y = today.getFullYear(), m = today.getMonth()
const fmtDate = (dt) => {
  const d = dt instanceof Date ? dt : new Date(dt)
  return `${d.getDate()} ${['იან','თებ','მარ','აპრ','მაი','ივნ','ივლ','აგვ','სექ','ოქტ','ნოე','დეკ'][d.getMonth()]} ${d.getFullYear()}`
}
const mkTs = (mo, day) => new Date(y, mo, day).getTime()

let nextId = 13
const materials = ref([
  { id:1,  title:'ბიზნეს გეგმის შედგენა — პრაქტიკული სახელმძღვანელო', fileType:'PDF',   eventType:'ტრენინგი',   category:'ბიზნეს დაგეგმვა',      region:'იმერეთი',      uploader:'მარინე გელაშვილი',  uploadDate: fmtDate(new Date(y,m,5)),  eventDate: fmtDate(new Date(y,m,4)),  uploadTs: mkTs(m,5),  description:'ბიზნეს გეგმის შედგენის ნაბიჯ-ნაბიჯ სახელმძღვანელო მეწარმეებისთვის.' },
  { id:2,  title:'ციფრული მარკეტინგი — პრეზენტაცია',                   fileType:'PPTX',  eventType:'ვორქშოპი',   category:'მარკეტინგი',            region:'იმერეთი',      uploader:'ნინო კვარაცხელია',  uploadDate: fmtDate(new Date(y,m,8)),  eventDate: fmtDate(new Date(y,m,7)),  uploadTs: mkTs(m,8),  description:'სოციალური მედია, SEO და ციფრული რეკლამა მცირე ბიზნესისთვის.' },
  { id:3,  title:'ფინანსური ანალიზი — Excel შაბლონები',                fileType:'DOC',   eventType:'ტრენინგი',   category:'ფინანსები',              region:'თბილისი',      uploader:'ლაშა ნადირაძე',     uploadDate: fmtDate(new Date(y,m,11)), eventDate: fmtDate(new Date(y,m,10)), uploadTs: mkTs(m,11), description:'ფულადი ნაკადების, მოგება-ზარალისა და ბალანსის Excel შაბლონები.' },
  { id:4,  title:'სოფლის მეურნეობის სუბსიდიები 2026',                  fileType:'PDF',   eventType:'ვებინარი',   category:'სოფლის მეურნეობა',      region:'კახეთი',       uploader:'სოფო გოგოლაძე',     uploadDate: fmtDate(new Date(y,m,18)), eventDate: fmtDate(new Date(y,m,17)), uploadTs: mkTs(m,18), description:'სახელმწიფო სუბსიდიების, გრანტებისა და დაფინანსების პროგრამების მიმოხილვა.' },
  { id:5,  title:'ექსპორტის შესაძლებლობები — ევროკავშირი',             fileType:'PDF',   eventType:'სემინარი',   category:'ექსპორტი',              region:'შიდა ქართლი',  uploader:'მარინე გელაშვილი',  uploadDate: fmtDate(new Date(y,m-1,23)),eventDate:fmtDate(new Date(y,m-1,22)),uploadTs:mkTs(m-1,23),description:'ევროკავშირის ბაზარზე გასვლის სტრატეგია ქართული კომპანიებისთვის.' },
  { id:6,  title:'HR მართვა მცირე ბიზნესში',                           fileType:'PPTX',  eventType:'ტრენინგი',   category:'HR',                    region:'სამეგრელო',    uploader:'თამარი ნადირაძე',   uploadDate: fmtDate(new Date(y,m-1,21)),eventDate:fmtDate(new Date(y,m-1,21)),uploadTs:mkTs(m-1,21),description:'კადრების შერჩევა, მოტივაცია და კორპორატიული კულტურა.' },
  { id:7,  title:'ბიზნეს-დიაგნოსტიკის შედეგების ინტერპრეტაცია',       fileType:'PDF',   eventType:'ვორქშოპი',   category:'ბიზნეს დაგეგმვა',      region:'თბილისი',      uploader:'გიორგი ბერიძე',     uploadDate: fmtDate(new Date(y,m-1,15)),eventDate:fmtDate(new Date(y,m-1,14)),uploadTs:mkTs(m-1,15),description:'როგორ გამოვიყენოთ დიაგნოსტიკის ქულები ბიზნეს გადაწყვეტილებებში.' },
  { id:8,  title:'სამართლებრივი ბაზა მეწარმეებისთვის',                 fileType:'DOC',   eventType:'სემინარი',   category:'სამართლებრივი საკითხები',region:'ქვემო ქართლი', uploader:'ბაკური ცხოვრებაძე', uploadDate: fmtDate(new Date(y,m-2,26)),eventDate:fmtDate(new Date(y,m-2,25)),uploadTs:mkTs(m-2,26),description:'შპს-ის, ი.პ.-ის და სს-ის სამართლებრივი სტატუსები და ვალდებულებები.' },
  { id:9,  title:'ციფრული ტრანსფორმაცია — Case Studies',               fileType:'PPTX',  eventType:'ვებინარი',   category:'ციფრული ტრანსფორმაცია', region:'თბილისი',      uploader:'სოფო გოგოლაძე',     uploadDate: fmtDate(new Date(y,m-2,20)),eventDate:fmtDate(new Date(y,m-2,18)),uploadTs:mkTs(m-2,20),description:'ქართული კომპანიების ციფრალიზაციის წარმატებული მაგალითები.' },
  { id:10, title:'ინოვაციური ბიზნეს მოდელები',                         fileType:'VIDEO', eventType:'ვორქშოპი',   category:'ინოვაცია',              region:'კახეთი',       uploader:'დავით ელიავა',       uploadDate: fmtDate(new Date(y,m-2,13)),eventDate:fmtDate(new Date(y,m-2,12)),uploadTs:mkTs(m-2,13),description:'Platform, Subscription და Freemium მოდელების ადაპტაცია ქართულ ბაზარზე.' },
  { id:11, title:'საბანკო პროდუქტები მეწარმეებისთვის',                 fileType:'PDF',   eventType:'სემინარი',   category:'ფინანსები',              region:'აჭარა',        uploader:'ანა ჩხიკვაძე',      uploadDate: fmtDate(new Date(y,m-2,11)),eventDate:fmtDate(new Date(y,m-2,10)),uploadTs:mkTs(m-2,11),description:'TBC, BOG და Liberty Bank-ის სესხის პირობები მცირე ბიზნესისთვის.' },
  { id:12, title:'მარკეტინგის სტრატეგია — სეზონური გეგმა',             fileType:'PPTX',  eventType:'ტრენინგი',   category:'მარკეტინგი',            region:'გურია',        uploader:'ნინო კვარაცხელია',  uploadDate: fmtDate(new Date(y,m-2,6)), eventDate:fmtDate(new Date(y,m-2,5)), uploadTs:mkTs(m-2,6), description:'სეზონური გაყიდვების დაგეგმვა და კამპანიების მართვა.' },
].map(mat => ({
  ...mat,
  eventTypeKey: typeKeyMap[mat.eventType] ?? 'meeting',
  categoryKey:  catKeyMap[mat.category]   ?? 'biz',
})))

const thisMonthCount   = computed(() => materials.value.filter(m => m.uploadTs >= new Date(y, today.getMonth(), 1).getTime()).length)
const uniqueCategories = computed(() => new Set(materials.value.map(m => m.category)).size)
const hasFilters = computed(() => searchQuery.value || filterCategory.value || filterEventType.value || filterRegion.value)
const clearFilters = () => { searchQuery.value = filterCategory.value = filterEventType.value = filterRegion.value = '' }

const filteredMaterials = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  let list = materials.value.filter(mat => {
    const matchQ  = !q || mat.title.toLowerCase().includes(q) || mat.category.toLowerCase().includes(q)
    const matchC  = !filterCategory.value  || mat.category  === filterCategory.value
    const matchET = !filterEventType.value || mat.eventType === filterEventType.value
    const matchR  = !filterRegion.value    || mat.region    === filterRegion.value
    return matchQ && matchC && matchET && matchR
  })
  const k = sortKey.value
  return [...list].sort((a, b) => {
    const av = a[k] ?? '', bv = b[k] ?? ''
    if (typeof av === 'number') return (av - bv) * sortDir.value
    return String(av).localeCompare(String(bv), 'ka') * sortDir.value
  })
})

const openAdd    = () => { Object.assign(form, { title:'', eventType:'', category:'', region:'', eventDate:'', description:'', fileType:'PDF', fileName:'' }); formError.value=''; formSaved.value=false; drawerOpen.value=true }
const closeDrawer= () => { drawerOpen.value = false }

const triggerFileInput = () => fileInput.value?.click()
const onFileChange = (e) => { form.fileName = e.target.files[0]?.name ?? '' }

const saveMaterial = () => {
  formError.value = ''
  if (!form.title) { formError.value = 'სახელი სავალდებულოა.'; return }
  if (!form.eventType || !form.category || !form.region) { formError.value = 'ღონისძიება, მიმართულება და რეგიონი სავალდებულოა.'; return }
  materials.value.unshift({
    id: nextId++,
    title:       form.title,
    fileType:    form.fileType,
    eventType:   form.eventType,
    eventTypeKey:typeKeyMap[form.eventType] ?? 'meeting',
    category:    form.category,
    categoryKey: catKeyMap[form.category]   ?? 'biz',
    region:      form.region,
    uploader:    'მარინე გელაშვილი',
    uploadDate:  fmtDate(new Date()),
    eventDate:   form.eventDate ? fmtDate(new Date(form.eventDate)) : '—',
    uploadTs:    Date.now(),
    description: form.description,
  })
  formSaved.value = true
  setTimeout(() => { formSaved.value = false; closeDrawer() }, 1500)
}

const downloadMaterial = (mat) => { alert(`ჩამოტვირთვა: ${mat.title} (${mat.fileType})`) }
</script>
