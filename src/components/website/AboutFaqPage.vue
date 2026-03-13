<template>
  <InnerPageLayout
    breadcrumb="ხშირად დასმული კითხვები"
    title="ხშირად დასმული კითხვები"
    description="FAQ გვერდი აგროვებს განმეორებად კითხვებს პროგრამებზე, განაცხადებზე და სერვისებზე."
  >
    <section class="content-section">
      <div class="container narrow-copy">
        <div class="faq-list">
          <article v-for="item in faqs" :key="item.question" class="faq-card faq-card-interactive">
            <button type="button" class="faq-toggle" @click="toggle(item.question)">
              <span>{{ item.question }}</span>
              <strong>{{ openQuestion === item.question ? '−' : '+' }}</strong>
            </button>
            <p v-if="openQuestion === item.question">{{ item.answer }}</p>
          </article>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import { ref } from 'vue'
import InnerPageLayout from './shared/InnerPageLayout.vue'

const faqs = [
  {
    question: 'როგორ ვიპოვო ჩემთვის შესაბამისი პროგრამა?',
    answer: 'პროგრამები უნდა გაიფილტროს თემის, სააგენტოს, რეგიონის და ბიზნესის ეტაპის მიხედვით.',
  },
  {
    question: 'საჭიროა თუ არა რეგისტრაცია კონსულტაციის მისაღებად?',
    answer: 'ზოგ სერვისს მხოლოდ ინფორმაციის ნახვა სჭირდება, ხოლო ზოგს განაცხადის ან რეგისტრაციის დაწყება.',
  },
  {
    question: 'სად ჩანს ღონისძიებებზე რეგისტრაციის გზა?',
    answer: 'ღონისძიების დეტალურ გვერდზე უნდა იყოს მკაფიო CTA და საჭირო წინაპირობების მოკლე ჩამონათვალი.',
  },
]

const openQuestion = ref(faqs[0].question)

const toggle = (question) => {
  openQuestion.value = openQuestion.value === question ? '' : question
}
</script>
