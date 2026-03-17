<template>
  <InnerPageLayout title="ფინანსური ინსტიტუტის პროფილი" breadcrumb="ჩემი ანგარიში">
    <div class="mem-page-bg">
    <div class="container mem-body">

      <div class="bkp-layout">

        <!-- Profile card -->
        <div class="bkp-main">

          <div class="bkp-card-header">
            <div class="bkp-avatar">{{ profile.companyName.slice(0,2).toUpperCase() }}</div>
            <div>
              <div class="bkp-company-name">{{ profile.companyName || 'ბანკის დასახელება' }}</div>
              <div class="bkp-company-sub">{{ profile.contactFirst }} {{ profile.contactLast }} · {{ profile.position }}</div>
            </div>
            <span class="co-status-badge co-status-active" style="margin-left:auto">აქტიური</span>
          </div>

          <!-- Company info section -->
          <div class="bkp-section">
            <div class="mem-drawer-section-title">ინსტიტუტის ინფორმაცია</div>
            <div class="crm-form-grid">
              <div class="crm-field" style="grid-column:1/-1">
                <label>კომპანიის დასახელება</label>
                <input type="text" v-model="profile.companyName" placeholder="ბანკის / ინსტიტუტის სრული სახელი" />
              </div>
              <div class="crm-field">
                <label>საიდენტიფიკაციო კოდი</label>
                <input type="text" v-model="profile.idCode" placeholder="9-ნიშნა კოდი" />
              </div>
              <div class="crm-field">
                <label>ვებ-გვერდი</label>
                <input type="text" v-model="profile.website" placeholder="bank.ge" />
              </div>
            </div>
          </div>

          <!-- Contact person section -->
          <div class="bkp-section">
            <div class="mem-drawer-section-title">საკონტაქტო პირი</div>
            <div class="crm-form-grid">
              <div class="crm-field">
                <label>სახელი</label>
                <input type="text" v-model="profile.contactFirst" placeholder="სახელი" />
              </div>
              <div class="crm-field">
                <label>გვარი</label>
                <input type="text" v-model="profile.contactLast" placeholder="გვარი" />
              </div>
              <div class="crm-field">
                <label>პოზიცია</label>
                <input type="text" v-model="profile.position" placeholder="მაგ. ფილიალის მენეჯერი" />
              </div>
              <div class="crm-field">
                <label>ტელეფონის ნომერი</label>
                <input type="text" v-model="profile.phone" placeholder="5XXXXXXXX" maxlength="9" @input="onPhoneInput" />
                <div v-if="phoneError" style="font-size:.75rem;color:#dc2626;margin-top:.25rem">{{ phoneError }}</div>
              </div>
              <div class="crm-field" style="grid-column:1/-1">
                <label>ელ. ფოსტა</label>
                <input type="email" v-model="profile.email" placeholder="name@bank.ge" />
              </div>
            </div>
          </div>

          <div v-if="errorMsg" class="cp-error-msg">{{ errorMsg }}</div>
          <div v-if="saved" class="cp-success-banner">ცვლილებები წარმატებით შენახულია</div>

          <div class="bkp-footer">
            <button type="button" class="crm-btn-primary" @click="save">ცვლილებების შენახვა</button>
          </div>
        </div>

        <!-- Side info -->
        <div class="bkp-side">
          <div class="bkp-side-card">
            <div class="bkp-side-title">პროფილის შევსება</div>
            <div class="bkp-completeness-bar">
              <div class="bkp-completeness-fill" :style="{ width: completeness + '%' }"></div>
            </div>
            <div class="bkp-completeness-pct">{{ completeness }}%</div>
            <div class="bkp-completeness-note">{{ completeness === 100 ? 'პროფილი სრულად შევსებულია' : `${missingFields} ველი დარჩენილია` }}</div>
          </div>

          <div class="bkp-side-card">
            <div class="bkp-side-title">სტატისტიკა</div>
            <div class="co-info-list">
              <div class="co-info-row"><span>სტატუსი</span><span class="co-status-badge co-status-active">აქტიური</span></div>
              <div class="co-info-row"><span>ბოლო შესვლა</span><strong>09:42 · დღეს</strong></div>
              <div class="co-info-row"><span>რეგისტრ. თარიღი</span><strong>15 მარ 2023</strong></div>
              <div class="co-info-row"><span>სააგენტო</span><strong>GrowthHub</strong></div>
            </div>
          </div>

          <div class="bkp-side-card">
            <div class="bkp-side-title">სწრაფი ლინკები</div>
            <a href="#crm/user/messages" class="bkp-quick-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              შეტყობინებები
            </a>
            <a href="#crm/user/changepass" class="bkp-quick-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              პაროლის შეცვლა
            </a>
          </div>
        </div>

      </div>
    </div>
    </div>
  </InnerPageLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import InnerPageLayout from '../website/shared/InnerPageLayout.vue'

const profile = reactive({
  companyName:  'TBC Bank',
  idCode:       '204854595',
  website:      'tbcbank.ge',
  contactFirst: 'ნინო',
  contactLast:  'მაისურაძე',
  position:     'ბიზნეს სეგმენტის ხელმძ.',
  phone:        '558000000',
  email:        'nino.maisur@tbcbank.ge',
})

const saved    = ref(false)
const errorMsg = ref('')
const phoneError = ref('')

const onPhoneInput = () => {
  phoneError.value = profile.phone.length > 0 && profile.phone.length !== 9 ? 'ტელეფონი უნდა იყოს 9 ციფრი' : ''
}

const fieldsToCheck = ['companyName','contactFirst','contactLast','position','phone','email']
const completeness = computed(() => {
  const filled = fieldsToCheck.filter(k => profile[k] && profile[k].trim().length > 0).length
  return Math.round((filled / fieldsToCheck.length) * 100)
})
const missingFields = computed(() => fieldsToCheck.length - fieldsToCheck.filter(k => profile[k] && profile[k].trim().length > 0).length)

const save = () => {
  errorMsg.value = ''
  if (!profile.companyName.trim()) { errorMsg.value = 'კომპანიის სახელი სავალდებულოა'; return }
  if (profile.phone && profile.phone.length !== 9) { errorMsg.value = 'ტელეფონი უნდა იყოს 9 ციფრი'; return }
  saved.value = true
  setTimeout(() => { saved.value = false }, 2500)
}
</script>
