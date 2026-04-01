<template>
  <!-- Central profile -->
  <InnerPageLayout v-if="role === 'central'" title="ჩემი ანგარიში" breadcrumb="ჩემი ანგარიში">
    <div class="container crm-account-body">

      <div class="cp-header-card">
        <div class="cp-avatar">{{ initials }}</div>
        <div class="cp-header-info">
          <h2>{{ auth.user?.name }}</h2>
          <span class="cp-role-badge">ცენტრალური</span>
        </div>
        <div class="cp-header-meta">
          <div class="cp-meta-item"><span>ელ. ფოსტა</span><strong>{{ auth.user?.email }}</strong></div>
        </div>
      </div>

      <div class="cp-main-grid">
        <div class="crm-form-block">
          <h3 class="crm-form-block-title">პროფილის ინფორმაცია</h3>
          <p class="crm-form-block-hint">ძირითადი მონაცემები სისტემიდან მოდის და რედაქტირებას არ ექვემდებარება.</p>
          <div class="cp-info-list">
            <div class="cp-info-row"><span class="cp-info-label">სახელი, გვარი</span><span class="cp-info-value">{{ auth.user?.name }}</span></div>
            <div class="cp-info-row"><span class="cp-info-label">ელ. ფოსტა</span><span class="cp-info-value">{{ auth.user?.email }}</span></div>
            <div class="cp-info-row"><span class="cp-info-label">პოზიცია</span><span class="cp-info-value">ცენტრის თანამშრომელი</span></div>
          </div>
        </div>

        <div class="crm-form-block">
          <h3 class="crm-form-block-title">საკონტაქტო პირი</h3>
          <p class="crm-form-block-hint">დაამატეთ ან განაახლეთ საკონტაქტო პირის ინფორმაცია.</p>
          <div v-if="contactSaved" class="cp-success-banner">ინფორმაცია წარმატებით შენახულია</div>
          <div v-if="contactError" class="cp-error-msg">{{ contactError }}</div>
          <div class="crm-form-grid" style="grid-template-columns: 1fr">
            <div class="crm-field">
              <label>სახელი, გვარი</label>
              <input type="text" v-model="contact.name" placeholder="სახელი, გვარი" />
            </div>
            <div class="crm-field">
              <label>ტელეფონის ნომერი</label>
              <div class="crm-input-prefix">
                <span>+995</span>
                <input type="tel" v-model="contact.phone" placeholder="5XXXXXXXX" />
              </div>
            </div>
            <div class="crm-field">
              <label>ვინაობა</label>
              <input type="text" v-model="contact.relationship" placeholder="მაგ. ხელმძღვანელი, ასისტენტი..." />
            </div>
          </div>
          <div class="crm-form-actions">
            <button type="button" class="crm-btn-primary" @click="saveContact">შენახვა</button>
          </div>
        </div>
      </div>

      <div class="crm-form-block">
        <h3 class="crm-form-block-title">პაროლის შეცვლა</h3>
        <div class="crm-form-grid">
          <div class="crm-field">
            <label>მიმდინარე პაროლი</label>
            <input type="password" v-model="passForm.current" placeholder="••••••••" />
          </div>
          <div></div>
          <div class="crm-field">
            <label>ახალი პაროლი</label>
            <input type="password" v-model="passForm.newPass" placeholder="მინ. 8 სიმბოლო" />
          </div>
          <div class="crm-field">
            <label>გაიმეორეთ ახალი პაროლი</label>
            <input type="password" v-model="passForm.confirm" placeholder="გაიმეორეთ პაროლი" />
          </div>
        </div>
        <div v-if="passError" class="cp-error-msg">{{ passError }}</div>
        <div v-if="passSaved" class="cp-success-banner">პაროლი წარმატებით შეიცვალა</div>
        <div class="crm-form-actions">
          <button type="button" class="crm-btn-primary" @click="savePassword">პაროლის შეცვლა</button>
        </div>
      </div>

    </div>
  </InnerPageLayout>

  <!-- Bank profile -->
  <InnerPageLayout v-else-if="role === 'bank'" title="ფინანსური ინსტიტუტის პროფილი" breadcrumb="ჩემი ანგარიში">
    <div class="mem-page-bg">
    <div class="container mem-body">
      <div class="bkp-layout">

        <div class="bkp-main">
          <div class="bkp-card-header">
            <div class="bkp-avatar">{{ bank.companyName.slice(0,2).toUpperCase() }}</div>
            <div>
              <div class="bkp-company-name">{{ bank.companyName || 'ბანკის დასახელება' }}</div>
              <div class="bkp-company-sub">{{ bank.contactFirst }} {{ bank.contactLast }} · {{ bank.position }}</div>
            </div>
            <span class="co-status-badge co-status-active" style="margin-left:auto">აქტიური</span>
          </div>

          <div class="bkp-section">
            <div class="mem-drawer-section-title">ინსტიტუტის ინფორმაცია</div>
            <div class="crm-form-grid">
              <div class="crm-field" style="grid-column:1/-1">
                <label>კომპანიის დასახელება</label>
                <input type="text" v-model="bank.companyName" placeholder="ბანკის / ინსტიტუტის სრული სახელი" />
              </div>
              <div class="crm-field">
                <label>საიდენტიფიკაციო კოდი</label>
                <input type="text" v-model="bank.idCode" placeholder="9-ნიშნა კოდი" />
              </div>
              <div class="crm-field">
                <label>ვებ-გვერდი</label>
                <input type="text" v-model="bank.website" placeholder="bank.ge" />
              </div>
            </div>
          </div>

          <div class="bkp-section">
            <div class="mem-drawer-section-title">საკონტაქტო პირი</div>
            <div class="crm-form-grid">
              <div class="crm-field">
                <label>სახელი</label>
                <input type="text" v-model="bank.contactFirst" placeholder="სახელი" />
              </div>
              <div class="crm-field">
                <label>გვარი</label>
                <input type="text" v-model="bank.contactLast" placeholder="გვარი" />
              </div>
              <div class="crm-field">
                <label>პოზიცია</label>
                <input type="text" v-model="bank.position" placeholder="მაგ. ფილიალის მენეჯერი" />
              </div>
              <div class="crm-field">
                <label>ტელეფონის ნომერი</label>
                <input type="text" v-model="bank.phone" placeholder="5XXXXXXXX" maxlength="9" @input="onPhoneInput" />
                <div v-if="phoneError" style="font-size:.75rem;color:#dc2626;margin-top:.25rem">{{ phoneError }}</div>
              </div>
              <div class="crm-field" style="grid-column:1/-1">
                <label>ელ. ფოსტა</label>
                <input type="email" v-model="bank.email" placeholder="name@bank.ge" />
              </div>
            </div>
          </div>

          <div v-if="bankError" class="cp-error-msg">{{ bankError }}</div>
          <div v-if="bankSaved" class="cp-success-banner">ცვლილებები წარმატებით შენახულია</div>

          <div class="bkp-footer">
            <button type="button" class="crm-btn-primary" @click="saveBank">ცვლილებების შენახვა</button>
          </div>
        </div>

        <div class="bkp-side">
          <div class="bkp-side-card">
            <div class="bkp-side-title">პროფილის შევსება</div>
            <div class="bkp-completeness-bar">
              <div class="bkp-completeness-fill" :style="{ width: bankCompleteness + '%' }"></div>
            </div>
            <div class="bkp-completeness-pct">{{ bankCompleteness }}%</div>
            <div class="bkp-completeness-note">{{ bankCompleteness === 100 ? 'პროფილი სრულად შევსებულია' : `${bankMissingFields} ველი დარჩენილია` }}</div>
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
            <a href="#crm/changepass" class="bkp-quick-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              პაროლის შეცვლა
            </a>
          </div>
        </div>

      </div>
    </div>
    </div>
  </InnerPageLayout>

  <!-- User (business) profile -->
  <InnerPageLayout v-else title="ჩემი ანგარიში" breadcrumb="ჩემი ანგარიში">
    <div class="container crm-account-body">

      <div class="cp-header-card">
        <div class="cp-avatar">{{ initials }}</div>
        <div class="cp-header-info">
          <h2>{{ auth.user?.name }}</h2>
          <span class="cp-role-badge">ბიზნეს მომხმარებელი</span>
        </div>
        <div class="cp-header-meta">
          <div class="cp-meta-item"><span>ელ. ფოსტა</span><strong>{{ auth.user?.email }}</strong></div>
        </div>
      </div>

      <div class="cp-main-grid">
        <div class="crm-form-block">
          <h3 class="crm-form-block-title">პროფილის ინფორმაცია</h3>
          <p class="crm-form-block-hint">ძირითადი მონაცემები სისტემიდან მოდის და რედაქტირებას არ ექვემდებარება.</p>
          <div class="cp-info-list">
            <div class="cp-info-row"><span class="cp-info-label">სახელი, გვარი</span><span class="cp-info-value">{{ auth.user?.name }}</span></div>
            <div class="cp-info-row"><span class="cp-info-label">ელ. ფოსტა</span><span class="cp-info-value">{{ auth.user?.email }}</span></div>
            <div class="cp-info-row"><span class="cp-info-label">როლი</span><span class="cp-info-value">ბიზნეს მომხმარებელი</span></div>
          </div>
        </div>

        <div class="crm-form-block">
          <h3 class="crm-form-block-title">საკონტაქტო პირი</h3>
          <p class="crm-form-block-hint">დაამატეთ ან განაახლეთ საკონტაქტო პირის ინფორმაცია.</p>
          <div v-if="contactSaved" class="cp-success-banner">ინფორმაცია წარმატებით შენახულია</div>
          <div v-if="contactError" class="cp-error-msg">{{ contactError }}</div>
          <div class="crm-form-grid" style="grid-template-columns: 1fr">
            <div class="crm-field">
              <label>სახელი, გვარი</label>
              <input type="text" v-model="contact.name" placeholder="სახელი, გვარი" />
            </div>
            <div class="crm-field">
              <label>ტელეფონის ნომერი</label>
              <div class="crm-input-prefix">
                <span>+995</span>
                <input type="tel" v-model="contact.phone" placeholder="5XXXXXXXX" />
              </div>
            </div>
            <div class="crm-field">
              <label>ვინაობა</label>
              <input type="text" v-model="contact.relationship" placeholder="მაგ. ხელმძღვანელი, ასისტენტი..." />
            </div>
          </div>
          <div class="crm-form-actions">
            <button type="button" class="crm-btn-primary" @click="saveContact">შენახვა</button>
          </div>
        </div>
      </div>

      <div class="crm-form-block">
        <h3 class="crm-form-block-title">პაროლის შეცვლა</h3>
        <div class="crm-form-grid">
          <div class="crm-field">
            <label>მიმდინარე პაროლი</label>
            <input type="password" v-model="passForm.current" placeholder="••••••••" />
          </div>
          <div></div>
          <div class="crm-field">
            <label>ახალი პაროლი</label>
            <input type="password" v-model="passForm.newPass" placeholder="მინ. 8 სიმბოლო" />
          </div>
          <div class="crm-field">
            <label>გაიმეორეთ ახალი პაროლი</label>
            <input type="password" v-model="passForm.confirm" placeholder="გაიმეორეთ პაროლი" />
          </div>
        </div>
        <div v-if="passError" class="cp-error-msg">{{ passError }}</div>
        <div v-if="passSaved" class="cp-success-banner">პაროლი წარმატებით შეიცვალა</div>
        <div class="crm-form-actions">
          <button type="button" class="crm-btn-primary" @click="savePassword">პაროლის შეცვლა</button>
        </div>
      </div>

    </div>
  </InnerPageLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import InnerPageLayout from '../website/shared/InnerPageLayout.vue'
