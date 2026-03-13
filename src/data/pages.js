export const textPages = [
  {
    slug: 'platform-principles',
    title: 'პლატფორმის პრინციპები',
    summary: 'Generic text-page template Laravel-ის text-pages flow-სთვის.',
    cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
    body: [
      'ეს გვერდი წარმოადგენს generic text-page renderer-ის მაგალითს, რომელიც გამოიყენება static/content ტიპის გვერდებისთვის.',
      'ძველი Laravel-ში ასეთი გვერდები text-pages კონტროლერიდან რენდერდებოდა; Vue-ში იგივე საჭიროება იხურება reusable page template-ით.',
      'ასეთი მიდგომა შემდეგ ეტაპზე რეალურ backend contract-ზე პირდაპირ დასაბმელადაც გამოდგება.',
    ],
  },
]

export const submenuSections = [
  {
    slug: 'support-overview',
    title: 'მხარდაჭერის მიმართულებები',
    summary: 'Generic submenu landing page parent -> child navigation სტრუქტურისთვის.',
    children: [
      {
        title: 'ბიზნეს-უნარები',
        description: 'ტრენინგები, პრაქტიკული სესიები და უნარების განვითარება.',
        link: '#support/skills',
      },
      {
        title: 'საკონსულტაციო მომსახურება',
        description: 'მიმართულებული კონსულტაცია კონკრეტული ბიზნეს გამოწვევებისთვის.',
        link: '#support/consulting',
      },
      {
        title: 'ინფორმაციით უზრუნველყოფა',
        description: 'სწრაფი წვდომა პროგრამებზე, წესებზე და საჯარო ინფორმაციაზე.',
        link: '#support/info',
      },
    ],
  },
]
