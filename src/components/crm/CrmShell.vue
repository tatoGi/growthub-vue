<template>
  <div class="crm-shell">
    <aside class="crm-sidebar">
      <a class="crm-brand" href="#/">
        <span class="crm-brand-mark">GH</span>
        <div>
          <strong>GrowthHub CRM</strong>
          <span>Visual workspace</span>
        </div>
      </a>

      <div class="crm-user-info">
        <div class="crm-user-avatar">{{ user?.name?.charAt(0) ?? '?' }}</div>
        <div class="crm-user-meta">
          <strong>{{ user?.name }}</strong>
          <span class="crm-role-badge crm-role-badge--{{ role }}">{{ roleMeta.eyebrow }}</span>
        </div>
      </div>

      <div class="crm-nav-group">
        <span class="crm-nav-title">მენიუ</span>
        <a
          v-for="item in navItems"
          :key="item.path"
          :href="item.path"
          class="crm-nav-link"
          :class="{ active: item.path === currentPath }"
        >
          <span class="crm-nav-icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </a>
      </div>

      <div class="crm-sidebar-footer">
        <a href="#/" class="crm-ghost-link">საიტზე დაბრუნება</a>
        <button type="button" class="crm-logout-btn" @click="handleLogout">გამოსვლა</button>
      </div>
    </aside>

    <main class="crm-main">
      <header class="crm-topbar">
        <div>
          <span class="crm-eyebrow">{{ roleMeta.eyebrow }}</span>
          <h1>{{ page.title }}</h1>
          <p>{{ page.intro }}</p>
        </div>
        <div class="crm-topbar-actions">
          <a :href="roleMeta.defaultPath" class="crm-secondary-btn">როლის მთავარი</a>
          <button type="button" class="crm-primary-btn">ახალი ჩანაწერი</button>
        </div>
      </header>

      <section class="crm-metric-strip">
        <article v-for="item in roleMeta.stats" :key="item.label" class="crm-metric-card">
          <strong>{{ item.value }}</strong>
          <span>{{ item.label }}</span>
        </article>
      </section>

      <section class="crm-content-grid">
        <div class="crm-content-main">
          <div class="crm-chip-list">
            <span v-for="chip in page.chips" :key="chip" class="crm-chip">{{ chip }}</span>
          </div>

          <div class="crm-panel-grid">
            <article v-for="panel in page.panels" :key="panel.title" class="crm-panel">
              <h2>{{ panel.title }}</h2>
              <p>{{ panel.text }}</p>
              <ul class="crm-list">
                <li v-for="item in panel.items" :key="item">{{ item }}</li>
              </ul>
            </article>
          </div>

          <section class="crm-timeline">
            <div class="crm-section-head">
              <span>Pattern notes</span>
              <h2>UI flow მიმართულება</h2>
            </div>
            <article v-for="step in page.timeline" :key="step.title" class="crm-timeline-card">
              <div class="crm-timeline-index"></div>
              <div>
                <h3>{{ step.title }}</h3>
                <p>{{ step.copy }}</p>
              </div>
            </article>
          </section>
        </div>

        <aside class="crm-content-side">
          <article v-for="card in page.sideCards" :key="card.label" class="crm-side-card">
            <span>{{ card.label }}</span>
            <strong>{{ card.value }}</strong>
            <p>{{ card.note }}</p>
          </article>

          <article class="crm-side-card crm-side-card-accent">
            <span>შემდეგი ეტაპი</span>
            <strong>Integration-ready UI</strong>
            <p>რეალური backend-ის გარეშე აქ მხოლოდ UX flow და component architecture მზადდება.</p>
          </article>
        </aside>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useAuth } from '../../composables/useAuth'

const { logout } = useAuth()

defineProps({
  role: {
    type: String,
    required: true
  },
  user: {
    type: Object,
    default: null
  },
  currentPath: {
    type: String,
    required: true
  },
  navItems: {
    type: Array,
    required: true
  },
  roleMeta: {
    type: Object,
    required: true
  },
  page: {
    type: Object,
    required: true
  }
})

const handleLogout = () => {
  logout()
  window.location.hash = '#/'
}
</script>

