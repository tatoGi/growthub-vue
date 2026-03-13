<template>
  <InnerPageLayout
    breadcrumb="ბიზნეს-უნარების გაუმჯობესება"
    title="ბიზნეს-უნარების გაუმჯობესება"
    description="სასწავლო ფორმატები იმ თემებზე, რომლებიც ყველაზე ხშირად სჭირდება ზრდის ეტაპზე მყოფ ბიზნესს."
  >
    <section class="content-section">
      <div class="container">
        <div class="pill-list">
          <span v-for="topic in topics" :key="topic" class="pill-item">{{ topic }}</span>
        </div>

        <div class="timeline-list">
          <article v-for="module in modules" :key="module.title" class="timeline-card">
            <span class="timeline-step">{{ module.step }}</span>
            <div>
              <h3>{{ module.title }}</h3>
              <p>{{ module.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import InnerPageLayout from './shared/InnerPageLayout.vue'

const topics = ['ფინანსური დაგეგმვა', 'გაყიდვები', 'ციფრული კომუნიკაცია', 'ოპერაციები', 'ბრენდინგი', 'B2B ზრდა']

const modules = [
  { step: '01', title: 'საჭიროების შეფასება', text: 'ბიზნესის ეტაპისა და გუნდის გამოცდილების მიხედვით სწავლების თემების შერჩევა.' },
  { step: '02', title: 'ტრენინგ ციკლი', text: 'მოკლე ინტენსიური მოდულები რეალური ქეისებით, შაბლონებით და სამუშაო დავალებებით.' },
  { step: '03', title: 'შემდგომი მხარდაჭერა', text: 'ტრენინგის შემდეგ დამატებითი რესურსები და რეკომენდებული შემდეგი ნაბიჯები.' },
]
</script>
