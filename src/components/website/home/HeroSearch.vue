<template>
  <section class="hero-section">
    <div class="hero-bg"></div>
    <div class="hero-overlay"></div>
    
    <div class="container">
      <div class="content fade-in-up">
        <div class="badge">
          <span class="badge-dot"></span>
          დაიწყე ბიზნესი დღეს
        </div>
        
        <h1>აქციე იდეა წარმატებულ ბიზნესად</h1>
        <p class="description">
          აღმოაჩინე სახელმწიფო და კერძო პროგრამები, რომლებიც დაგეხმარება ბიზნესის დაწყებასა და განვითარებაში.
        </p>

        <div class="search-container">
          <form class="search-form" action="/" @submit.prevent>
            <div class="input-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" name="search" placeholder="რას ეძებთ? მოძებნეთ სერვისები, პროგრამები..." />
            </div>
            <button type="submit" class="search-btn">
              <span>ძებნა</span>
            </button>
          </form>
          
          <div class="quick-tags">
            <span class="tag-label">ხშირად ძებნადი:</span>
            <div class="tags-list">
              <a href="#">#მიკროგრანტი</a>
              <a href="#">#ბიზნესის მხარდაჭერა</a>
              <a href="#">#ექსპორტი</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


