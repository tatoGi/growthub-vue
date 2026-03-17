<template>
  <InnerPageLayout title="შეტყობინებები" breadcrumb="შეტყობინებები">
    <div class="container msg-page-body">

      <!-- Toolbar -->
      <div class="msg-toolbar">
        <div class="msg-filter-tabs">
          <button
            v-for="tab in filterTabs"
            :key="tab.key"
            type="button"
            class="msg-filter-tab"
            :class="{ active: activeFilter === tab.key }"
            @click="activeFilter = tab.key; selectedId = null"
          >
            {{ tab.label }}
            <span v-if="tab.key === 'unread' && unreadCount > 0" class="msg-badge">{{ unreadCount }}</span>
          </button>
        </div>

        <div class="msg-search-bar">
          <div class="msg-search-field">
            <span class="msg-search-icon">⌕</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="შეტყობინების ძიება..."
              @input="selectedId = null"
            />
          </div>
          <div class="msg-date-range">
            <input type="date" v-model="dateFrom" class="msg-date-input" />
            <span class="msg-date-sep">—</span>
            <input type="date" v-model="dateTo" class="msg-date-input" />
          </div>
        </div>
      </div>

      <!-- Inbox layout -->
      <div class="msg-inbox" :class="{ 'detail-open': selectedId !== null }">

        <!-- Message list -->
        <div class="msg-list">
          <div v-if="filteredMessages.length === 0" class="msg-empty">
            <span>შეტყობინება ვერ მოიძებნა</span>
          </div>
          <button
            v-for="msg in filteredMessages"
            :key="msg.id"
            type="button"
            class="msg-item"
            :class="{ unread: !msg.read, selected: selectedId === msg.id }"
            @click="openMessage(msg)"
          >
            <div class="msg-item-avatar" :style="{ background: msg.senderColor }">
              {{ msg.sender.charAt(0) }}
            </div>
            <div class="msg-item-body">
              <div class="msg-item-row">
                <span class="msg-item-sender">{{ msg.sender }}</span>
                <span class="msg-item-date">{{ msg.date }}</span>
              </div>
              <div class="msg-item-subject">{{ msg.subject }}</div>
              <div class="msg-item-preview">{{ msg.preview }}</div>
            </div>
            <span v-if="!msg.read" class="msg-unread-dot" />
          </button>
        </div>

        <!-- Message detail -->
        <div class="msg-detail" :class="{ active: selectedId !== null }">
          <template v-if="selected">
            <div class="msg-detail-header">
              <button type="button" class="msg-back-btn" @click="selectedId = null">← უკან</button>
              <div class="msg-detail-meta">
                <div class="msg-detail-avatar" :style="{ background: selected.senderColor }">
                  {{ selected.sender.charAt(0) }}
                </div>
                <div>
                  <strong>{{ selected.sender }}</strong>
                  <span>{{ selected.date }}</span>
                </div>
              </div>
              <h2 class="msg-detail-subject">{{ selected.subject }}</h2>
              <span class="msg-detail-tag" :class="selected.category">{{ selected.categoryLabel }}</span>
            </div>
            <div class="msg-detail-content">
              <p v-for="(para, i) in selected.body" :key="i">{{ para }}</p>
            </div>
            <div v-if="selected.actions?.length" class="msg-detail-actions">
              <button
                v-for="action in selected.actions"
                :key="action.label"
                type="button"
                :class="action.style === 'primary' ? 'crm-btn-primary' : 'crm-btn-outline'"
              >
                {{ action.label }}
              </button>
            </div>
          </template>
          <div v-else class="msg-detail-empty">
            <span>აირჩიეთ შეტყობინება სანახავად</span>
          </div>
        </div>

      </div>
    </div>
  </InnerPageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import InnerPageLayout from '../website/shared/InnerPageLayout.vue'

const activeFilter = ref('all')
const searchQuery = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const selectedId = ref(null)

const filterTabs = [
  { key: 'all',    label: 'ყველა' },
  { key: 'unread', label: 'წაუკითხავი' },
  { key: 'events', label: 'ღონისძიებები' },
  { key: 'visits', label: 'ვიზიტები' },
  { key: 'system', label: 'სისტემური' },
]

