import { ref, readonly } from 'vue'
import { programs } from '../data/programs'

const _hero = ref({
  badge: 'დაიწყე ბიზნესი დღეს',
  title: 'აქციე იდეა წარმატებულ ბიზნესად',
  description: 'აღმოაჩინე სახელმწიფო და კერძო პროგრამები, რომლებიც დაგეხმარება ბიზნესის დაწყებასა და განვითარებაში.',
  quick_tags: ['#მიკროგრანტი', '#ბიზნესის მხარდაჭერა', '#ექსპორტი'],
  bg_image: null,
})

const _programs = ref(programs.slice(0, 3))

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

export function useHome() {
  function loadHome() {
    // data already loaded from static source
  }

  return {
    hero: readonly(_hero),
    programs: readonly(_programs),
    about: readonly(_about),
    cta: readonly(_cta),
    loadHome,
  }
}
