<template>
  <teleport to="body">
    <div v-if="modelValue" class="auth-modal-root" @click.self="closeModal">
      <div class="auth-modal-backdrop" />

      <div class="auth-modal-card" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <button type="button" class="auth-modal-close" aria-label="დახურვა" @click="closeModal">
          x
        </button>

        <div class="auth-modal-shell">
          <aside class="auth-modal-aside">
            <span class="eyebrow">GrowthHub Access</span>
            <h2 id="auth-modal-title">პირადი სივრცე და რეგისტრაცია ერთიან modal flow-ში</h2>
            <p>
              Laravel-ის ძველი CRM login/register გვერდების სტრუქტურა აქ გადმოტანილია უფრო კომპაქტურ, თანამედროვე
              და ერთი-click გამოცდილებაში.
            </p>

            <div class="auth-modal-points">
              <div class="contact-point">ავტორიზაცია პირადი სივრცისთვის</div>
              <div class="contact-point">რეგისტრაცია ინდივიდისთვის ან კომპანიისთვის</div>
              <div class="contact-point">პაროლის აღდგენა და პირობების ნახვა</div>
            </div>
          </aside>

          <section class="auth-modal-main">
            <div class="auth-tabs">
              <button
                type="button"
                class="auth-tab"
                :class="{ active: activeTab === 'login' }"
                @click="activeTab = 'login'; loginView = 'login'"
              >
                ავტორიზაცია
              </button>
              <button
                type="button"
                class="auth-tab"
                :class="{ active: activeTab === 'register' }"
                @click="activeTab = 'register'"
              >
                რეგისტრაცია
              </button>
            </div>

            <form v-if="activeTab === 'login' && loginView === 'login'" class="auth-form" @submit.prevent="submitLogin">
              <div class="section-title-inline compact">
                <span class="eyebrow">Login</span>
                <h2>პირად სივრცეში შესვლა</h2>
              </div>

              <div class="auth-field">
                <label for="auth-email">ელ. ფოსტა ან ს/კ</label>
                <input id="auth-email" v-model="loginForm.email" type="text" placeholder="ელ. ფოსტა ან ს/კ" />
              </div>

              <div class="auth-field">
                <label for="auth-password">პაროლი</label>
                <input id="auth-password" v-model="loginForm.password" type="password" placeholder="პაროლი" />
              </div>

              <div class="auth-actions-row">
                <button type="submit" class="submit-btn-premium">შესვლა</button>
                <button type="button" class="auth-text-link" @click="activeTab = 'register'">
                  ანგარიშის შექმნა
                </button>
              </div>

              <button type="button" class="auth-text-link subtle" @click="loginView = 'recovery'">პაროლის აღდგენა</button>
            </form>

            <form v-else-if="activeTab === 'login' && loginView === 'recovery'" class="auth-form" @submit.prevent="submitRecovery">
              <div class="section-title-inline compact">
                <span class="eyebrow">Recovery</span>
                <h2>დაგავიწყდა პაროლი?</h2>
              </div>

              <div class="auth-field">
                <label for="recovery-id">საიდენტიფიკაციო კოდი</label>
                <input id="recovery-id" v-model="recoveryForm.companyId" type="text" inputmode="numeric" placeholder="საიდენტიფიკაციო კოდი" />
              </div>

              <div class="auth-field">
                <label for="recovery-phone">ტელეფონის ნომერი</label>
                <input id="recovery-phone" v-model="recoveryForm.phoneNumber" type="text" inputmode="numeric" placeholder="577XXXXXX" />
              </div>

              <div class="auth-actions-row">
                <button type="submit" class="submit-btn-premium">დროებითი პაროლის მიღება</button>
                <button type="button" class="auth-text-link" @click="loginView = 'login'">ავტორიზაციაზე დაბრუნება</button>
              </div>
            </form>

            <div v-else>
              <div v-if="registrationSuccess" class="auth-success-card">
                <span class="eyebrow">Success</span>
                <h2>რეგისტრაციის flow მომზადებულია</h2>
                <p>
                  ეს არის front-end migration ვერსია. ფორმა ამ ეტაპზე ინახავს მხოლოდ UI flow-ს და შემდეგ backend
                  contract-ზე მიებმება.
                </p>
                <button type="button" class="submit-btn-premium" @click="resetRegistration">
                  ახალი რეგისტრაცია
                </button>
              </div>

              <form v-else class="auth-form auth-form-register" @submit.prevent="submitRegister">
                <div class="section-title-inline compact">
                  <span class="eyebrow">Register</span>
                  <h2>ახალი ანგარიშის შექმნა</h2>
                </div>

                <div class="auth-type-switch">
                  <button
                    type="button"
                    class="auth-type-chip"
                    :class="{ active: registerForm.userType === 'individual' }"
                    @click="registerForm.userType = 'individual'"
                  >
                    ინდივიდუალური მეწარმე
                  </button>
                  <button
                    type="button"
                    class="auth-type-chip"
                    :class="{ active: registerForm.userType === 'company' }"
                    @click="registerForm.userType = 'company'"
                  >
                    იურიდიული პირი
                  </button>
                </div>

                <div class="auth-grid two-up">
                  <div v-if="registerForm.userType === 'individual'" class="auth-field">
                    <label for="personal-id">პირადი ნომერი</label>
                    <input id="personal-id" v-model="registerForm.personalId" type="text" inputmode="numeric" maxlength="11" placeholder="11 ციფრი" />
                  </div>

                  <div v-if="registerForm.userType === 'individual'" class="auth-field">
                    <label for="birth-year">დაბადების წელი</label>
                    <input id="birth-year" v-model="registerForm.birthYear" type="text" inputmode="numeric" maxlength="4" placeholder="მაგ. 1992" />
                  </div>

                  <div v-if="registerForm.userType === 'company'" class="auth-field">
                    <label for="company-id">კომპანიის ს/კ</label>
                    <input id="company-id" v-model="registerForm.companyId" type="text" inputmode="numeric" maxlength="9" placeholder="9 ციფრი" />
                  </div>

                  <div class="auth-field">
                    <label :for="registerForm.userType === 'company' ? 'company-phone' : 'phone-number'">ტელეფონის ნომერი</label>
                    <div class="auth-input-prefix">
                      <span>+995</span>
                      <input :id="registerForm.userType === 'company' ? 'company-phone' : 'phone-number'" v-model="registerForm.phone" type="text" inputmode="numeric" maxlength="9" placeholder="5XXXXXXXX" />
                    </div>
                  </div>

                  <div class="auth-field">
                    <label for="auth-region">რეგიონი</label>
                    <select id="auth-region" v-model="registerForm.region">
                      <option value="">აირჩიე რეგიონი</option>
                      <option v-for="region in regions" :key="region" :value="region">{{ region }}</option>
                    </select>
                  </div>

                  <div class="auth-field">
                    <label for="register-email">ელ. ფოსტა</label>
                    <input id="register-email" v-model="registerForm.email" type="email" placeholder="ელ. ფოსტა" />
                  </div>

                  <div class="auth-field">
                    <label for="register-password">პაროლი</label>
                    <input id="register-password" v-model="registerForm.password" type="password" placeholder="მინ. 8 სიმბოლო" />
                  </div>

                  <div class="auth-field">
                    <label for="register-password-confirm">გაიმეორე პაროლი</label>
                    <input id="register-password-confirm" v-model="registerForm.passwordConfirmation" type="password" placeholder="გაიმეორე პაროლი" />
                  </div>
                </div>

                <label class="auth-checkbox">
                  <input v-model="registerForm.accepted" type="checkbox" />
                  <span>
                    ვეთანხმები
                    <button type="button" class="auth-inline-link" @click="isTermsOpen = true">პირობებს</button>
                  </span>
                </label>

                <button type="submit" class="submit-btn-premium">რეგისტრაცია</button>
              </form>
            </div>
          </section>
        </div>
      </div>

      <div v-if="isTermsOpen" class="auth-terms-layer" @click.self="isTermsOpen = false">
        <div class="auth-terms-card">
          <div class="auth-terms-head">
            <h3>რეგისტრაციის პირობები</h3>
            <button type="button" class="auth-modal-close compact" @click="isTermsOpen = false">x</button>
          </div>
          <div class="auth-terms-copy">
            <p>მითითებული ინფორმაცია უნდა იყოს სწორი და აქტუალური.</p>
            <p>რეგისტრირებული მომხმარებელი იყენებს პირად სივრცეს ინფორმაციის, სერვისებისა და აქტივობების მისაღებად.</p>
            <p>Vue migration ეტაპზე ეს modal ინახავს UI ლოგიკას და შემდეგ backend validation-ზე მიებმება.</p>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const activeTab = ref('login')