import { useAuth } from '../../composables/useAuth'
import { profileApi } from '../../api/profile'

const { auth } = useAuth()

const role = computed(() => auth.user?.role ?? 'user')

const initials = computed(() => {
  const name = auth.user?.name ?? ''
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? parts[0].charAt(0) + parts[1].charAt(0)
    : name.slice(0, 2).toUpperCase()
})

// --- Shared: contact person ---
const contact = reactive({ name: '', phone: '', relationship: '' })
const contactSaved = ref(false)
const contactError = ref('')

const saveContact = async () => {
  contactError.value = ''
  try {
    await profileApi.updateContact({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
    })
    contactSaved.value = true
    setTimeout(() => { contactSaved.value = false }, 3000)
  } catch (err) {
    contactError.value = err.response?.data?.message || 'შეცდომა შენახვისას.'
  }
}

// --- Shared: password ---
const passForm = reactive({ current: '', newPass: '', confirm: '' })
const passError = ref('')
const passSaved = ref(false)

const savePassword = async () => {
  passError.value = ''
  if (!passForm.current || !passForm.newPass || !passForm.confirm) {
    passError.value = 'გთხოვთ შეავსოთ ყველა ველი.'
    return
  }
  if (passForm.newPass.length < 8) {
    passError.value = 'ახალი პაროლი მინიმუმ 8 სიმბოლოს უნდა შეიცავდეს.'
    return
  }
  if (passForm.newPass !== passForm.confirm) {
    passError.value = 'პაროლები არ ემთხვევა.'
    return
  }
  try {
    await profileApi.updatePassword({
      current_password: passForm.current,
      password: passForm.newPass,
      password_confirmation: passForm.confirm,
    })
    passSaved.value = true
    Object.assign(passForm, { current: '', newPass: '', confirm: '' })
    setTimeout(() => { passSaved.value = false }, 3000)
  } catch (err) {
    passError.value = err.response?.data?.message || 'შეცდომა პაროლის შეცვლისას.'
  }
}

