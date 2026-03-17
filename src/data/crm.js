export const crmRoleMeta = {
  user: {
    label: 'ბიზნეს მომხმარებელი',
    eyebrow: 'CRM / BUSINESS',
    description: 'კომპანიის პროფილი, შეტყობინებები, ვიზიტები და სასწავლო რესურსები ერთ სამუშაო სივრცეში.',
    defaultPath: '#crm/user/business',
    stats: [
      { value: '12', label: 'აქტიური ამოცანა' },
      { value: '4', label: 'ახალი შეტყობინება' },
      { value: '3', label: 'დაგეგმილი ვიზიტი' }
    ]
  },
  central: {
    label: 'ცენტრალური ოფისი',
    eyebrow: 'CRM / CENTRAL',
    description: 'ცენტრალიზებული მართვის პანელი თანამშრომლების, კომპანიების, ანგარიშებისა და კომუნიკაციისთვის.',
    defaultPath: '#crm/central/profile',
    stats: [
      { value: '248', label: 'კომპანია ბაზაში' },
      { value: '19', label: 'თანამშრომელი ონლაინ' },
      { value: '31', label: 'ახალი ანგარიში' }
    ]
  },
  bank: {
    label: 'ფინანსური ინსტიტუტი',
    eyebrow: 'CRM / BANK',
    description: 'ბანკისა და ფინანსური ინსტიტუტის პროფილი, საკონტაქტო მონაცემები და მომსახურების არხები.',
    defaultPath: '#crm/bank/profile',
    stats: [
      { value: '7', label: 'აქტიური პროგრამა' },
      { value: '14', label: 'საკონტაქტო მოთხოვნა' },
      { value: '92%', label: 'პროფილის შევსება' }
    ]
  }
}

export const crmNav = {
  user: [
    { label: 'ჩემი ანგარიში', path: '#crm/user/business', icon: '01' },
    { label: 'შეტყობინებები', path: '#crm/user/messages', icon: '02' },
    { label: 'კალენდარი', path: '#crm/user/calendar', icon: '03' },
    { label: 'დიაგნოსტიკა', path: '#crm/user/diagnostic', icon: '04' },
    { label: 'ღონისძიებები', path: '#crm/user/events', icon: '05' },
    { label: 'მასალები', path: '#crm/user/materials', icon: '06' },
    { label: 'ვიზიტის დაგეგმვა', path: '#crm/user/plan-visit', icon: '07' },
    { label: 'პაროლის შეცვლა', path: '#crm/user/changepass', icon: '08' }
  ],
  central: [
    { label: 'ჩემი ანგარიში', path: '#crm/central/profile', icon: '01' },
    { label: 'ცენტრის წევრები', path: '#crm/central/members', icon: '02' },
    { label: 'თანამშრომლები', path: '#crm/central/employees', icon: '03' },
    { label: 'მეწარმეთა ბაზა', path: '#crm/central/companies', icon: '04' },
    { label: 'რეპორტები', path: '#crm/central/reports', icon: '05' },
    { label: 'კალენდარი', path: '#crm/central/calendar', icon: '06' },
    { label: 'სასწავლო მასალები', path: '#crm/central/materials', icon: '07' },
    { label: 'ღონისძიებები', path: '#crm/central/events', icon: '08' },
    { label: 'საკონს. ორგანიზაციები', path: '#crm/central/consulting', icon: '09' },
    { label: 'ტრენინგ კომპანიები', path: '#crm/central/training', icon: '10' },
    { label: 'პროექტები', path: '#crm/central/projects', icon: '11' },
    { label: 'შეტყობინებები', path: '#crm/central/messages', icon: '12' },
    { label: 'დიაგნოსტიკა', path: '#crm/central/diagnostic', icon: '13' },
    { label: 'პაროლის შეცვლა', path: '#crm/central/changepass', icon: '14' }
  ],
  bank: [
    { label: 'ფინანსური ინსტიტუტი', path: '#crm/bank/profile', icon: '01' }
  ]
}

