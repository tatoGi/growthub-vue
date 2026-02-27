<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="/assets/images/logoo.png" alt="აწარმოე საქართველოში" class="footer-logo" />
          <p class="brand-desc">
            სააგენტო „აწარმოე საქართველოში“ ხელს უწყობს მეწარმეობის განვითარებასა და ქართული პროდუქციის ექსპორტს მსოფლიო ბაზარზე.
          </p>
          <div class="social-links">
            <a href="https://facebook.com/enterprisegeorgia" target="_blank" class="social-btn" title="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://linkedin.com/company/enterprise-georgia" target="_blank" class="social-btn" title="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" class="social-btn" title="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" class="social-btn" title="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
          </div>
        </div>

        <div class="footer-nav">
          <h4>ნავიგაცია</h4>
          <ul>
            <li><a href="#">მთავარი</a></li>
            <li><a href="#">პროგრამები</a></li>
            <li><a href="#">სერვისები</a></li>
            <li><a href="#">სიახლეები</a></li>
            <li><a href="#">ჩვენ შესახებ</a></li>
          </ul>
        </div>

        <div class="footer-nav">
          <h4>სასარგებლო</h4>
          <ul>
            <li><a href="#">ხშირად დასმული კითხვები</a></li>
            <li><a href="#">ბლოგი</a></li>
            <li><a href="#">კონფიდენციალურობის პოლიტიკა</a></li>
            <li><a href="#">წესები და პირობები</a></li>
          </ul>
        </div>

        <div class="footer-contact">
          <h4>კონტაქტი</h4>
          <ul class="contact-items">
            <li>
              <span class="label">მისამართი:</span>
              <p>მარჯანიშვილის ქ. 5/16, თბილისი 0102, საქართველო</p>
            </li>
            <li>
              <span class="label">ცხელი ხაზი:</span>
              <p class="phone-link">1505</p>
            </li>
            <li>
              <span class="label">ელ-ფოსტა:</span>
              <p>info@enterprise.ge</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} აწარმოე საქართველოში. ყველა უფლება დაცულია.</p>
        <div class="legal">
          <span>Created by <span class="growth-hub">GrowthHub</span></span>
        </div>
      </div>
    </div>
  </footer>
</template>


