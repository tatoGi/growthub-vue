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
            <li class="active">კონტაქტი</li>
          </ul>
        </div>
      </div>

      <!-- Page Header -->
      <section class="page-header">
        <div class="container">
          <div class="title-wrapper">
            <div class="line"></div>
            <h1>კონტაქტი</h1>
            <div class="line"></div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="contact-section-page">
        <div class="container">
          <div class="contact-grid">
            <!-- Contact Info -->
            <div class="contact-info-cards">
              <div class="info-card">
                <div class="icon-box">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <h3>ტელეფონი</h3>
                <p>1501</p>
                <p>+995 32 296 00 10</p>
              </div>

              <div class="info-card">
                <div class="icon-box">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <h3>ელ. ფოსტა</h3>
                <p>info@enterprise.ge</p>
              </div>

              <div class="info-card">
                <div class="icon-box">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <h3>მისამართი</h3>
                <p>მ. მარჯანიშვილის ქ. 5/16, თბილისი, საქართველო</p>
              </div>
            </div>

            <!-- Contact Form -->
            <div class="contact-form-wrapper">
              <form class="contact-page-form" @submit.prevent>
                <div class="form-row">
                  <div class="form-group">
                    <label>სახელი და გვარი</label>
                    <input type="text" placeholder="თქვენი სახელი" />
                  </div>
                  <div class="form-group">
                    <label>ელ. ფოსტა</label>
                    <input type="email" placeholder="example@mail.com" />
                  </div>
                </div>
                <div class="form-group">
                  <label>თემა</label>
                  <input type="text" placeholder="წერილის სათაური" />
                </div>
                <div class="form-group">
                  <label>შეტყობინება</label>
                  <textarea rows="5" placeholder="თქვენი ტექსტი..."></textarea>
                </div>
                <button type="submit" class="submit-btn-premium">გაგზავნა</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <!-- Map Placeholder -->
      <section class="map-section">
        <div class="container">
          <div class="map-placeholder">
             <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200" alt="Map View" />
             <div class="map-overlay">
                <div class="map-marker">
                   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#a41034"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>
                </div>
             </div>
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
</script>
