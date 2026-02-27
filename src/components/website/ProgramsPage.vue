<template>
  <div class="site-shell">
    <WebsiteHeader />
    
    <main class="main-content">
      <!-- Breadcrumbs -->
      <div class="breadcrumbs-bar">
        <div class="container">
          <ul class="breadcrumbs">
            <li><a href="#/">მთავარი</a></li>
            <li><span class="separator">/</span></li>
            <li class="active">მიმდინარე პროგრამები</li>
          </ul>
        </div>
      </div>

      <!-- Page Header -->
      <section class="page-header">
        <div class="container">
          <div class="title-wrapper">
            <div class="line"></div>
            <h1>მიმდინარე პროგრამები</h1>
            <div class="line"></div>
          </div>
        </div>
      </section>

      <!-- Programs Grid -->
      <section class="programs-grid-section">
        <div class="container">
          <div class="grid">
            <article v-for="program in allPrograms" :key="program.id" class="program-card">
              <div class="card-image-wrapper">
                <div class="card-image">
                  <img :src="program.image" :alt="program.name" loading="lazy" />
                  <div class="image-overlay"></div>
                </div>
              </div>
              <div class="card-content">
                <h3>{{ program.name }}</h3>
                <p class="agency-name">{{ program.agency }}</p>
                <div class="card-footer">
                  <a href="#" class="read-more">
                    გაიგე მეტი
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>

    <WebsiteFooter />
  </div>
</template>

<script setup>
import WebsiteHeader from './home/WebsiteHeader.vue'
import WebsiteFooter from './home/WebsiteFooter.vue'

const allPrograms = [
  {
    id: 1,
    name: 'პროექტი ღვინის გზა',
    agency: 'საქართველოს ტურიზმის ეროვნული ადმინისტრაცია',
    image: 'https://growthhub.gov.ge/image/400x219/6716577e00763.png.jpg'
  },
  {
    id: 2,
    name: 'საკრედიტო საგარანტიო სქემა',
    agency: 'აწარმოე საქართველოში',
    image: 'https://growthhub.gov.ge/image/400x219/64ae8b4f1d0c0.jpeg.jpg'
  },
  {
    id: 3,
    name: 'მიკრომეწარმეობის მხარდაჭერის სახელმწიფო პროგრამა',
    agency: 'აწარმოე საქართველოში',
    image: 'https://growthhub.gov.ge/image/400x219/66f667a4198ea.jpg'
  },
  {
    id: 4,
    name: 'სუბსიდირებული იპოთეკური სესხი',
    agency: 'აწარმოე საქართველოში',
    image: 'https://growthhub.gov.ge/image/400x219/66f6788e140d8.png.jpg'
  },
  {
    id: 5,
    name: 'ბიზნეს უნივერსალი',
    agency: 'აწარმოე საქართველოში',
    image: 'https://growthhub.gov.ge/image/400x219/66f6782865e9f.jpg'
  },
  {
    id: 6,
    name: 'მიკრომეწარმეობის ხელშეწყობა (დევნილებისთვის)',
    agency: 'აწარმოე საქართველოში',
    image: 'https://growthhub.gov.ge/image/400x219/691f0d5aa8116.jpg'
  }
]
</script>


