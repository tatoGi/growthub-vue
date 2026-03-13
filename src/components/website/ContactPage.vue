<template>
  <InnerPageLayout
    breadcrumb="კონტაქტი"
    title="კონტაქტი"
    description="Laravel public contact view-ის მიხედვით: ცენტრების სია, საკონტაქტო ინფორმაცია და message form."
  >
    <section class="contact-map-showcase">
      <div class="container">
        <div class="contact-hero-band">
          <div class="contact-hero-stat">
            <strong>6</strong>
            <span>რეგიონული ცენტრი</span>
          </div>
          <div class="contact-hero-stat">
            <strong>15 25</strong>
            <span>ცხელი ხაზი</span>
          </div>
          <div class="contact-hero-stat">
            <strong>1 სივრცე</strong>
            <span>ინფორმაცია და კავშირი</span>
          </div>
        </div>

        <div class="contact-map-card contact-map-card-elevated">
          <div class="contact-map-copy">
            <span class="eyebrow">იპოვე შენი ცენტრი</span>
            <h2>რეგიონული საკონსულტაციო ცენტრები ერთ სივრცეში</h2>
            <p>
              საჯარო contact გვერდი აერთიანებს რეგიონულ ცენტრებს, მათ მისამართებს და ძირითად საკომუნიკაციო არხებს.
            </p>
            <div class="contact-map-actions">
              <a href="#contact-form" class="primary-action-link">მოგვწერე</a>
              <a href="#contact-centers" class="contact-secondary-link">ცენტრების ნახვა</a>
            </div>
          </div>

          <div class="contact-map-visual">
            <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200" alt="Georgia map" />
            <div class="contact-map-floating-card">
              <span class="floating-label">Coverage</span>
              <strong>თბილისი, ბათუმი, ქუთაისი, თელავი</strong>
              <p>სწრაფი წვდომა რეგიონულ მხარდაჭერაზე და საკონსულტაციო არხებზე.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="contact-centers-section" id="contact-centers">
      <div class="container">
        <div class="section-title-inline contact-section-title">
          <span class="eyebrow">ცენტრები</span>
          <h2>აირჩიე შენთან ყველაზე ახლო საკონსულტაციო ცენტრი</h2>
        </div>

        <div class="contact-centers-list contact-centers-grid">
          <article v-for="center in contactCenters" :key="center.id" class="center-card">
            <div class="center-card-top">
              <div class="center-logo">GH</div>
              <div class="center-socials">
                <span v-for="item in center.social" :key="item">{{ item }}</span>
              </div>
            </div>

            <h3>{{ center.name }}</h3>

            <div class="center-meta">
              <div class="center-meta-row">
                <strong>მისამართი</strong>
                <span>{{ center.address }}</span>
              </div>
              <div class="center-meta-row">
                <strong>ტელეფონი</strong>
                <a :href="`tel:${center.phone}`">{{ center.phone }}</a>
              </div>
              <div class="center-meta-row">
                <strong>ელ. ფოსტა</strong>
                <span>{{ center.email }}</span>
              </div>
              <div class="center-meta-row">
                <strong>ვებსაიტი</strong>
                <span>{{ center.website }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="contact-form-section" id="contact-form">
      <div class="container">
        <div class="contact-form-layout">
          <div class="contact-form-intro">
            <span class="eyebrow">მოგვწერე</span>
            <h2>თუ არ იცი რომელ პროგრამაზე ან ცენტრზე გადახვიდე, დაიწყე აქედან</h2>
            <p>
              ფორმა განკუთვნილია საწყისი კავშირის დასაწყებად. მოგვწერე მოკლედ რა გჭირდება და შესაბამისი მიმართულებით გადასვლას გაგიმარტივებთ.
            </p>

            <div class="contact-intro-points">
              <div class="contact-point">პროგრამებზე ორიენტირება</div>
              <div class="contact-point">რეგიონული ცენტრის მოძებნა</div>
              <div class="contact-point">საკონსულტაციო კითხვები</div>
            </div>
          </div>

          <div class="contact-form-block">
            <div v-if="isSubmitted" class="auth-success-card contact-success-card">
              <span class="eyebrow">Sent</span>
              <h2>შეტყობინება გაგზავნისთვის მზადაა</h2>
              <p>
                ეს ეტაპი front-end ვიზუალური flow-ია. რეალური Laravel/contact submit მიბმა შემდეგ ინტეგრაციის ეტაპზე გაკეთდება.
              </p>
              <button type="button" class="submit-btn-premium" @click="resetForm">ახალი შეტყობინება</button>
            </div>

            <form v-else class="contact-page-form" @submit.prevent="submitForm">
              <div class="form-group">
                <label>სახელი და გვარი</label>
                <input v-model="form.fullName" type="text" placeholder="შეიყვანე სახელი და გვარი" />
              </div>

              <div class="form-group">
                <label>ელ. ფოსტა</label>
                <input v-model="form.email" type="email" placeholder="example@mail.com" />
              </div>

              <div class="form-group">
                <label>შეტყობინება</label>
                <textarea v-model="form.message" rows="7" placeholder="დაწერე ტექსტი..."></textarea>
              </div>

              <button type="submit" class="submit-btn-premium">გაგზავნა</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import InnerPageLayout from './shared/InnerPageLayout.vue'
import { contactCenters } from '../../data/contactCenters'

const isSubmitted = ref(false)

const form = reactive({
  fullName: '',
  email: '',
  message: '',
})

const submitForm = () => {
  isSubmitted.value = true
}

const resetForm = () => {
  isSubmitted.value = false
  form.fullName = ''
  form.email = ''
  form.message = ''
}
</script>
