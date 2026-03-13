<template>
  <InnerPageLayout
    breadcrumb="ინფორმაციით უზრუნველყოფა"
    title="ინფორმაციით უზრუნველყოფა"
    description="ერთი სივრცე ბიზნესისთვის საჭირო ძირითადი ინფორმაციით: პროგრამები, მოთხოვნები, ვადები და საჭირო ნაბიჯები."
  >
    <section class="content-section">
      <div class="container">
        <div class="info-grid">
          <article v-for="card in infoCards" :key="card.title" class="info-panel">
            <small>{{ card.label }}</small>
            <h3>{{ card.title }}</h3>
            <p>{{ card.text }}</p>
          </article>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import InnerPageLayout from './shared/InnerPageLayout.vue'

const infoCards = [
  { label: 'პროგრამები', title: 'აქტიური შესაძლებლობების მოკლე აღწერები', text: 'რა პროგრამაა, ვისთვისაა, რა მოთხოვნები აქვს და სად იწყება განაცხადი.' },
  { label: 'ვადები', title: 'ბოლო თარიღები და ეტაპები', text: 'როდის არის განაცხადის მიღება, რა ეტაპებია შერჩევაში და რა დოკუმენტებია საჭირო.' },
  { label: 'გზამკვლევები', title: 'ნაბიჯ-ნაბიჯ ინსტრუქციები', text: 'ხშირი კითხვები, გამარტივებული ახსნა და სწრაფი ლინკები შესაბამის რესურსებზე.' },
]
</script>
