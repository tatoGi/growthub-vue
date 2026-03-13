<template>
  <InnerPageLayout
    breadcrumb="პროექტის შესახებ"
    title="პროექტის შესახებ"
    description="ეს გვერდი Laravel-ის text-page flow-ს მიყვება: ვიზუალური cover block, შინაარსობრივი ტექსტი და პროექტის მთავარ აქცენტებზე აგებული სტრუქტურა."
  >
    <section class="content-section surface-section">
      <div class="container">
        <div class="project-story-layout">
          <article class="project-story-media">
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1200"
              alt="პროექტის შესახებ"
            />
          </article>

          <article class="project-story-copy">
            <span class="eyebrow">About Project</span>
            <h2>ერთი საჯარო სივრცე, სადაც პროგრამები, სერვისები და საჭირო ინფორმაცია ერთიანდება</h2>
            <p>
              GrowthHub-ის ამოცანაა მეწარმისთვის ან დაინტერესებული მომხმარებლისთვის ინფორმაციის მოძიება ნაკლებად
              ქაოსური და უფრო მკაფიო გახდეს. ძველ Laravel ვერსიაში ეს შინაარსი text-page ფორმატში იწერებოდა,
              ხოლო Vue-ში იმავე იდეას უფრო თანამედროვე, უფრო იკითხებადი სტრუქტურით ვაწყობთ.
            </p>
            <p>
              პროექტი აერთიანებს პროგრამების დათვალიერებას, ღონისძიებებზე გადასვლას, საკონსულტაციო სერვისების
              გაცნობას და კონტაქტის ერთიან არხს. მიზანია, რომ მომხმარებელმა არ იაროს სხვადასხვა გვერდზე
              განუსაზღვრელად და სწრაფად მიხვდეს შემდეგ ნაბიჯს.
            </p>
          </article>
        </div>

        <div class="project-story-grid">
          <article class="rich-card">
            <h3>რას აგვარებს პროექტი</h3>
            <p>
              მთავარი პრობლემა იყო ინფორმაციის ფრაგმენტულობა. სხვადასხვა პროგრამა, სიახლე, კონტაქტი და მხარდაჭერის
              ფორმა რამდენიმე მიმართულებად იშლებოდა. ახალი Vue front ამ კონტენტს აერთიანებს უფრო თანმიმდევრულ
              გამოცდილებად.
            </p>
          </article>

          <article class="rich-card">
            <h3>ვისთვისაა გათვლილი</h3>
            <p>
              დამწყები მეწარმეებისთვის, მოქმედი ბიზნესებისთვის და იმ მომხმარებლებისთვის, ვისაც სურს სწრაფად იპოვოს
              მხარდაჭერის სერვისი, მიმდინარე შესაძლებლობა ან სწორი საკონტაქტო წერტილი.
            </p>
          </article>

          <article class="rich-card">
            <h3>როგორ მუშაობს</h3>
            <p>
              მომხმარებელი შედის თემატურ მიმართულებაში, ათვალიერებს პროგრამებს ან ღონისძიებებს, შემდეგ გადადის
              დეტალურ გვერდზე და იქიდან იღებს გადაწყვეტილებას: კონტაქტი, რეგისტრაცია ან ინფორმაციის გაღრმავება.
            </p>
          </article>
        </div>

        <div class="project-story-bottom">
          <article class="detail-card wide">
            <h3>მთავარი მიმართულებები</h3>
            <div class="check-list project-check-list">
              <div v-for="item in focusAreas" :key="item" class="check-item">
                <span class="check-mark">+</span>
                <span>{{ item }}</span>
              </div>
            </div>
          </article>

          <article class="project-share-card">
            <span class="eyebrow">Share</span>
            <h3>გააზიარე გვერდი</h3>
            <p>ძველ text-page გვერდზე იყო social share block. აქ ის უფრო სუფთა CTA ფორმატშია დატოვებული.</p>
            <div class="project-share-actions">
              <a href="#about/partners" class="primary-action-link">პარტნიორები</a>
              <a href="#contact" class="back-link">კონტაქტი</a>
            </div>
          </article>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import InnerPageLayout from './shared/InnerPageLayout.vue'

const focusAreas = [
  'პროგრამებისა და სერვისების ერთიან სივრცეში წარმოდგენა',
  'მარტივი ნავიგაცია მხარდაჭერის და ინფორმაციის მიმართულებებს შორის',
  'ღონისძიებების, ვიდეოების და კონტაქტის page flow-ის გამარტივება',
  'ძველი Laravel content structure-ის უფრო თანამედროვე ვიზუალში გადატანა',
]
</script>