export const crmPageContent = {
  '#crm/user/business': {
    title: 'ჩემი ანგარიში',
    intro: 'ძველი Laravel ბიზნეს-პროფილის tabbed view აქ გადაიწყო ერთიან, ეტაპობრივ სამუშაო სივრცედ.',
    chips: ['კომპანია', 'სერვისები', 'დირექტორი', 'საკონტაქტო პირი', 'კრიტერიუმები', 'ბიზნეს უნივერსალი'],
    panels: [
      {
        title: 'კომპანიის პროფილი',
        text: 'იურიდიული პირის მთავარი იდენტიფიკატორები, ბრენდი, სტატუსი და რეგიონის ჭრილი ერთ ბლოკში.',
        items: ['ბრენდის დასახელება', 'საიდენტიფიკაციო კოდი', 'NACE / HS კლასიფიკაცია']
      },
      {
        title: 'საქმიანობის ადგილები',
        text: 'ლოკაციები ცალკე ბარათებადაა ნაჩვენები, რომ დამატება და კორექტირება ადვილად გაგრძელდეს.',
        items: ['თბილისი / სათაო ოფისი', 'ქუთაისი / საწარმო', 'ბათუმი / სერვის-პუნქტი']
      }
    ],
    sideCards: [
      { label: 'პროფილის სტატუსი', value: '84%', note: 'შევსებულია 6-დან 5 სექცია' },
      { label: 'აქტიური განაცხადი', value: '2', note: 'მიმდინარე პროგრამებთან კავშირი' }
    ],
    timeline: [
      { title: 'სერვისების მონიშვნა', copy: 'სწრაფი toggles, არა ძველი მძიმე tabs.' },
      { title: 'დოკუმენტების ატვირთვა', copy: 'upload history და ფაილის სტატუსები ცალკე ბლოკად.' },
      { title: 'რეგიონული მონაცემები', copy: 'ლოკაციები accordion/modal pattern-ით.' }
    ]
  },
  '#crm/user/messages': {
    title: 'შეტყობინებები',
    intro: 'ინბოქსი, unread count და თემატური threads ერთ თანამედროვე კომუნიკაციის view-ში.',
    chips: ['Unread', 'Internal', 'Consulting', 'Events'],
    panels: [
      {
        title: 'აქტიური დიალოგები',
        text: 'თითო თემა ჩანს ბოლო პასუხით, პასუხისმგებელი კონსულტანტით და SLA დროით.',
        items: ['ღონისძიებაზე დასწრების დეტალები', 'საკონსულტაციო შეხვედრის კითხვა', 'ფინანსური პროგრამის დოკუმენტი']
      },
      {
        title: 'სწრაფი მოქმედებები',
        text: 'response templates და internal tagging შეიძლება შემდეგ integration-ზე დაემატოს.',
        items: ['ახალი შეტყობინება', 'არქივი', 'შიდა მონიშვნა']
      }
    ],
    sideCards: [
      { label: 'ახალი', value: '4', note: 'ბოლო 24 საათში' },
      { label: 'SLA', value: '1h', note: 'საშუალო პასუხის დრო' }
    ],
    timeline: [
      { title: 'Thread layout', copy: 'მარცხნივ conversation list, მარჯვნივ დეტალი.' },
      { title: 'Unread prioritization', copy: 'ახალი შეტყობინებები first-class ელემენტია.' }
    ]
  },
  '#crm/user/calendar': {
    title: 'კალენდარი',
    intro: 'ვიზიტები, ღონისძიებები და შიდა deadline-ები ერთ განრიგში.',
    chips: ['კვირა', 'თვე', 'ვიზიტები', 'ღონისძიებები'],
    panels: [
      {
        title: 'დღევანდელი ჩანაწერები',
        text: 'ვიზუალური time blocks და პასუხისმგებელი წევრის ბეჯები.',
        items: ['11:00 კონსულტაცია', '15:00 ონლაინ ვორქშოფი', '17:30 დოკუმენტის ვადა']
      },
      {
        title: 'დაგეგმვის პანელი',
        text: 'ახალი ვიზიტი, remind me და notes ერთ drawer pattern-ში.',
        items: ['ვიზიტის მოთხოვნა', 'calendar sync', 'notification rules']
      }
    ],
    sideCards: [
      { label: 'ამ კვირაში', value: '9', note: 'შეხვედრა / აქტივობა' },
      { label: 'შემდეგი ვიზიტი', value: '15:00', note: 'ორშაბათი' }
    ],
    timeline: [{ title: 'Month overview', copy: 'ფერის მიხედვით ჩანაწერების კატეგორიები.' }]
  },
  '#crm/user/diagnostic': {
    title: 'ბიზნეს-დიაგნოსტიკა',
    intro: 'შეფასების კითხვარები, პროგრესი და რეკომენდაციები scorecard ფორმატში.',
    chips: ['ფინანსები', 'გაყიდვები', 'ოპერაციები', 'მარკეტინგი'],
    panels: [
      {
        title: 'ძირითადი შეფასება',
        text: 'სექციები score, risk და action plan ჭრილშია ორგანიზებული.',
        items: ['ფინანსური მდგრადობა', 'ციფრული მზაობა', 'გუნდის განვითარება']
      },
      {
        title: 'შემდეგი ნაბიჯები',
        text: 'განსაზღვრულია prioritized actions და შესაბამისი პროგრამები.',
        items: ['სესიის დაჯავშნა', 'გეგმის შენახვა', 'ანგარიშის ექსპორტი']
      }
    ],
    sideCards: [
      { label: 'მზაობის ქულა', value: '76', note: '100-დან' },
      { label: 'ღია ამოცანა', value: '5', note: 'საჭირო ყურადღება' }
    ],
    timeline: [{ title: 'Scoreboard', copy: 'ძველი table-heavy view-ის ნაცვლად insight-first cards.' }]
  },
  '#crm/user/events': {
    title: 'ღონისძიებები',
    intro: 'CRM-ში ღონისძიებები გამოისახოს registration status-ით და personal relevance-ით.',
    chips: ['Upcoming', 'Registered', 'Completed'],
    panels: [
      {
        title: 'შერჩეული ღონისძიებები',
        text: 'კომპანიის პროფილიდან გამომდინარე რეკომენდაციები ჩანს პირველ ეკრანზე.',
        items: ['ციფრული ტრანსფორმაცია', 'ფინანსებზე წვდომა', 'მარკეტინგის სერია']
      },
      {
        title: 'დასწრების სტატუსი',
        text: 'registration, waitlist და follow-up მასალები პირდაპირ card-ში ჩანს.',
        items: ['დარეგისტრირებული', 'ადგილები შეზღუდულია', 'ფაილების ჩამოტვირთვა']
      }
    ],
    sideCards: [
      { label: 'დარეგისტრირებული', value: '3', note: 'უახლოესი თვე' },
      { label: 'რეკომენდირებული', value: '6', note: 'სფეროს მიხედვით' }
    ],
    timeline: [{ title: 'Personal feed', copy: 'CRM events და public events უფრო მკაფიოდ გაიყოფა.' }]
  },
  '#crm/user/materials': {
    title: 'სასწავლო მასალა',
    intro: 'ფილტრირებადი ბიბლიოთეკა თემების, ფორმატის და ბოლოს ნახვის მიხედვით.',
    chips: ['PDF', 'Video', 'Checklist', 'Guide'],
    panels: [
      {
        title: 'ბიბლიოთეკა',
        text: 'მარცხნივ კატეგორიები, მარჯვნივ featured resources და recent downloads.',
        items: ['სესხზე წვდომის გზამკვლევი', 'ბიზნეს მოდელის ჩეკლისტი', 'ფინანსური ანალიზის შაბლონი']
      },
      {
        title: 'სწავლის პროგრესი',
        text: 'რომელი მასალებია ნახული, შენახული და გაზიარებული.',
        items: ['შენახული', 'ბოლოს გახსნილი', 'რეკომენდირებული']
      }
    ],
    sideCards: [
      { label: 'გახსნილი მასალა', value: '18', note: 'ბოლო 30 დღეში' },
      { label: 'შენახული', value: '7', note: 'მომდევნო წასაკითხად' }
    ],
    timeline: [{ title: 'Knowledge hub', copy: 'CRM-ში materials გადადის ძველი list view-დან curated hub-ზე.' }]
  },
  '#crm/user/plan-visit': {
    title: 'ვიზიტის დაგეგმვა',
    intro: 'ერთიან გვერდზე ჩანს შეხვედრის მოთხოვნა, ხელმისაწვდომი სლოტები და მოთხოვნის ისტორია.',
    chips: ['On-site', 'Online', 'Regional center'],
    panels: [
      {
        title: 'სლოტების არჩევა',
        text: 'კვირის ხედით თავისუფალი დროები და საკონსულტაციო ტიპები.',
        items: ['რეგიონული ვიზიტი', 'ონლაინ სესია', 'ფინანსური კონსულტაცია']
      },
      {
        title: 'მოთხოვნის brief',
        text: 'meeting goals, attachments და მონაწილეთა რაოდენობა.',
        items: ['მიზანი', 'დოკუმენტები', 'დადასტურება']
      }
    ],
    sideCards: [
      { label: 'უახლოესი თავისუფალი', value: 'მარი 18', note: '10:30' },
      { label: 'ისტორია', value: '11', note: 'წინა მოთხოვნა' }
    ],
    timeline: [{ title: 'Booking flow', copy: 'mock scheduler UI backend-ის გარეშე.' }]
  },
  '#crm/user/changepass': {
    title: 'პაროლის შეცვლა',
    intro: 'უსაფრთხოების სექცია გამოიყოს ცალკე მშვიდ, მაღალი კონტრასტის layout-ში.',
    chips: ['უსაფრთხოება', 'სესია', 'რეკომენდაციები'],
    panels: [
      {
        title: 'პაროლის განახლება',
        text: 'ძველი, ახალი და გამეორება, strength meter-ით.',
        items: ['8+ სიმბოლო', '1 რიცხვი', '1 სპეციალური სიმბოლო']
      },
      {
        title: 'სესიის მართვა',
        text: 'აქტიური მოწყობილობები და ბოლოს შესვლის ისტორია.',
        items: ['Desktop / Chrome', 'Mobile / Safari', 'Logout all']
      }
    ],
    sideCards: [{ label: 'ბოლო განახლება', value: '42 დღე', note: 'რეკომენდებულია განახლება' }],
    timeline: [{ title: 'Security hub', copy: 'შეტყობინებები და პაროლის პოლიტიკა ერთ სექციაში.' }]
  },
  '#crm/central/profile': {
    title: 'ცენტრალური პროფილი',
    intro: 'ცენტრალური ოფისის overview: გუნდი, სერვისის დატვირთვა და მიმდინარე ფოკუსები.',
    chips: ['Overview', 'Operations', 'Service quality'],
    panels: [
      {
        title: 'სამუშაო ოპერაციები',
        text: 'ძველი profile გვერდის ნაცვლად პირველ ეკრანზე ჩანს დატვირთვა, გუნდი და საკვანძო KPI.',
        items: ['რეგიონული ცენტრების სტატუსი', 'დღევანდელი ვიზიტები', 'გამოუყენებელი მოთხოვნები']
      },
      {
        title: 'სერვისის ხარისხი',
        text: 'წითელი ზონა, SLA და უკუკავშირის ქულები.',
        items: ['SLA მონიტორინგი', 'NPS მაჩვენებელი', 'გადადებული საქმეები']
      }
    ],
    sideCards: [
      { label: 'NPS', value: '61', note: 'ბოლო კვარტალი' },
      { label: 'SLA', value: '94%', note: 'დროულად დამუშავებული' }
    ],
    timeline: [{ title: 'Central cockpit', copy: 'overview-first pattern ცენტრალური როლისთვის.' }]
  },
  '#crm/central/employees': {
    title: 'თანამშრომლები',
    intro: 'ადამიანების მართვა roster, workload და availability view-ებით.',
    chips: ['აქტიური', 'შვებულება', 'რეგიონი', 'უნარები'],
    panels: [
      {
        title: 'გუნდის roster',
        text: 'პიროვნული ბარათები, სტატუსი და მიმდინარე საქმეების რაოდენობა.',
        items: ['კონსულტანტები', 'ოპერაციული გუნდი', 'რეგიონული კოორდინატორები']
      },
      {
        title: 'გადანაწილება',
        text: 'workload balancing და სწრაფი assign მოქმედებები.',
        items: ['Task load', 'Availability', 'Role permissions']
      }
    ],
    sideCards: [
      { label: 'აქტიური თანამშრომელი', value: '42', note: 'სისტემაში' },
      { label: 'გადატვირთული', value: '6', note: 'საჭირო გადანაწილება' }
    ],
    timeline: [{ title: 'People ops', copy: 'table-only ხედის ნაცვლად card + roster მიდგომა.' }]
  },
  '#crm/central/companies': {
    title: 'კომპანიები',
    intro: 'ბაზის ცენტრალური მართვა სექტორის, რეგიონისა და აქტივობის ჭრილში.',
    chips: ['ყველა', 'მაღალი პრიორიტეტი', 'რეგიონები', 'სტატუსები'],
    panels: [
      {
        title: 'კომპანიების კატალოგი',
        text: 'sector badges, stage, assigned consultant და ბოლო აქტივობა.',
        items: ['აგრო', 'ტურიზმი', 'მცირე წარმოება']
      },
      {
        title: 'სწრაფი სეგმენტაცია',
        text: 'saved filters და bulk მოქმედებების ადგილი.',
        items: ['რეგიონი', 'სერვისის ინტერესი', 'ჩართულობის დონე']
      }
    ],
    sideCards: [
      { label: 'სულ კომპანია', value: '248', note: 'აქტიური ბაზა' },
      { label: 'ახალი კვირაში', value: '17', note: 'ახალი დამატებული' }
    ],
    timeline: [{ title: 'Portfolio view', copy: 'companies section გახდეს CRM-ის ძირითადი სამუშაო feed.' }]
  },
  '#crm/central/reports': {
    title: 'რეპორტები',
    intro: 'report builder, KPI მოდულები და რეგიონული შედეგების სწრაფი შედარება.',
    chips: ['კვირა', 'თვე', 'რეგიონი', 'ტიპი'],
    panels: [
      {
        title: 'ძირითადი მაჩვენებლები',
        text: 'dashboard widgets და export-ready snapshots.',
        items: ['ახალი კომპანია', 'დასრულებული კონსულტაცია', 'მიმდინარე პროგრამები']
      },
      {
        title: 'შედარებითი ხედები',
        text: 'region-to-region და employee-to-employee cut-ები.',
        items: ['რეგიონები', 'თანამშრომლები', 'სერვისები']
      }
    ],
    sideCards: [
      { label: 'ცოცხალი widget', value: '9', note: 'dashboard modules' },
      { label: 'Export ტიპი', value: '4', note: 'PDF / XLS / CSV / PNG' }
    ],
    timeline: [{ title: 'Insight-first reporting', copy: 'ძველი სტატიკური report view-ის ნაცვლად modular cards.' }]
  },
  '#crm/central/calendar': {
    title: 'ცენტრალური კალენდარი',
    intro: 'გუნდის და რეგიონების აქტივობები ერთ master calendar-ზე.',
    chips: ['გუნდი', 'რეგიონი', 'ღონისძიება', 'ვიზიტი'],
    panels: [
      {
        title: 'Master schedule',
        text: 'timeline + day agenda composition ცენტრალური ხედისთვის.',
        items: ['რეგიონული ვიზიტები', 'შიდა შეხვედრები', 'ღონისძიებები']
      },
      {
        title: 'დამატებითი ფილტრები',
        text: 'single employee, region და department cut-ები.',
        items: ['ფილტრი თანამშრომელზე', 'ფილტრი რეგიონზე', 'conflict alerts']
      }
    ],
    sideCards: [{ label: 'დღევანდელი ჩანაწერი', value: '27', note: 'სულ აქტივობა' }],
    timeline: [{ title: 'Central orchestration', copy: 'კალენდარი CRM-ის ოპერაციულ backbone-ად.' }]
  },
  '#crm/central/materials': {
    title: 'მასალები',
    intro: 'შიდა და გარე მასალების ცენტრალური ბიბლიოთეკა version control ნიშნებით.',
    chips: ['Internal', 'Public', 'Draft', 'Published'],
    panels: [
      {
        title: 'კონტენტის პულტი',
        text: 'მასალების მდგომარეობა, პასუხისმგებელი და განახლების თარიღები.',
        items: ['დრაფტი', 'დასამტკიცებელი', 'გამოქვეყნებული']
      },
      {
        title: 'სწრაფი ატვირთვა',
        text: 'drag-and-drop, tags და CRM როლებზე გავრცელება.',
        items: ['upload panel', 'tag editor', 'visibility rules']
      }
    ],
    sideCards: [{ label: 'აქტიური მასალა', value: '86', note: 'ბიბლიოთეკაში' }],
    timeline: [{ title: 'Content operations', copy: 'მასალები იყოს არა უბრალოდ list, არამედ managed library.' }]
  },
  '#crm/central/events': {
    title: 'ცენტრალური ღონისძიებები',
    intro: 'ღონისძიებების დაგეგმვა, რეგისტრაციის მონიტორინგი და რესურსების კონტროლი.',
    chips: ['Planning', 'Registration', 'Follow-up'],
    panels: [
      {
        title: 'ღონისძიებების pipeline',
        text: 'draft, announced, full and completed მდგომარეობები.',
        items: ['ახალი ღონისძიება', 'რეგისტრაციის სტატუსი', 'მოსაწვევები']
      },
      {
        title: 'შემდგომი ნაბიჯები',
        text: 'feedback, მასალები და შედეგები event-ის შემდეგ.',
        items: ['feedback collection', 'materials dispatch', 'attendance reports']
      }
    ],
    sideCards: [{ label: 'მიმდინარე', value: '8', note: 'ამ თვეში' }],
    timeline: [{ title: 'Event ops hub', copy: 'Laravel new-event flow-ის modern dashboard ინტერპრეტაცია.' }]
  },
  '#crm/central/messages': {
    title: 'ცენტრალური შეტყობინებები',
    intro: 'მომხმარებლებისგან შემოსული მოთხოვნები და შიდა კომუნიკაცია ერთიან message hub-ში.',
    chips: ['Unread', 'Flagged', 'Resolved'],
    panels: [
      {
        title: 'შემოსული ნაკადი',
        text: 'პირველ რიგში ჩანს unresolved და overdue თემები.',
        items: ['ახალი მოთხოვნები', 'გადაცემული საქმეები', 'urgent ნიშნები']
      },
      {
        title: 'შიდა კოლაბორაცია',
        text: 'notes, mentions და internal handoff workflow.',
        items: ['შიდა კომენტარი', 'assign to', 'status change']
      }
    ],
    sideCards: [{ label: 'Unread', value: '19', note: 'ცენტრალურ ინბოქსში' }],
    timeline: [{ title: 'Message triage', copy: 'ოპერატიული მხარდაჭერისთვის სწრაფი სორტირება.' }]
  },
  '#crm/central/diagnostic': {
    title: 'ცენტრალური დიაგნოსტიკა',
    intro: 'დიაგნოსტიკის aggregate results და insights რეგიონულად და სექტორებად.',
    chips: ['Scores', 'Trends', 'Risk'],
    panels: [
      {
        title: 'ტენდენციები',
        text: 'რომელ სექტორებში ჩნდება მეტი საჭიროება და რომელი პროგრამებია შესაფერისი.',
        items: ['აგრო', 'ტურიზმი', 'წარმოება']
      },
      {
        title: 'შედეგების რუკა',
        text: 'heatmap და alert widgets მაღალი რისკის ჯგუფებისთვის.',
        items: ['რეგიონები', 'სექტორები', 'რისკის დონე']
      }
    ],
    sideCards: [{ label: 'საშუალო ქულა', value: '73', note: 'ყველა დიაგნოსტიკა' }],
    timeline: [{ title: 'Analytical layer', copy: 'CRUD-ის ნაცვლად ხედვადი insight section.' }]
  },
  '#crm/central/changepass': {
    title: 'პაროლის შეცვლა',
    intro: 'ცენტრალური ანგარიშისთვის უსაფრთხოების გამოკვეთილი სექცია.',
    chips: ['უსაფრთხოება', 'სესია'],
    panels: [
      {
        title: 'ახალი პაროლი',
        text: 'policy hints და privileged access warning.',
        items: ['8+ სიმბოლო', 'multi-role უსაფრთხოება', 'session reset']
      },
      {
        title: 'მოწყობილობები',
        text: 'აქტიური სესიები, ბოლო შესვლა და revoke all მოქმედება.',
        items: ['Desktop', 'Mobile', 'Admin session']
      }
    ],
    sideCards: [{ label: 'ბოლო შესვლა', value: '09:42', note: 'თბილისი' }],
    timeline: [{ title: 'Secure defaults', copy: 'პრივილეგირებულ user-სთვის ოდნავ უფრო მკაცრი ვიზუალი.' }]
  },
  '#crm/bank/profile': {
    title: 'ფინანსური ინსტიტუტის პროფილი',
    intro: 'Laravel bank profile view აქ გარდაიქმნა ერთ ცხად, ორ-სვეტიან profile workspace-ად.',
    chips: ['ინსტიტუტი', 'საკონტაქტო პირი', 'არხები'],
    panels: [
      {
        title: 'ინსტიტუტის იდენტობა',
        text: 'კომპანიის დასახელება, პოზიცია, საკონტაქტო ინფორმაცია და პასუხისმგებელი პირი.',
        items: ['ორგანიზაციის სახელი', 'საკონტაქტო პირი', 'პოზიცია']
      },
      {
        title: 'საკომუნიკაციო არხები',
        text: 'ტელეფონი, ელფოსტა და profile completeness ცალკე მონიტორინგით.',
        items: ['+995 ნომერი', 'ელ. ფოსტა', 'service response rules']
      }
    ],
    sideCards: [
      { label: 'პროფილის სტატუსი', value: '92%', note: '1 ველი დარჩენილია' },
      { label: 'პასუხისმგებელი პირი', value: '1', note: 'აქტიური კონტაქტი' }
    ],
    timeline: [{ title: 'Profile-first bank view', copy: 'ძველი tab-ის ნაცვლად single focus account screen.' }]
  }
}
