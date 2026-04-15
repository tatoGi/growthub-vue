import { ref } from 'vue'
import { programs } from '../data/programs'
import { videos } from '../data/videos'
import { teamMembers } from '../data/team'
import { partners } from '../data/partners'

const _cache = {}

const PAGES = {
  programs: {
    kind: 'programs',
    title: 'მიმდინარე პროგრამები',
    description: '',
    items: programs.map(p => ({ ...p, title: p.name, thumb: p.image, cover: p.image })),
  },
  animations: {
    kind: 'animations',
    title: 'ვიდეო ანიმაციები',
    description: '',
    items: videos.map(v => ({ ...v, thumb: v.thumbnail, cover: v.thumbnail })),
  },
  events: {
    kind: 'events',
    title: 'ღონისძიებები',
    description: '',
  },
  agency: {
    kind: 'agency',
    title: 'სააგენტოები',
    description: '',
  },
  contact: {
    kind: 'contact',
    title: 'დაგვიკავშირდი',
    description: '',
  },
  'about/faq': {
    kind: 'faq',
    title: 'ხშირად დასმული კითხვები',
    description: '',
    items: [
      {
        id: 1,
        question: 'ვინ შეიძლება ისარგებლოს გროუთჰაბის სერვისებით?',
        answer: '<p>გროუთჰაბის სერვისებით შეიძლება ისარგებლოს ნებისმიერმა ფიზიკურმა ან იურიდიულმა პირმა, ვისაც სურს ბიზნესის დაწყება ან განვითარება საქართველოში.</p>',
      },
      {
        id: 2,
        question: 'სერვისები ფასიანია?',
        answer: '<p>პლატფორმის ძირითადი სერვისები უფასოა. ზოგიერთ სპეციფიურ კონსულტაციაზე შეიძლება გათვალისწინებული იყოს სხვა პირობები.</p>',
      },
      {
        id: 3,
        question: 'საიდან შეიძლება მოვინახულო სააგენტო?',
        answer: '<p>კონსულტაციის ცენტრები მოქმედებს თბილისში, ბათუმში, ქუთაისში, ზუგდიდში, თელავსა და ახალციხეში.</p>',
      },
      {
        id: 4,
        question: 'როგორ შევარჩიო შესაფერისი პროგრამა?',
        answer: '<p>პლატფორმაზე შეგიძლია გაფილტრო პროგრამები კატეგორიის, ეტაპის ან მიზნობრიობის მიხედვით. ასევე შეგიძლია მიმართო საკონსულტაციო ცენტრს.</p>',
      },
      {
        id: 5,
        question: 'რა საბუთებია საჭირო განაცხადისთვის?',
        answer: '<p>საჭირო დოკუმენტაცია განსხვავდება კონკრეტული პროგრამის მიხედვით. ყოველ პროგრამის გვერდზე მოცემულია დეტალური ინფორმაცია მოთხოვნებზე.</p>',
      },
    ],
  },
  'about/team': {
    kind: 'post_list',
    title: 'ჩვენი გუნდი',
    description: '',
    items: teamMembers.map(m => ({ ...m, title: m.name, thumb: m.photo })),
  },
  'about/partners': {
    kind: 'post_list',
    title: 'პარტნიორი ორგანიზაციები',
    description: '',
    items: partners.map(p => ({ ...p, title: p.name, thumb: p.photo })),
  },
  'about/project': {
    kind: 'text_page',
    title: 'პროექტის შესახებ',
    description: 'გროუთჰაბი — ბიზნეს მხარდაჭერის ერთიანი ციფრული პლატფორმა',
    body_html:
      '<h2>გროუთჰაბი</h2><p>გროუთჰაბი არის ბიზნეს მხარდაჭერის ერთიანი ციფრული პლატფორმა, სადაც ქართული ბიზნეს სუბიექტები პოულობენ ინფორმაციას სახელმწიფო პროგრამებზე, კერძო სერვისებზე, ღონისძიებებსა და სახელმძღვანელო ვიდეო მასალებზე.</p><p>სააგენტო „აწარმოე საქართველოში" ახორციელებს სხვადასხვა მხარდამჭერ პროგრამას მეწარმეობის, ექსპორტის, ინოვაციისა და ბიზნეს განვითარების სფეროებში.</p>',
  },
  support: {
    kind: 'section',
    title: 'ბიზნესის მხარდაჭერა',
    description: 'გამოიყენე ჩვენი სერვისები შენი ბიზნესის გასაძლიერებლად',
    children: [
      {
        id: 1,
        title: 'ბიზნეს-უნარების გაუმჯობესება',
        description: 'ტრენინგები, პრაქტიკული სესიები და უნარების განვითარების პროგრამები.',
        link: '#support/skills',
      },
      {
        id: 2,
        title: 'საკონსულტაციო მომსახურება',
        description: 'მიმართულებული კონსულტაცია კონკრეტული ბიზნეს გამოწვევებისთვის.',
        link: '#support/consulting',
      },
      {
        id: 3,
        title: 'ინფორმაციით უზრუნველყოფა',
        description: 'სწრაფი წვდომა პროგრამებზე, წესებზე და საჯარო ინფორმაციაზე.',
        link: '#support/info',
      },
    ],
  },
  'support/skills': {
    kind: 'text_page',
    title: 'ბიზნეს-უნარების გაუმჯობესება',
    description: '',
    body_html:
      '<h2>ბიზნეს-უნარების განვითარება</h2><p>ეს მიმართულება მოიცავს ტრენინგებს, ვორქშოფებსა და პრაქტიკულ სესიებს, რომლებიც ეხმარება მეწარმეებს ბიზნეს გამოწვევების გადაჭრაში.</p>',
  },
  'support/consulting': {
    kind: 'text_page',
    title: 'საკონსულტაციო მომსახურება',
    description: '',
    body_html:
      '<h2>საკონსულტაციო მომსახურება</h2><p>ჩვენი ექსპერტები გთავაზობენ მიმართულებულ კონსულტაციას ბიზნეს სტრატეგიის, ფინანსების, მარკეტინგის და სხვა გამოწვევების გარშემო.</p>',
  },
  'support/info': {
    kind: 'text_page',
    title: 'ინფორმაციით უზრუნველყოფა',
    description: '',
    body_html:
      '<h2>ინფორმაციით უზრუნველყოფა</h2><p>პლატფორმა გაძლევს სწრაფ წვდომას მოქმედ პროგრამებზე, სახელმწიფო რეგულაციებზე, განაცხადის ვადებზე და სხვა სასარგებლო ინფორმაციაზე.</p>',
  },
}

export function usePage() {
  const page = ref(null)
  const loading = ref(false)
  const error = ref(false)

  function load(slug) {
    if (!slug) return

    if (_cache[slug] !== undefined) {
      page.value = _cache[slug]
      return
    }

    loading.value = true
    error.value = false

    const data = PAGES[slug] ?? null
    page.value = data
    _cache[slug] = data
    loading.value = false
  }

  return { page, loading, error, load }
}
