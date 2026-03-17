<template>
  <InnerPageLayout title="პაროლის შეცვლა" breadcrumb="პაროლის შეცვლა">
    <div class="mem-page-bg">
    <div class="container mem-body">
      <div class="chp-wrap">
        <div class="chp-card">

          <div class="chp-header">
            <div class="chp-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div>
              <div class="chp-title">პაროლის შეცვლა</div>
              <div class="chp-subtitle">მინიმუმ 8 სიმბოლო · ციფრები · სპეციალური სიმბოლო</div>
            </div>
          </div>

          <div class="chp-body">
            <!-- Old password -->
            <div class="crm-field">
              <label>ძველი პაროლი</label>
              <div class="chp-input-wrap">
                <input :type="show.old?'text':'password'" v-model="oldPass" placeholder="••••••••" autocomplete="current-password" />
                <button type="button" class="chp-eye" @click="show.old=!show.old">
                  <svg v-if="!show.old" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
            </div>

            <!-- New password -->
            <div class="crm-field">
              <label>ახალი პაროლი</label>
              <div class="chp-input-wrap">
                <input :type="show.new?'text':'password'" v-model="newPass" placeholder="••••••••" autocomplete="new-password" @input="checkStrength" />
                <button type="button" class="chp-eye" @click="show.new=!show.new">
                  <svg v-if="!show.new" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
              <div v-if="newPass" class="chp-strength">
                <div class="chp-strength-bars">
                  <div v-for="i in 4" :key="i" class="chp-strength-seg" :class="{ active: strengthLevel >= i, [`str-${strengthLabel}`]: strengthLevel >= i }"></div>
                </div>
                <span class="chp-strength-label" :class="`str-${strengthLabel}`">{{ strengthText }}</span>
              </div>
              <div v-if="newPass && newPass.length < 8" class="chp-hint">მინიმუმ 8 სიმბოლო</div>
            </div>

            <!-- Confirm password -->
            <div class="crm-field">
              <label>გაიმეორეთ ახალი პაროლი</label>
              <div class="chp-input-wrap">
                <input :type="show.confirm?'text':'password'" v-model="confirmPass" placeholder="••••••••" autocomplete="new-password"
                  :class="{ 'chp-mismatch': confirmPass && confirmPass !== newPass }" />
                <button type="button" class="chp-eye" @click="show.confirm=!show.confirm">
                  <svg v-if="!show.confirm" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
              <div v-if="confirmPass && confirmPass !== newPass" class="chp-hint chp-hint-error">პაროლები არ ემთხვევა</div>
            </div>

            <div v-if="errorMsg" class="cp-error-msg">{{ errorMsg }}</div>
            <div v-if="saved" class="cp-success-banner">პაროლი წარმატებით შეიცვალა</div>

            <div class="chp-rules">
              <span :class="newPass.length>=8?'chp-rule-ok':'chp-rule-off'">✓ 8+ სიმბოლო</span>
              <span :class="hasNumber?'chp-rule-ok':'chp-rule-off'">✓ ციფრი</span>
              <span :class="hasSpecial?'chp-rule-ok':'chp-rule-off'">✓ სიმბოლო (!@#...)</span>
            </div>

            <button type="button" class="crm-btn-primary chp-submit-btn" @click="submit" :disabled="saved">
              პაროლის შეცვლა
            </button>
          </div>
        </div>

        <!-- Security info card -->
        <div class="chp-info-card">
          <div class="chp-info-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            უსაფრთხოების რჩევები
          </div>
          <ul class="chp-info-list">
            <li>ნუ გამოიყენებთ ადვილად გამოსაცნობ სიტყვებს</li>
            <li>ნუ გამოიყენებთ ერთსა და იმავე პაროლს სხვადასხვა საიტზე</li>
            <li>რეგულარულად ცვალეთ პაროლი (3-6 თვეში ერთხელ)</li>
            <li>ნუ გაუზიარებთ პაროლს სხვებს</li>
          </ul>
        </div>
      </div>
    </div>
    </div>
  </InnerPageLayout>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import InnerPageLayout from '../website/shared/InnerPageLayout.vue'

const oldPass     = ref('')
const newPass     = ref('')
const confirmPass = ref('')
const errorMsg    = ref('')
const saved       = ref(false)
const show = reactive({ old: false, new: false, confirm: false })

const hasNumber  = computed(() => /\d/.test(newPass.value))
const hasSpecial = computed(() => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPass.value))
const hasUpper   = computed(() => /[A-Z]/.test(newPass.value))

const strengthLevel = computed(() => {
  const p = newPass.value
  if (!p) return 0
  let s = 0
  if (p.length >= 8)  s++
  if (hasNumber.value) s++
  if (hasSpecial.value) s++
  if (hasUpper.value || p.length >= 12) s++
  return s
})

const strengthLabel = computed(() => {
  const l = strengthLevel.value
  if (l <= 1) return 'weak'
  if (l === 2) return 'fair'
  if (l === 3) return 'good'
  return 'strong'
})
const strengthText = computed(() => ({ weak:'სუსტი', fair:'საშუალო', good:'ძლიერი', strong:'ძალიან ძლიერი' })[strengthLabel.value])

const checkStrength = () => {}

const submit = () => {
  errorMsg.value = ''
  if (!oldPass.value)                        { errorMsg.value = 'ძველი პაროლი სავალდებულოა';     return }
  if (newPass.value.length < 8)              { errorMsg.value = 'ახალი პაროლი მინ. 8 სიმბოლოა'; return }
  if (newPass.value !== confirmPass.value)   { errorMsg.value = 'პაროლები არ ემთხვევა';           return }
  saved.value = true
  setTimeout(() => { oldPass.value=''; newPass.value=''; confirmPass.value=''; saved.value=false }, 2500)
}
</script>
