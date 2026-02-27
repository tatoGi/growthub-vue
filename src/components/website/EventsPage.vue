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
            <li class="active">ღონისძიებები</li>
          </ul>
        </div>
      </div>

      <!-- Page Header -->
      <section class="page-header">
        <div class="container">
          <div class="title-wrapper">
            <div class="line"></div>
            <h1>ღონისძიებები</h1>
            <div class="line"></div>
          </div>
        </div>
      </section>

      <!-- Events Grid -->
      <section class="events-grid-section">
        <div class="container">
          <div class="grid">
            <article v-for="event in allEvents" :key="event.id" class="event-card">
              <div class="card-image-wrapper">
                <div class="card-image">
                  <img :src="event.image" :alt="event.title" loading="lazy" />
                  <div class="image-overlay"></div>
                </div>
                <div class="date-badge">
                  <span class="day">{{ event.day }}</span>
                  <span class="month">{{ event.month }}</span>
                </div>
              </div>
              <div class="card-content">
                <div class="event-meta">
                  <span class="event-type">{{ event.type }}</span>
                  <span class="event-location">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {{ event.location }}
                  </span>
                </div>
                <h3>{{ event.title }}</h3>
                <p>{{ event.description }}</p>
                <div class="card-footer">
                  <a href="#" class="join-btn">რეგისტრაცია</a>
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

const allEvents = [
  {
    id: 1,
    title: 'ბიზნეს პროცესების გაციფრულება',
    type: 'ვორქშოპი',
    location: 'თბილისი',
    day: '10',
    month: 'ნოემ',
    description: 'შეხვედრა მცირე და საშუალო ბიზნესის წარმომადგენლებთან ციფრული ტრანსფორმაციის შესახებ.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 2,
    title: 'განავითარე შენი ბიზნესი',
    type: 'ტრენინგი',
    location: 'ბათუმი',
    day: '11',
    month: 'ნოემ',
    description: 'ინტენსიური ტრენინგ კურსი მეწარმეებისთვის ბიზნესის სტრატეგიული დაგეგმვის მიმართულებით.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 3,
    title: 'შეხვედრა მენტორთან',
    type: 'კონსულტაცია',
    location: 'ქუთაისი',
    day: '11',
    month: 'ნოემ',
    description: 'ინდივიდუალური შეხვედრები გამოცდილ მენტორებთან ბიზნეს იდეების ვალიდაციისთვის.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 4,
    title: 'E-commerce ტენდენციები 2024',
    type: 'ტრენინგი',
    location: 'ონლაინ',
    day: '13',
    month: 'ნოემ',
    description: 'ელექტრონული კომერციის თანამედროვე პლატფორმები და გაყიდვების ოპტიმიზაციის სტრატეგიები.',
    image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=400'
  }
]
</script>