// --- Bank specific ---
const bank = reactive({
  companyName:  '',
  idCode:       '',
  website:      '',
  contactFirst: '',
  contactLast:  '',
  position:     '',
  phone:        '',
  email:        auth.user?.email ?? '',
})

const bankSaved  = ref(false)
const bankError  = ref('')
const phoneError = ref('')

const onPhoneInput = () => {
  phoneError.value = bank.phone.length > 0 && bank.phone.length !== 9 ? 'ტელეფონი უნდა იყოს 9 ციფრი' : ''
}

const bankFields = ['companyName', 'contactFirst', 'contactLast', 'position', 'phone', 'email']
const bankCompleteness = computed(() => {
  const filled = bankFields.filter(k => bank[k] && bank[k].trim().length > 0).length
  return Math.round((filled / bankFields.length) * 100)
})
const bankMissingFields = computed(() =>
  bankFields.length - bankFields.filter(k => bank[k] && bank[k].trim().length > 0).length
)

const saveBank = async () => {
  bankError.value = ''
  if (!bank.companyName.trim()) { bankError.value = 'კომპანიის სახელი სავალდებულოა'; return }
  if (bank.phone && bank.phone.length !== 9) { bankError.value = 'ტელეფონი უნდა იყოს 9 ციფრი'; return }
  try {
    await profileApi.updateBank({
      company_name:  bank.companyName,
      id_code:       bank.idCode,
      website:       bank.website,
      contact_first: bank.contactFirst,
      contact_last:  bank.contactLast,
      position:      bank.position,
      phone:         bank.phone,
      email:         bank.email,
    })
    bankSaved.value = true
    setTimeout(() => { bankSaved.value = false }, 2500)
  } catch (err) {
    bankError.value = err.response?.data?.message || 'შეცდომა შენახვისას.'
  }
}

// --- Load profile on mount ---
onMounted(async () => {
  try {
    const { data } = await profileApi.get()
    const p = data.data

    contact.name         = p.contact_name ?? ''
    contact.phone        = p.contact_phone ?? ''
    contact.relationship = p.contact_relationship ?? ''

    if (role.value === 'bank') {
      bank.companyName  = p.company ?? ''
      bank.idCode       = p.personal_id ?? ''
      bank.website      = p.userinfo ?? ''
      bank.contactFirst = p.name ?? ''
      bank.contactLast  = p.surname ?? ''
      bank.position     = p.position ?? ''
      bank.phone        = p.phone_number ?? ''
      bank.email        = p.email ?? ''
    }
  } catch {
    // auth interceptor handles 401 automatically
  }
})
</script>
