export const eventRegions = ['თბილისი', 'ბათუმი', 'ქუთაისი', 'ონლაინ']

export const eventTypes = ['ვორქშოფი', 'ტრენინგი', 'მენტორინგი', 'სხვა']

export const events = [
  {
    id: 1,
    slug: 'digital-business-processes',
    title: 'ბიზნეს პროცესების გაციფრულება',
    type: 'ვორქშოფი',
    location: 'თბილისი',
    day: '10',
    month: 'ნოემ',
    dateLabel: '10 ნოემბერი 2026',
    dateRange: '2026-11-10 - 2026-11-10',
    description: 'შეხვედრა მცირე და საშუალო ბიზნესის წარმომადგენლებთან ციფრული ტრანსფორმაციის შესახებ.',
    fullDescription:
      'ვორქშოფი ფოკუსირდება იმაზე, როგორ შეიძლება ბიზნეს პროცესების ოპტიმიზაცია, დოკუმენტბრუნვის გამარტივება და გუნდურ მუშაობაში ციფრული ინსტრუმენტების ინტეგრაცია.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=900',
    attachments: ['პრეზენტაციის მოკლე პროგრამა.pdf', 'რეგისტრაციის ინსტრუქცია.pdf'],
  },
  {
    id: 2,
    slug: 'grow-your-business-training',
    title: 'განავითარე შენი ბიზნესი',
    type: 'ტრენინგი',
    location: 'ბათუმი',
    day: '11',
    month: 'ნოემ',
    dateLabel: '11 ნოემბერი 2026',
    dateRange: '2026-11-11 - 2026-11-11',
    description: 'ინტენსიური ტრენინგ კურსი მეწარმეებისთვის ბიზნესის სტრატეგიული დაგეგმვის მიმართულებით.',
    fullDescription:
      'სესია მოიცავს ბაზრის შეფასებას, მიზნების სწორ ჩამოყალიბებას, ოპერაციული პრიორიტეტების დადგენას და ზრდის პრაქტიკულ ჩარჩოს.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=900',
    attachments: ['დღის წესრიგი.pdf'],
  },
  {
    id: 3,
    slug: 'mentor-meetup',
    title: 'შეხვედრა მენტორებთან',
    type: 'მენტორინგი',
    location: 'ქუთაისი',
    day: '11',
    month: 'ნოემ',
    dateLabel: '11 ნოემბერი 2026',
    dateRange: '2026-11-11 - 2026-11-11',
    description: 'ინდივიდუალური შეხვედრები გამოცდილ მენტორებთან ბიზნეს იდეების ვალიდაციისთვის.',
    fullDescription:
      'ფორმატი განკუთვნილია იმ მონაწილეებისთვის, რომლებიც ეძებენ სწრაფ უკუკავშირს იდეაზე, პროდუქტის პოზიციონირებაზე ან ბიზნესის ზრდის შემდეგ ნაბიჯზე.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=900',
    attachments: [],
  },
  {
    id: 4,
    slug: 'ecommerce-trends-2026',
    title: 'E-commerce ტენდენციები 2026',
    type: 'ტრენინგი',
    location: 'ონლაინ',
    day: '13',
    month: 'ნოემ',
    dateLabel: '13-15 ნოემბერი 2026',
    dateRange: '2026-11-13 - 2026-11-15',
    description: 'ელექტრონული კომერციის თანამედროვე პლატფორმები და გაყიდვების ოპტიმიზაციის სტრატეგიები.',
    fullDescription:
      'ტრენინგი ეხება ონლაინ გაყიდვების არხებს, conversion-ის გაუმჯობესებას, კატალოგების სტრუქტურას და მომხმარებლის journey-ს.',
    image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=900',
    attachments: ['Zoom ბმულის ინსტრუქცია.pdf', 'სასწავლო მასალა.pdf'],
  },
]

export const findEventBySlug = (slug) => events.find((event) => event.slug === slug)