const loginView = ref('login')
const isTermsOpen = ref(false)
const registrationSuccess = ref(false)

const loginForm = reactive({
  email: '',
  password: '',
})

const recoveryForm = reactive({
  companyId: '',
  phoneNumber: '',
})

const registerForm = reactive({
  userType: 'individual',
  personalId: '',
  birthYear: '',
  companyId: '',
  phone: '',
  region: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  accepted: false,
})

const regions = [
  'თბილისი',
  'აჭარა',
  'გურია',
  'იმერეთი',
  'კახეთი',
  'მცხეთა-მთიანეთი',
  'რაჭა-ლეჩხუმი',
  'სამეგრელო',
  'სამცხე-ჯავახეთი',
  'ქვემო ქართლი',
  'შიდა ქართლი',
]

const closeModal = () => {
  emit('update:modelValue', false)
  isTermsOpen.value = false
}

const submitLogin = () => {
  closeModal()
}

const submitRecovery = () => {
  loginView.value = 'login'
}

const submitRegister = () => {
  registrationSuccess.value = true
}

const resetRegistration = () => {
  registrationSuccess.value = false
  activeTab.value = 'register'
}

const onKeydown = (event) => {
  if (event.key === 'Escape') {
    if (isTermsOpen.value) {
      isTermsOpen.value = false
      return
    }

    closeModal()
  }
}

watch(
  () => props.modelValue,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    if (!isOpen) {
      isTermsOpen.value = false
      loginView.value = 'login'
    }
  }
)

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>
