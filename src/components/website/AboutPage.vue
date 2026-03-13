<template>
  <InnerPageLayout
    breadcrumb="ჩვენ შესახებ"
    title="ჩვენ შესახებ"
    description="GrowthHub-ის საჯარო ნაწილი აერთიანებს პროგრამებს, ინფორმაციას და მხარდაჭერის სერვისებს ერთ სტრუქტურაში."
  >
    <section class="content-section surface-section">
      <div class="container">
        <div class="split-panel">
          <div class="panel-copy">
            <span class="eyebrow">მისია</span>
            <h3>ვქმნით მარტივ გზას მხარდაჭერასა და შესაძლებლობებს შორის</h3>
            <p>
              მიზანია, მეწარმემ ერთ სივრცეში მიიღოს პროგრამების ნახვა, საჭირო ინფორმაციის გაფილტვრა და
              შესაბამის მხარდაჭერაზე სწრაფი გადასვლა.
            </p>
          </div>

          <div class="stats-board">
            <div v-for="stat in stats" :key="stat.label" class="stat-box">
              <strong>{{ stat.value }}</strong>
              <span>{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import InnerPageLayout from './shared/InnerPageLayout.vue'

const stats = [
  { value: '3', label: 'ძირითადი მხარდაჭერის მიმართულება' },
  { value: '9+', label: 'საჯარო ვიზუალი გადასატანი' },
  { value: '1', label: 'ერთიანი public front მიზანში' },
]
</script>
