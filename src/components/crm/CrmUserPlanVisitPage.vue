<template>
  <InnerPageLayout title="ვიზიტის დაგეგმვა" breadcrumb="ვიზიტის დაგეგმვა">
    <div class="mem-page-bg">
    <div class="container mem-body">

      <div class="pv-layout">

        <!-- Form -->
        <div class="pv-form-card">
          <div class="pv-form-header">
            <div class="pv-form-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div>
              <div class="pv-form-title">ახალი ვიზიტის მოთხოვნა</div>
              <div class="pv-form-subtitle">აირჩიეთ რეგიონი, სასურველი თარიღი და დრო</div>
            </div>
          </div>

          <!-- Step 1: Region + Date -->
          <div class="pv-step">
            <div class="pv-step-num">1</div>
            <div class="pv-step-body">
              <div class="pv-step-title">რეგიონი და თარიღი</div>
              <div class="crm-form-grid">
                <div class="crm-field">
                  <label>აირჩიეთ რეგიონი</label>
                  <select v-model="form.region" @change="onRegionChange">
                    <option value="">— რეგიონი —</option>
                    <option v-for="r in availableRegions" :key="r" :value="r">{{ r }}</option>
                  </select>
                </div>
                <div class="crm-field">
                  <label>სასურველი თარიღი</label>
                  <input type="date" v-model="form.date" :min="minDate" @change="onDateChange" :disabled="!form.region" />
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Time slots -->
          <div class="pv-step" :class="{disabled: !form.region || !form.date}">
            <div class="pv-step-num">2</div>
            <div class="pv-step-body">
              <div class="pv-step-title">ხელმისაწვდომი სლოტები</div>
              <div v-if="!form.region || !form.date" class="pv-step-hint">პირველ ნაბიჯში შეავსეთ რეგიონი და თარიღი</div>
              <div v-else-if="slots.length === 0" class="pv-step-hint pv-hint-warn">ამ დღეს ხელმისაწვდომი სლოტი არ არის. სხვა თარიღი სცადეთ.</div>
              <div v-else class="pv-slots">
                <button v-for="s in slots" :key="s" type="button"
                  class="pv-slot" :class="{selected: form.slot===s, taken: takenSlots.includes(s)}"
                  :disabled="takenSlots.includes(s)"
                  @click="form.slot=s">
                  <span>{{ s }}</span>
                  <span v-if="takenSlots.includes(s)" class="pv-slot-taken-label">დაკავ.</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Step 3: Visit details -->
          <div class="pv-step" :class="{disabled: !form.slot}">
            <div class="pv-step-num">3</div>
            <div class="pv-step-body">
              <div class="pv-step-title">ვიზიტის მიზანი</div>
              <div class="crm-form-grid">
                <div class="crm-field">
                  <label>ვიზიტის ტიპი</label>
                  <select v-model="form.visitType" :disabled="!form.slot">
                    <option value="">— ტიპი —</option>
                    <option value="consulting">კონსულტაცია</option>
                    <option value="diagnostic">დიაგნოსტიკა</option>
                    <option value="finance">ფინანსებზე წვდომა</option>
                    <option value="export">ექსპორტი</option>
                    <option value="other">სხვა</option>
                  </select>
                </div>
                <div class="crm-field">
                  <label>მონაწილეთა რაოდ.</label>
                  <input type="number" v-model.number="form.participants" min="1" max="10" :disabled="!form.slot" />
                </div>
                <div class="crm-field" style="grid-column:1/-1">
                  <label>შეხვედრის მიზანი და შენიშვნები</label>
                  <textarea v-model="form.note" rows="3" placeholder="მოკლედ აღწერეთ შეხვედრის მიზანი..." :disabled="!form.slot"
                    style="width:100%;resize:vertical;padding:.6rem .75rem;border:1.5px solid var(--border);border-radius:10px;font-family:inherit;font-size:.875rem;outline:none;transition:border-color .15s"
                    @focus="e=>e.target.style.borderColor='var(--accent)'" @blur="e=>e.target.style.borderColor='var(--border)'"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div v-if="errorMsg" class="cp-error-msg">{{ errorMsg }}</div>
          <div v-if="submitted" class="cp-success-banner">
            მოთხოვნა გაგზავნილია! გადაამოწმეთ კალენდარი დასტურის სანახავად.
          </div>

          <div class="pv-form-footer">
            <button type="button" class="crm-btn-secondary" @click="reset">გასუფთავება</button>
            <button type="button" class="crm-btn-primary" @click="submit" :disabled="!form.slot || submitted">
              მოთხოვნის გაგზავნა
            </button>
          </div>
        </div>

        <!-- History + info -->
        <div class="pv-side">
          <div class="pv-side-card">
            <div class="bkp-side-title">ვიზიტის ისტორია</div>
            <div class="pv-history">
              <div v-for="h in history" :key="h.id" class="pv-history-row">
                <div class="pv-hist-dot" :class="`pv-dot-${h.status}`"></div>
                <div style="flex:1">
                  <div class="pv-hist-title">{{ h.region }} · {{ h.type }}</div>
                  <div class="pv-hist-date">{{ h.date }} · {{ h.time }}</div>
                </div>
                <span class="pv-hist-badge" :class="`pv-hist-${h.status}`">{{ histLabel(h.status) }}</span>
              </div>
            </div>
          </div>

          <div class="pv-side-card">
            <div class="bkp-side-title">სამუშაო საათები</div>
            <div class="co-info-list">
              <div class="co-info-row"><span>ორშ–პარ</span><strong>09:00–18:00</strong></div>
              <div class="co-info-row"><span>შაბათი</span><strong>10:00–14:00</strong></div>
              <div class="co-info-row"><span>კვირა</span><strong>დასვენება</strong></div>
            </div>
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

