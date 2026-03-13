<template>
  <InnerPageLayout
    breadcrumb="საკონსულტაციო მომსახურება"
    title="საკონსულტაციო მომსახურება"
    description="სიღრმისეული კონსულტაცია კონკრეტული პრობლემისთვის და არა მხოლოდ ზოგადი ინფორმაციისთვის."
  >
    <section class="content-section surface-section">
      <div class="container">
        <div class="split-panel">
          <div class="panel-copy">
            <h3>როდის არის ეს გვერდი სასარგებლო</h3>
            <p>
              როცა ბიზნესს უკვე აქვს კონკრეტული ამოცანა: ბაზარზე გასვლა, პროდუქტის შეფუთვა, პროცესების დალაგება,
              გაყიდვების ზრდა ან ფინანსური მოდელის გადახედვა.
            </p>
          </div>

          <div class="check-list">
            <div v-for="item in consultingCases" :key="item" class="check-item">
              <span class="check-mark">+</span>
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import InnerPageLayout from './shared/InnerPageLayout.vue'

const consultingCases = [
  'ბიზნეს-მოდელის ანალიზი',
  'პროდუქტის ან სერვისის პოზიციონირება',
  'ფინანსური დაგეგმვა და ხარჯების სტრუქტურა',
  'გაყიდვების funnel-ის გამართვა',
  'გაფართოების სტრატეგიის მომზადება',
]
</script>
