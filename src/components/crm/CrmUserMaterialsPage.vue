<template>
  <InnerPageLayout title="სასწავლო მასალა" breadcrumb="სასწავლო მასალა">
    <div class="mem-page-bg">
    <div class="container mem-body">

      <!-- Stats -->
      <div class="mem-stats-bar">
        <div class="mem-stat"><strong>{{ materials.length }}</strong><span>სულ მასალა</span></div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat"><strong>{{ savedCount }}</strong><span>შენახული</span></div>
        <div class="mem-stat-sep"></div>
        <div class="mem-stat"><strong>{{ newCount }}</strong><span>ახალი</span></div>
        <div class="mem-stats-actions" style="margin-left:auto">
          <div class="mat-view-toggle">
            <button type="button" :class="['mat-view-btn',{active:viewMode==='grid'}]" @click="viewMode='grid'" title="კარტები">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </button>
            <button type="button" :class="['mat-view-btn',{active:viewMode==='list'}]" @click="viewMode='list'" title="სია">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="mem-filters">
        <div class="mem-search-wrap">
          <svg class="mem-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" class="mem-search-input" v-model="searchQuery" placeholder="მასალის სახელი, კატეგორია..." />
          <button v-if="searchQuery" type="button" class="mem-search-clear" @click="searchQuery=''">✕</button>
        </div>
        <select class="mem-filter-select" v-model="filterCategory">
          <option value="">ყველა კატეგორია</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
        <select class="mem-filter-select" v-model="filterType">
          <option value="">ყველა ტიპი</option>
          <option value="PDF">PDF</option>
          <option value="PPTX">PPTX</option>
          <option value="DOC">DOC</option>
          <option value="VIDEO">ვიდეო</option>
        </select>
        <button v-if="filterCategory||filterType||searchQuery" type="button" class="mem-clear-filters" @click="clearFilters">გასუფთავება</button>
      </div>

      <!-- Empty -->
      <div v-if="filtered.length===0" class="mat-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".25"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <p>მასალა ვერ მოიძებნა</p>
      </div>

      <!-- Grid -->
      <div v-else-if="viewMode==='grid'" class="mat-grid">
        <div v-for="m in filtered" :key="m.id" class="mat-card">
          <div class="mat-card-top" :class="`mat-bg-${m.bgKey}`">
            <span class="mat-file-icon">{{ fileIcon(m.fileType) }}</span>
            <span class="mat-filetype-label">{{ m.fileType }}</span>
            <button type="button" class="umat-save-btn" :class="{saved:m.isSaved}" @click.stop="m.isSaved=!m.isSaved" :title="m.isSaved?'შენახულიდან ამოღება':'შენახვა'">
              <svg width="13" height="13" viewBox="0 0 24 24" :fill="m.isSaved?'currentColor':'none'" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </button>
          </div>
          <div class="mat-card-body">
            <div class="mat-card-meta">
              <span class="mem-activity-tag">{{ m.category }}</span>
              <span v-if="m.isNew" class="umat-new-badge">ახალი</span>
            </div>
            <div class="mat-card-title">{{ m.title }}</div>
            <div class="mat-card-desc">{{ m.description }}</div>
            <div class="mat-card-footer">
              <span class="mat-card-info">{{ m.date }}</span>
              <a href="#" class="crm-btn-outline" style="font-size:.75rem;padding:.3rem .75rem" @click.prevent>ჩამოტვირთვა</a>
            </div>
          </div>
        </div>
      </div>

      <!-- List -->
      <div v-else class="mem-table-wrap">
        <table class="mem-table">
          <thead>
            <tr>
              <th>ტიპი</th>
              <th>დასახელება</th>
              <th>კატეგორია</th>
              <th>თარიღი</th>
              <th>შენახ.</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in filtered" :key="m.id" class="mem-row">
              <td><span class="mat-filetype-label" style="background:var(--bg);color:var(--text-muted);border:1.5px solid var(--border);border-radius:6px;padding:.15rem .45rem;font-size:.72rem;font-weight:700">{{ m.fileType }}</span></td>
              <td class="mem-cell-company">
                {{ m.title }}
                <span v-if="m.isNew" class="umat-new-badge" style="margin-left:.4rem">ახალი</span>
              </td>
              <td><span class="mem-activity-tag">{{ m.category }}</span></td>
              <td class="mem-cell-muted">{{ m.date }}</td>
              <td>
                <button type="button" class="umat-save-btn" :class="{saved:m.isSaved}" @click="m.isSaved=!m.isSaved">
                  <svg width="13" height="13" viewBox="0 0 24 24" :fill="m.isSaved?'currentColor':'none'" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                </button>
              </td>
              <td><a href="#" class="crm-btn-outline" style="font-size:.75rem;padding:.25rem .65rem;white-space:nowrap" @click.prevent>ჩამოტ.</a></td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
    </div>
  </InnerPageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import InnerPageLayout from '../website/shared/InnerPageLayout.vue'