const availableRegions = ['თბილისი','ქუთაისი','ბათუმი','რუსთავი','გორი','ზუგდიდი','ახალციხე','თელავი']

const allSlots    = ['09:00–10:00','10:00–11:00','11:00–12:00','14:00–15:00','15:00–16:00','16:00–17:00']
const takenSlots  = ['10:00–11:00','15:00–16:00']

const form = reactive({ region:'', date:'', slot:'', visitType:'', participants:1, note:'' })
const errorMsg  = ref('')
const submitted = ref(false)

const minDate = computed(() => {
  const d = new Date(); d.setDate(d.getDate()+1)
  return d.toISOString().split('T')[0]
})

const slots = computed(() => {
  if (!form.region || !form.date) return []
  const day = new Date(form.date).getDay()
  if (day === 0) return []
  if (day === 6) return allSlots.slice(0,3)
  return allSlots
})

const onRegionChange = () => { form.slot=''; form.date='' }
const onDateChange   = () => { form.slot='' }

const reset = () => {
  Object.assign(form, { region:'', date:'', slot:'', visitType:'', participants:1, note:'' })
  errorMsg.value=''; submitted.value=false
}

const submit = () => {
  errorMsg.value=''
  if (!form.region)    { errorMsg.value='რეგიონი სავალდებულოა';  return }
  if (!form.date)      { errorMsg.value='თარიღი სავალდებულოა';   return }
  if (!form.slot)      { errorMsg.value='სლოტი სავალდებულოა';    return }
  if (!form.visitType) { errorMsg.value='ვიზიტის ტიპი სავალდებ.'; return }
  submitted.value=true
  setTimeout(() => reset(), 3000)
}

const history = ref([
  { id:1, region:'თბილისი', type:'კონსულტაცია',    date:'5 მარ 2025',  time:'10:00', status:'done' },
  { id:2, region:'ქუთაისი', type:'დიაგნოსტიკა',    date:'18 თებ 2025', time:'14:00', status:'done' },
  { id:3, region:'თბილისი', type:'ფინანსებზე წვდ.', date:'25 მარ 2025', time:'11:00', status:'upcoming' },
])
const histLabel = (s) => ({ done:'ჩატარდა', upcoming:'დაგეგმილი', cancelled:'გაუქმდა' })[s] || s
</script>
