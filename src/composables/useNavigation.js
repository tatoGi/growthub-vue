import { ref, readonly } from 'vue'
import http from '../api/http'

const _mainMenu = ref([])
const _loaded = ref(false)

// Fallback in case API is unavailable
const FALLBACK_MENU = [
  {
    label: 'ბიზნესის მხარდაჭერა',
    slug: 'support',
    children: [
      { label: 'ბიზნეს-უნარების გაუმჯობესება', slug: 'support/skills' },
      { label: 'საკონსულტაციო მომსახურება', slug: 'support/consulting' },
      { label: 'ინფორმაციით უზრუნველყოფა', slug: 'support/info' },
    ],
  },
  { label: 'მიმდინარე პროგრამები', slug: 'programs', children: [] },
  { label: 'ღონისძიებები', slug: 'events', children: [] },
  { label: 'ვიდეო ანიმაციები', slug: 'animations', children: [] },
  { label: 'სააგენტოები', slug: 'agency', children: [] },
  {
    label: 'ჩვენ შესახებ',
    slug: 'about',
    children: [
      { label: 'პროექტის შესახებ', slug: 'about/project' },
      { label: 'პარტნიორი ორგანიზაციები', slug: 'about/partners' },
      { label: 'ხშირად დასმული კითხვები', slug: 'about/faq' },
      { label: 'ჩვენი გუნდი', slug: 'about/team' },
    ],
  },
  { label: 'დაგვიკავშირდი', slug: 'contact', children: [] },
]

export function useNavigation() {
  async function loadNavigation() {
    if (_loaded.value) return

    try {
      const { data } = await http.get('/website/navigation')
      const items = data?.data?.main ?? []

      _mainMenu.value = items.length ? items : FALLBACK_MENU
    } catch {
      _mainMenu.value = FALLBACK_MENU
    } finally {
      _loaded.value = true
    }
  }

  return {
    mainMenu: readonly(_mainMenu),
    loadNavigation,
  }
}