const searchQuery    = ref('')
const filterCategory = ref('')
const filterType     = ref('')
const viewMode       = ref('grid')

const categories = ['ბიზნეს მართვა','ფინანსები','გაყიდვები','ციფრული','იურიდიული','HR','ექსპორტი']

const materials = ref([
  { id:1,  title:'სესხზე წვდომის გზამკვლევი 2025',      category:'ფინანსები',     fileType:'PDF',   bgKey:'fin',     isNew:true,  isSaved:true,  date:'10 მარ 2025', description:'ბანკური და არასაბანკო ფინანსური ინსტრუმენტების სახელმძღვანელო მეწარმეებისთვის.' },
  { id:2,  title:'ბიზნეს მოდელის Canvas შაბლონი',       category:'ბიზნეს მართვა', fileType:'PPTX',  bgKey:'biz',     isNew:true,  isSaved:false, date:'5 მარ 2025',  description:'Business Model Canvas-ის ინტერაქტიური შაბლონი ქართულ ენაზე.' },
  { id:3,  title:'გაყიდვების ტექნიკები — B2B',           category:'გაყიდვები',     fileType:'PDF',   bgKey:'mkt',     isNew:false, isSaved:true,  date:'20 თებ 2025', description:'B2B გაყიდვების ეფექტური მეთოდები და ფსიქოლოგია.' },
  { id:4,  title:'ვებ-გვერდის SEO ოპტიმიზაცია',         category:'ციფრული',       fileType:'VIDEO', bgKey:'digital', isNew:false, isSaved:false, date:'14 თებ 2025', description:'საძიებო სისტემებისთვის ოპტიმიზაციის ვიდეო-გზამკვლევი.' },
  { id:5,  title:'შრომის სამართლებრივი ჩარჩო',           category:'იურიდიული',     fileType:'PDF',   bgKey:'legal',   isNew:false, isSaved:false, date:'8 თებ 2025',  description:'დასაქმებასა და შრომის ანაზღაურებასთან დაკავშირებული სამართლებრივი ნორმები.' },
  { id:6,  title:'HR მართვა — შეფასების ინსტ.',           category:'HR',            fileType:'DOC',   bgKey:'hr',      isNew:false, isSaved:false, date:'1 თებ 2025',  description:'თანამშრომლების შეფასების სახელმძღვანელო და შაბლონები.' },
  { id:7,  title:'ექსპორტის ბაზრის ანალიზი 2025',        category:'ექსპორტი',      fileType:'PDF',   bgKey:'exp',     isNew:true,  isSaved:false, date:'25 იან 2025', description:'ევროპული ბაზრებზე ქართული პროდუქციის ექსპორტის შესაძლებლობები.' },
  { id:8,  title:'ბუღალტრული აღრიცხვის საფუძვლები',     category:'ფინანსები',     fileType:'PPTX',  bgKey:'fin',     isNew:false, isSaved:true,  date:'18 იან 2025', description:'მცირე ბიზნესისთვის ბუღალტრული ჩანაწერების წარმოების სახელმძღვანელო.' },
  { id:9,  title:'სოციალური მედიის სტრატეგია',           category:'გაყიდვები',     fileType:'PDF',   bgKey:'mkt',     isNew:false, isSaved:false, date:'10 იან 2025', description:'Facebook, Instagram და LinkedIn-ის ეფექტური გამოყენება ბიზნესისთვის.' },
])

const savedCount = computed(() => materials.value.filter(m => m.isSaved).length)
const newCount   = computed(() => materials.value.filter(m => m.isNew).length)

const clearFilters = () => { searchQuery.value=''; filterCategory.value=''; filterType.value='' }

const filtered = computed(() => {
  let list = materials.value
  const q = searchQuery.value.toLowerCase()
  if (q) list = list.filter(m => m.title.toLowerCase().includes(q) || m.category.toLowerCase().includes(q))
  if (filterCategory.value) list = list.filter(m => m.category === filterCategory.value)
  if (filterType.value)     list = list.filter(m => m.fileType  === filterType.value)
  return list
})

const fileIcon = (t) => ({ PDF:'📄', PPTX:'📊', DOC:'📝', VIDEO:'▶' })[t] || '📄'
</script>
