<template>
  <InnerPageLayout
    breadcrumb="ბიზნესის მხარდაჭერა"
    title="ბიზნესის მხარდაჭერა"
    description="სერვისები, ცოდნა და პრაქტიკული მხარდაჭერა ერთი სტრუქტურიდან, რომ ბიზნესმა სწრაფად იპოვოს მისთვის სწორი გზა."
  >
    <section class="content-section surface-section">
      <div class="container">
        <div class="feature-grid three-up">
          <article v-for="item in supportAreas" :key="item.title" class="feature-card">
            <div class="feature-icon">{{ item.icon }}</div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
            <a :href="item.link" class="feature-link">გახსნა</a>
          </article>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import InnerPageLayout from './shared/InnerPageLayout.vue'

const supportAreas = [
  {
    title: 'ბიზნეს-უნარების გაუმჯობესება',
    text: 'ტრენინგები, პრაქტიკული სახელმძღვანელოები და სამუშაო სესიები გუნდისა და დამფუძნებლებისთვის.',
    link: '#support/skills',
    icon: '01',
  },
  {
    title: 'საკონსულტაციო მომსახურება',
    text: 'ინდივიდუალური მხარდაჭერა ბიზნეს-მოდელის, ფინანსური დაგეგმვისა და ზრდის სტრატეგიისთვის.',
    link: '#support/consulting',
    icon: '02',
  },
  {
    title: 'ინფორმაციით უზრუნველყოფა',
    text: 'კონცენტრირებული ინფორმაცია პროგრამებზე, ვადებზე, კრიტერიუმებზე და რეგისტრაციის ნაბიჯებზე.',
    link: '#support/info',
    icon: '03',
  },
]
</script>
