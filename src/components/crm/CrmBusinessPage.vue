<template>
  <InnerPageLayout title="ჩემი ანგარიში" breadcrumb="ჩემი ანგარიში">
    <div class="container crm-account-body">

      <div class="crm-account-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="crm-account-tab"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- TAB 1: კომპანია -->
      <section v-if="activeTab === 'company'" class="crm-tab-section">
        <div class="crm-form-block">
          <h3 class="crm-form-block-title">მეწარმის შესახებ</h3>
          <div class="crm-form-grid">
            <div class="crm-field">
              <label>დასახელება</label>
              <input type="text" :value="company.name" disabled />
            </div>
            <div class="crm-field">
              <label>საიდენტიფიკაციო კოდი</label>
              <input type="text" :value="company.idCode" disabled />
            </div>
            <div class="crm-field">
              <label>ბრენდი / ბიზნესის სახელი</label>
              <input type="text" v-model="company.brand" placeholder="ბრენდის სახელი" />
            </div>
          </div>
          <div class="crm-form-actions">
            <button type="button" class="crm-btn-primary" @click="saved = true">ინფორმაციის შენახვა</button>
            <span v-if="saved" class="crm-save-hint">შენახულია</span>
          </div>
        </div>

        <div class="crm-form-block">
          <h3 class="crm-form-block-title">საქმიანობის სფერო</h3>
          <div class="crm-form-grid">
            <div class="crm-field">
              <label>NACE კოდი (საქმიანობის სფერო)</label>
              <input type="text" v-model="company.nace" placeholder="აკრიფეთ სფეროს სახელი..." />
            </div>
            <div class="crm-field">
              <label>HS კოდი (პროდუქციის სასაქონლო კოდი)</label>
              <input type="text" v-model="company.hs" placeholder="აკრიფეთ კოდი ან სახელი..." />
            </div>
          </div>
        </div>

        <div class="crm-form-block">
          <div class="crm-block-head">
            <h3 class="crm-form-block-title">ბიზნესის განხორციელების ადგილი</h3>
            <button type="button" class="crm-btn-outline" @click="showLocationForm = !showLocationForm">
              + ლოკაციის დამატება
            </button>
          </div>

          <div v-if="locations.length === 0 && !showLocationForm" class="crm-empty-state">
            <span>ლოკაციები დამატებული არ არის</span>
          </div>

          <div v-if="locations.length > 0" class="crm-location-list">
            <div v-for="loc in locations" :key="loc.id" class="crm-location-card">
              <span class="crm-location-region">{{ loc.region }}</span>
              <span>{{ loc.municipality }}, {{ loc.address }}</span>
              <span class="crm-location-meta">{{ loc.employees }} დასაქმებული</span>
              <button type="button" class="crm-icon-btn" @click="removeLocation(loc.id)">✕</button>
            </div>
          </div>

          <div v-if="showLocationForm" class="crm-inline-form">
            <div class="crm-form-grid">
              <div class="crm-field">
                <label>რეგიონი</label>
                <select v-model="newLocation.region">
                  <option value="">აირჩიეთ რეგიონი</option>
                  <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
                </select>
              </div>
              <div class="crm-field">
                <label>მუნიციპალიტეტი</label>
                <input type="text" v-model="newLocation.municipality" placeholder="მუნიციპალიტეტი" />
              </div>
              <div class="crm-field">
                <label>მისამართი</label>
                <input type="text" v-model="newLocation.address" placeholder="ქუჩა, №..." />
              </div>
              <div class="crm-field">
                <label>მუდმივად დასაქმებულთა რაოდენობა</label>
                <input type="number" v-model="newLocation.employees" placeholder="0" min="0" />
              </div>
              <div class="crm-field">
                <label>მათ შორის ქალი</label>
                <input type="number" v-model="newLocation.women" placeholder="0" min="0" />
              </div>
              <div class="crm-field">
                <label>სეზონური დასაქმება</label>
                <input type="number" v-model="newLocation.seasonal" placeholder="0" min="0" />
              </div>
            </div>
            <div class="crm-form-actions">
              <button type="button" class="crm-btn-primary" @click="addLocation">დამატება</button>
              <button type="button" class="crm-btn-ghost" @click="showLocationForm = false">გაუქმება</button>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 2: სერვისები -->
      <section v-else-if="activeTab === 'services'" class="crm-tab-section">
        <div class="crm-form-block">
          <h3 class="crm-form-block-title">ხელმისაწვდომი სერვისები</h3>
          <p class="crm-form-block-hint">სერვისებზე წვდომის გასახსნელად ატვირთეთ შესაბამისი კრიტერიუმების დამადასტურებელი დოკუმენტები „კრიტერიუმები" ჩანართში.</p>
          <div class="crm-services-grid">
            <div v-for="svc in services" :key="svc.id" class="crm-service-card" :class="{ unlocked: svc.unlocked }">
              <div class="crm-service-icon">{{ svc.unlocked ? '✓' : '○' }}</div>
              <div class="crm-service-info">
                <strong>{{ svc.title }}</strong>
                <span>{{ svc.description }}</span>
              </div>
              <span class="crm-service-status">{{ svc.unlocked ? 'ხელმისაწვდომია' : 'კრიტერიუმი საჭიროა' }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 3: დირექტორი / დამფუძნებელი -->
      <section v-else-if="activeTab === 'director'" class="crm-tab-section">
        <div class="crm-form-block">
          <h3 class="crm-form-block-title">კომპანიის წარმომადგენელი</h3>
          <div class="crm-form-grid">
            <div class="crm-field">
              <label>სახელი</label>
              <input type="text" :value="director.firstName" disabled />
            </div>
            <div class="crm-field">
              <label>გვარი</label>
              <input type="text" :value="director.lastName" disabled />
            </div>
            <div class="crm-field">
              <label>პირადი ნომერი</label>
              <input type="text" :value="director.personalId" disabled />
            </div>
            <div class="crm-field">
              <label>დაბადების თარიღი</label>
              <input type="text" :value="director.birthDate" disabled />
            </div>
            <div class="crm-field">
              <label>ტელეფონი</label>
              <div class="crm-input-prefix">
                <span>+995</span>
                <input type="tel" v-model="director.phone" placeholder="5XXXXXXXX" />
              </div>
            </div>
            <div class="crm-field">
              <label>ელ. ფოსტა</label>
              <input type="email" :value="director.email" disabled />
            </div>
          </div>
          <div class="crm-form-actions">
            <button type="button" class="crm-btn-primary">ინფორმაციის შენახვა</button>
          </div>
        </div>

        <div class="crm-form-block">
          <h3 class="crm-form-block-title">დამფუძნებლები — ფიზიკური პირი</h3>
          <div v-if="founders.individuals.length === 0" class="crm-empty-state">
            <span>ფიზიკური პირი-დამფუძნებელი დამატებული არ არის</span>
          </div>
          <table v-else class="crm-table">
            <thead>
              <tr>
                <th>სახელი, გვარი</th>
                <th>პირადი ნომერი</th>
                <th>წილი</th>
                <th>საკონტაქტო ნომერი</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="f in founders.individuals" :key="f.id">
                <td>{{ f.name }}</td>
                <td>{{ f.personalId }}</td>
                <td>{{ f.share }}%</td>
                <td>{{ f.phone }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="crm-form-block">
          <h3 class="crm-form-block-title">დამფუძნებლები — იურიდიული პირი</h3>
          <div v-if="founders.legal.length === 0" class="crm-empty-state">
            <span>იურიდიული პირი-დამფუძნებელი დამატებული არ არის</span>
          </div>
          <table v-else class="crm-table">
            <thead>
              <tr>
                <th>დასახელება</th>
                <th>საიდენტიფიკაციო კოდი</th>
                <th>წილი</th>
                <th>SARAS კატეგორია</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="f in founders.legal" :key="f.id">
                <td>{{ f.name }}</td>
                <td>{{ f.idCode }}</td>
                <td>{{ f.share }}%</td>
                <td>{{ f.saras }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- TAB 4: საკონტაქტო პირი -->
      <section v-else-if="activeTab === 'contact'" class="crm-tab-section">
        <div class="crm-form-block">
          <div class="crm-block-head">
            <h3 class="crm-form-block-title">საკონტაქტო პირები</h3>
            <button type="button" class="crm-btn-outline" @click="showContactForm = !showContactForm">
              + საკონტაქტო პირის დამატება
            </button>
          </div>

          <div v-if="contacts.length === 0 && !showContactForm" class="crm-empty-state">
            <span>საკონტაქტო პირი დამატებული არ არის</span>
          </div>

          <div v-if="contacts.length > 0" class="crm-contact-list">
            <div v-for="c in contacts" :key="c.id" class="crm-contact-card">
              <div class="crm-contact-avatar">{{ c.firstName?.charAt(0) }}</div>
              <div class="crm-contact-info">
                <strong>{{ c.firstName }} {{ c.lastName }}</strong>
                <span>{{ c.position }}</span>
                <span>{{ c.phone }} · {{ c.email }}</span>
              </div>
              <button type="button" class="crm-icon-btn" @click="removeContact(c.id)">✕</button>
            </div>
          </div>

          <div v-if="showContactForm" class="crm-inline-form">
            <div class="crm-form-grid">
              <div class="crm-field">
                <label>პირადი ნომერი</label>
                <input type="text" v-model="newContact.personalId" maxlength="11" placeholder="11 ციფრი" />
              </div>
              <div class="crm-field">
                <label>დაბადების წელი</label>
                <input type="text" v-model="newContact.birthYear" maxlength="4" placeholder="მაგ. 1990" />
              </div>
              <div class="crm-field">
                <label>სახელი</label>
                <input type="text" v-model="newContact.firstName" placeholder="სახელი" />
              </div>
              <div class="crm-field">
                <label>გვარი</label>
                <input type="text" v-model="newContact.lastName" placeholder="გვარი" />
              </div>
              <div class="crm-field">
                <label>პოზიცია</label>
                <input type="text" v-model="newContact.position" placeholder="პოზიცია" />
              </div>
              <div class="crm-field">
                <label>ტელეფონი</label>
                <input type="tel" v-model="newContact.phone" placeholder="5XXXXXXXX" />
              </div>
              <div class="crm-field">
                <label>ელ. ფოსტა</label>
                <input type="email" v-model="newContact.email" placeholder="mail@example.com" />
              </div>
            </div>
            <div class="crm-form-actions">
              <button type="button" class="crm-btn-primary" @click="addContact">დამატება</button>
              <button type="button" class="crm-btn-ghost" @click="showContactForm = false">გაუქმება</button>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 5: კრიტერიუმები -->
      <section v-else-if="activeTab === 'criteria'" class="crm-tab-section">
        <div class="crm-form-block">
          <h3 class="crm-form-block-title">კრიტერიუმები და დოკუმენტები</h3>
          <p class="crm-form-block-hint">შეავსეთ კრიტერიუმები და ატვირთეთ დამადასტურებელი დოკუმენტი სერვისებზე წვდომის გასახსნელად.</p>
          <div class="crm-criteria-list">
            <div v-for="cr in criteria" :key="cr.id" class="crm-criteria-item">
              <div class="crm-criteria-header">
                <span class="crm-criteria-name">{{ cr.title }}</span>
                <span class="crm-criteria-tag" :class="cr.status">{{ cr.statusLabel }}</span>
              </div>
              <p class="crm-criteria-desc">{{ cr.description }}</p>
              <div class="crm-criteria-upload">
                <label class="crm-upload-btn">
                  <input type="file" hidden />
                  დოკუმენტის ატვირთვა
                </label>
                <span v-if="cr.fileName" class="crm-upload-filename">{{ cr.fileName }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 6: ბიზნეს უნივერსალი -->
      <section v-else-if="activeTab === 'universal'" class="crm-tab-section">
        <div class="crm-form-block">
          <h3 class="crm-form-block-title">ბიზნეს უნივერსალი</h3>
          <p class="crm-form-block-hint">ბიზნეს უნივერსალის ჩანაწერები და სტატუსი.</p>
          <div class="crm-universal-grid">
            <div v-for="item in universalItems" :key="item.id" class="crm-universal-card">
              <span class="crm-universal-label">{{ item.label }}</span>
              <strong class="crm-universal-value">{{ item.value }}</strong>
              <span class="crm-universal-note">{{ item.note }}</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  </InnerPageLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import InnerPageLayout from '../website/shared/InnerPageLayout.vue'

const activeTab = ref('company')
const saved = ref(false)
const showLocationForm = ref(false)
const showContactForm = ref(false)

const tabs = [
  { key: 'company',   label: 'კომპანია' },
  { key: 'services',  label: 'სერვისები' },
  { key: 'director',  label: 'დირექტორი' },
  { key: 'contact',   label: 'საკონტაქტო პირი' },
  { key: 'criteria',  label: 'კრიტერიუმები' },
  { key: 'universal', label: 'ბიზნეს უნივერსალი' },
]

const company = reactive({
  name: 'შპს ბიზნეს მაგალითი',
  idCode: '123456789',
  brand: '',
  nace: '',
  hs: '',
})

const regions = ['თბილისი', 'აჭარა', 'გურია', 'იმერეთი', 'კახეთი', 'მცხეთა-მთიანეთი', 'რაჭა-ლეჩხუმი', 'სამეგრელო', 'სამცხე-ჯავახეთი', 'ქვემო ქართლი', 'შიდა ქართლი']

const locations = ref([])
const newLocation = reactive({ region: '', municipality: '', address: '', employees: '', women: '', seasonal: '' })
const addLocation = () => {
  if (!newLocation.region) return
  locations.value.push({ id: Date.now(), ...newLocation })
  Object.assign(newLocation, { region: '', municipality: '', address: '', employees: '', women: '', seasonal: '' })
  showLocationForm.value = false
}
const removeLocation = (id) => {
  locations.value = locations.value.filter(l => l.id !== id)
}

const director = reactive({
  firstName: 'გიორგი',
  lastName: 'მეწარმე',
  personalId: '01001XXXXXX',
  birthDate: '1985-04-12',
  phone: '',
  email: 'director@example.com',
})

const founders = reactive({
  individuals: [],
  legal: [],
})

const contacts = ref([])
const newContact = reactive({ personalId: '', birthYear: '', firstName: '', lastName: '', position: '', phone: '', email: '' })
const addContact = () => {
  if (!newContact.firstName) return
  contacts.value.push({ id: Date.now(), ...newContact })
  Object.assign(newContact, { personalId: '', birthYear: '', firstName: '', lastName: '', position: '', phone: '', email: '' })
  showContactForm.value = false
}
const removeContact = (id) => {
  contacts.value = contacts.value.filter(c => c.id !== id)
}

const services = ref([
  { id: 1, title: 'საკონსულტაციო სერვისი', description: 'ბიზნეს-კონსულტანტის მხარდაჭერა', unlocked: false },
  { id: 2, title: 'საკონსულტაციო სერვისი + შეღავათიანი სესხი', description: 'სუბსიდირების გარეშე', unlocked: false },
  { id: 3, title: 'გარანტია + სესხის სუბსიდირება', description: 'ფინანსური ინსტრუმენტი', unlocked: false },
  { id: 4, title: 'გარანტია + შეღავათიანი სესხი + საკონსულტაციო', description: 'კომბინირებული პაკეტი', unlocked: false },
])

const criteria = ref([
  { id: 1, title: 'მეწარმის სტატუსი', description: 'ამონაწერი მეწარმეთა რეესტრიდან ან IP სტატუსის დამადასტურებელი', status: 'pending', statusLabel: 'მოლოდინში', fileName: '' },
  { id: 2, title: 'ფინანსური ანგარიშგება', description: 'ბოლო ფინანსური წლის ბუღალტრული ანგარიში', status: 'pending', statusLabel: 'მოლოდინში', fileName: '' },
  { id: 3, title: 'ბიზნეს-გეგმა', description: 'სამ-ხუთ წლიანი განვითარების გეგმა', status: 'pending', statusLabel: 'მოლოდინში', fileName: '' },
])

const universalItems = ref([
  { id: 1, label: 'სტატუსი', value: 'აქტიური', note: 'ბიზნეს უნივერსალი' },
  { id: 2, label: 'პროგრამა', value: 'ბიზნეს-მხარდაჭერა 2024', note: 'მიმდინარე' },
  { id: 3, label: 'კოდი', value: 'BU-2024-0042', note: 'იდენტიფიკატორი' },
])
</script>
