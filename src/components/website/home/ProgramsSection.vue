<script setup>
const programs = [
  {
    id: 1,
    name: 'პროექტი ღვინის გზა',
    tag: 'პროგრამა',
    text: 'ღვინის ტურიზმის ობიექტებისთვის საგზაო მანიშნებლების მონტაჟი და საინფორმაციო მხარდაჭერა.',
    image: 'https://growthhub.gov.ge/image/400x219/6716577e00763.png.jpg'
  },
  {
    id: 2,
    name: 'საკრედიტო საგარანტიო სქემა',
    tag: 'ფინანსები',
    text: 'ფინანსებზე წვდომის გაუმჯობესება მცირე და საშუალო ბიზნესებისთვის უზრუნველყოფის მხარდაჭერით.',
    image: 'https://growthhub.gov.ge/image/400x219/64ae8b4f1d0c0.jpeg.jpg'
  },
  {
    id: 3,
    name: 'მიკრომეწარმეობის მხარდაჭერა',
    tag: 'გრანტი',
    text: 'მიკრო და მცირე მეწარმეობის ხელშეწყობა, სამეწარმეო კულტურის განვითარება და სამუშაო ადგილები.',
    image: 'https://growthhub.gov.ge/image/400x219/66f667a4198ea.jpg'
  },
  {
    id: 4,
    name: 'სუბსიდირებული იპოთეკური სესხი',
    tag: 'სოციალური',
    text: 'მრავალშვილიანი ოჯახებისთვის საცხოვრებელი პირობების გაუმჯობესება იპოთეკის სუბსიდირებით.',
    image: 'https://growthhub.gov.ge/image/400x219/66f6788e140d8.png.jpg'
  },
  {
    id: 5,
    name: 'ბიზნეს უნივერსალი',
    tag: 'ინდუსტრია',
    text: 'კერძო სექტორის კონკურენტუნარიანობისა და სამეწარმეო პოტენციალის ზრდის ხელშეწყობა.',
    image: 'https://growthhub.gov.ge/image/400x219/66f6782865e9f.jpg'
  },
  {
    id: 6,
    name: 'მიკრომეწარმეობის ხელშეწყობა (დევნილებისთვის)',
    tag: 'მხარდაჭერა',
    text: 'იძულებით გადაადგილებული პირების სამეწარმეო პოტენციალისა და კონკურენტუნარიანობის გაზრდა.',
    image: 'https://growthhub.gov.ge/image/400x219/691f0d5aa8116.jpg'
  }
]
</script>

<template>
  <section class="programs-section">
    <div class="container">
      <div class="section-head">
        <div class="title-group">
          <span class="top-tag">აქტიური შესაძლებლობები</span>
          <h2>მიმდინარე პროგრამები</h2>
          <p class="subtitle">სახელმწიფოს მხარდაჭერით შენი ბიზნესის ზრდისთვის</p>
        </div>
        <a href="#/" class="view-all">ყველას ნახვა <span class="arrow">→</span></a>
      </div>

      <div class="grid">
        <article v-for="program in programs" :key="program.id" class="program-card">
          <div class="card-image-wrapper">
            <div class="card-image">
              <img :src="program.image" :alt="program.name" loading="lazy" />
              <div class="image-overlay"></div>
            </div>
            <div class="card-tag">{{ program.tag }}</div>
          </div>
          <div class="card-content">
            <h3>{{ program.name }}</h3>
            <p>{{ program.text }}</p>
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
</template>


