<template>
  <InnerPageLayout title="ჩემი ანგარიში" breadcrumb="ჩემი ანგარიში">
    <div class="container crm-account-body">

      <!-- Profile header card -->
      <div class="cp-header-card">
        <div class="cp-avatar">{{ profile.firstName.charAt(0) }}{{ profile.lastName.charAt(0) }}</div>
        <div class="cp-header-info">
          <h2>{{ profile.firstName }} {{ profile.lastName }}</h2>
          <span class="cp-role-badge">{{ profile.roleLabel }}</span>
        </div>
        <div class="cp-header-meta">
          <div v-for="m in headerMeta" :key="m.label" class="cp-meta-item">
            <span>{{ m.label }}</span>
            <strong>{{ m.value }}</strong>
          </div>
        </div>
      </div>

      <!-- Main grid -->
      <div class="cp-main-grid">

        <!-- Left: Profile info (readonly) -->
        <div class="crm-form-block">
          <h3 class="crm-form-block-title">პროფილის ინფორმაცია</h3>
          <p class="crm-form-block-hint">ძირითადი მონაცემები სისტემიდან მოდის და რედაქტირებას არ ექვემდებარება.</p>
          <div class="cp-info-list">
            <div v-for="field in profileFields" :key="field.label" class="cp-info-row">
              <span class="cp-info-label">{{ field.label }}</span>
              <span class="cp-info-value">{{ field.value }}</span>
            </div>
          </div>
        </div>

        <!-- Right: Contact person (editable) -->
        <div class="crm-form-block">
          <h3 class="crm-form-block-title">საკონტაქტო პირი</h3>
          <p class="crm-form-block-hint">დაამატეთ ან განაახლეთ საკონტაქტო პირის ინფორმაცია.</p>

          <div v-if="contactSaved" class="cp-success-banner">
            ინფორმაცია წარმატებით შენახულია
          </div>

          <div class="crm-form-grid" style="grid-template-columns: 1fr">
            <div class="crm-field">
              <label for="cp-contact-name">სახელი, გვარი</label>
              <input id="cp-contact-name" type="text" v-model="contact.name" placeholder="სახელი, გვარი" />
            </div>
            <div class="crm-field">
              <label for="cp-contact-phone">ტელეფონის ნომერი</label>
              <div class="crm-input-prefix">
                <span>+995</span>
                <input id="cp-contact-phone" type="tel" v-model="contact.phone" placeholder="5XXXXXXXX" />
              </div>
            </div>
            <div class="crm-field">
              <label for="cp-contact-rel">ვინაობა</label>
              <input id="cp-contact-rel" type="text" v-model="contact.relationship" placeholder="მაგ. ხელმძღვანელი, ასისტენტი..." />
            </div>
          </div>

          <div class="crm-form-actions">
            <button type="button" class="crm-btn-primary" @click="saveContact">შენახვა</button>
          </div>
        </div>

      </div>

      <!-- Password change -->
      <div class="crm-form-block">
        <h3 class="crm-form-block-title">პაროლის შეცვლა</h3>
        <div class="crm-form-grid">
          <div class="crm-field">
            <label for="cp-old-pass">მიმდინარე პაროლი</label>
            <input id="cp-old-pass" type="password" v-model="passForm.current" placeholder="••••••••" />
          </div>
          <div></div>
          <div class="crm-field">
            <label for="cp-new-pass">ახალი პაროლი</label>
            <input id="cp-new-pass" type="password" v-model="passForm.newPass" placeholder="მინ. 8 სიმბოლო" />
          </div>
          <div class="crm-field">
            <label for="cp-confirm-pass">გაიმეორეთ ახალი პაროლი</label>
            <input id="cp-confirm-pass" type="password" v-model="passForm.confirm" placeholder="გაიმეორეთ პაროლი" />
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
import { ref, reactive, computed } from 'vue'
import InnerPageLayout from '../website/shared/InnerPageLayout.vue'

const profile = reactive({
  firstName: 'მარინე',
  lastName: 'გელაშვილი',
  email: 'marine.gelashvili@growthhub.ge',
  region: 'იმერეთი',
  phone: '555 12 34 56',
  roleLabel: 'ცენტრალური',
})

const headerMeta = computed(() => [
  { label: 'რეგიონი', value: profile.region },
  { label: 'ელ. ფოსტა', value: profile.email },
  { label: 'ტელეფონი', value: `+995 ${profile.phone}` },
])

const profileFields = computed(() => [
  { label: 'სახელი',   value: profile.firstName },
  { label: 'გვარი',    value: profile.lastName },
  { label: 'ელ. ფოსტა', value: profile.email },
  { label: 'რეგიონი',  value: profile.region },
  { label: 'ტელეფონი', value: `+995 ${profile.phone}` },
  { label: 'პოზიცია',  value: profile.roleLabel },
])

const contact = reactive({ name: '', phone: '', relationship: '' })
const contactSaved = ref(false)
const saveContact = () => {
  contactSaved.value = true
  setTimeout(() => { contactSaved.value = false }, 3000)
}

const passForm = reactive({ current: '', newPass: '', confirm: '' })
const passError = ref('')
const passSaved = ref(false)
const savePassword = () => {
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
  passSaved.value = true
  Object.assign(passForm, { current: '', newPass: '', confirm: '' })
  setTimeout(() => { passSaved.value = false }, 3000)
}
</script>
