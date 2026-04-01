import { ref, readonly } from 'vue'
import http from '../api/http'

const _hero = ref({
  badge: 'დაიწყე ბიზნესი დღეს',
  title: 'აქციე იდეა წარმატებულ ბიზნესად',
  description: 'აღმოაჩინე სახელმწიფო და კერძო პროგრამები, რომლებიც დაგეხმარება ბიზნესის დაწყებასა და განვითარებაში.',
  quick_tags: ['#მიკროგრანტი', '#ბიზნესის მხარდაჭერა', '#ექსპორტი'],
  bg_image: null,
})

const _programs = ref([])

const _about = ref({
  label: 'ჩვენი მისია',
  title: 'ხელს ვუწყობთ ქართული ბიზნესის განვითარებასა და ექსპორტის ზრდას',
  body: 'სააგენტო „აწარმოე საქართველოში" არის პირველი სახელმწიფო ორგანიზაცია საქართველოში, რომლის მიზანია ბიზნესის მხარდაჭერა, მეწარმეობის კულტურის განვითარება და ქვეყნის საექსპორტო პოტენციალის ზრდა.',
  stats: [
    { number: '5,400+', label: 'მხარდაჭერილი პროექტი' },
    { number: '20,000+', label: 'შექმნილი სამუშაო ადგილი' },
    { number: '1.2B₾', label: 'ინვესტიციის მოცულობა' },
  ],
})

const _cta = ref({
  title: 'გჭირდებათ დეტალური კონსულტაცია?',
  text: 'გამოგზავნე მოთხოვნა და ჩვენი გუნდის გამოცდილი ექსპერტები დაგიკავშირდებიან, რათა დაგეხმარონ ბიზნესის განვითარების სწორი სტრატეგიის შერჩევაში.',
})

const _loaded = ref(false)

export function useHome() {
  async function loadHome(locale = 'ka') {
    if (_loaded.value) return

    try {
      const { data } = await http.get('/website/home', { params: { locale } })
      const d = data?.data

      if (d?.hero) _hero.value = d.hero
      if (d?.programs) _programs.value = d.programs
      if (d?.about) _about.value = d.about
      if (d?.cta) _cta.value = d.cta
    } catch {
      // keep defaults
    } finally {
      _loaded.value = true
    }
  }

  return {
    hero: readonly(_hero),
    programs: readonly(_programs),
    about: readonly(_about),
    cta: readonly(_cta),
    loadHome,
  }
}