const messages = ref([
  {
    id: 1,
    sender: 'GrowthHub ცენტრი',
    senderColor: '#6366f1',
    date: '15 მარ 2026',
    subject: 'ვიზიტი ცენტრში დაჯავშნილია',
    preview: 'თქვენი ვიზიტი ცენტრში დაჯავშნილია 18 მარტს, 11:00 საათზე.',
    category: 'visits',
    categoryLabel: 'ვიზიტი',
    read: false,
    body: [
      'გამარჯობა,',
      'თქვენი ვიზიტი GrowthHub-ის ქუთაისის ცენტრში წარმატებით დაიჯავშნა.',
      'თარიღი: 18 მარტი 2026, სამშაბათი',
      'დრო: 11:00 – 12:00',
      'ადგილი: ქუთაისი, ხვამლის ქ. №5',
      'კონსულტანტი: მარინე გელაშვილი',
      'გთხოვთ, ვიზიტამდე მოიტანოთ კომპანიის ამონაწერი მეწარმეთა რეესტრიდან.',
    ],
    actions: [
      { label: 'კალენდარში დამატება', style: 'primary' },
      { label: 'გადავადება', style: 'outline' },
    ],
  },
  {
    id: 2,
    sender: 'GrowthHub პლატფორმა',
    senderColor: '#0ea5e9',
    date: '10 მარ 2026',
    subject: 'რეგისტრაცია ტრენინგზე „ბიზნეს გეგმის შედგენა"',
    preview: 'წარმატებით დარეგისტრირდით ტრენინგზე. ღონისძიება გაიმართება 22 მარტს.',
    category: 'events',
    categoryLabel: 'ღონისძიება',
    read: false,
    body: [
      'გამარჯობა,',
      'წარმატებით დარეგისტრირდით ტრენინგზე „ბიზნეს გეგმის შედგენა — პრაქტიკული კურსი".',
      'ღონისძიება: 22 მარტი 2026, 10:00 – 14:00',
      'ფორმატი: ონლაინ (Zoom)',
      'ლინკი გამოგეგზავნებათ ღონისძიებამდე 24 საათით ადრე.',
    ],
    actions: [
      { label: 'ღონისძიების დეტალები', style: 'primary' },
    ],
  },
  {
    id: 3,
    sender: 'კონსულტანტი — ლაშა კვარაცხელია',
    senderColor: '#f59e0b',
    date: '4 მარ 2026',
    subject: 'ბიზნეს-დიაგნოსტიკის პასუხი',
    preview: 'გაგზავნილი დიაგნოსტიკის კითხვარი განხილულ იქნა. შედეგები თანდართულია.',
    category: 'system',
    categoryLabel: 'სისტემური',
    read: true,
    body: [
      'გამარჯობა,',
      'თქვენი ბიზნეს-დიაგნოსტიკის კითხვარი განხილულ იქნა.',
      'ძირითადი შედეგები:',
      '• ფინანსური მდგრადობა: საშუალო (68/100)',
      '• ციფრული მზაობა: დაბალი (41/100)',
      '• გაყიდვების სისტემა: კარგი (74/100)',
      'რეკომენდაცია: გირჩევთ გაიაროთ ციფრული ტრანსფორმაციის კონსულტაცია.',
    ],
    actions: [
      { label: 'სრული ანგარიშის ნახვა', style: 'primary' },
      { label: 'კონსულტაციის დაჯავშნა', style: 'outline' },
    ],
  },
  {
    id: 4,
    sender: 'GrowthHub პლატფორმა',
    senderColor: '#10b981',
    date: '25 თებ 2026',
    subject: 'ახალი სასწავლო მასალა ხელმისაწვდომია',
    preview: 'თქვენთვის დამატებულია ახალი სასწავლო მასალა — „სესხზე წვდომის გზამკვლევი".',
    category: 'system',
    categoryLabel: 'სისტემური',
    read: true,
    body: [
      'გამარჯობა,',
      'თქვენი კომპანიის პროფილის საფუძველზე, სასწავლო ბიბლიოთეკაში დაემატა ახალი მასალა:',
      '• „სესხზე წვდომის გზამკვლევი" — PDF, 24 გვ.',
      '• „ფინანსური ანალიზის შაბლონი" — Excel',
      'მასალების სანახავად გადადით „სასწავლო მასალა" გვერდზე.',
    ],
  },
  {
    id: 5,
    sender: 'GrowthHub ცენტრი',
    senderColor: '#8b5cf6',
    date: '18 თებ 2026',
    subject: 'ცენტრში იგეგმება თხილის მეწარმეთა შეხვედრა',
    preview: 'პლატფორმა გიწვევთ სექტორული შეხვედრაზე — 5 მარტი, 14:00.',
    category: 'events',
    categoryLabel: 'ღონისძიება',
    read: true,
    body: [
      'გამარჯობა,',
      'GrowthHub-ის ქუთაისის ცენტრი გიწვევთ სექტორულ შეხვედრაზე — თხილის სექტორის მეწარმეებისთვის.',
      'თარიღი: 5 მარტი 2026, 14:00 – 16:00',
      'ადგილი: GrowthHub ქუთაისი',
      'თემები: ექსპორტის შესაძლებლობები, ევროპული სტანდარტები, ფინანსური ინსტრუმენტები.',
      'სავალდებულოა წინასწარი რეგისტრაცია.',
    ],
    actions: [
      { label: 'რეგისტრაცია', style: 'primary' },
    ],
  },
])

const unreadCount = computed(() => messages.value.filter(m => !m.read).length)

const filteredMessages = computed(() => {
  return messages.value.filter(m => {
    if (activeFilter.value === 'unread' && m.read) return false
    if (activeFilter.value !== 'all' && activeFilter.value !== 'unread' && m.category !== activeFilter.value) return false
    if (searchQuery.value && !m.subject.toLowerCase().includes(searchQuery.value.toLowerCase()) && !m.preview.toLowerCase().includes(searchQuery.value.toLowerCase())) return false
    return true
  })
})

const selected = computed(() => messages.value.find(m => m.id === selectedId.value) ?? null)

const openMessage = (msg) => {
  selectedId.value = msg.id
  msg.read = true
}
</script>
