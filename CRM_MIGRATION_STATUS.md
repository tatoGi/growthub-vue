# GrowthHub CRM Migration Status

## მიზანი

Laravel CRM-ის ძველი Blade ინტერფეისის თანამედროვე Vue UI flow-ად გადატანა ცალკე CRM namespace-ით.

პირველი ეტაპი:

- ცალკე ვიზუალური სივრცე `#crm` route-ებით
- `user / central / bank` როლების გაყოფა
- shared shell, გვერდითი მენიუ და თანამედროვე dashboard pattern

## მნიშვნელოვანი შენიშვნა

Laravel პროექტში არაფერს ვცვლით.

read-only reference:

- `C:\Users\pc\Desktop\workspace\work\growthhub`

## Source references

- `resources/views/website/crm/navigations.blade.php`
- `resources/views/website/crm/business.blade.php`
- `resources/views/website/crm/banks/banks.blade.php`
- `resources/views/website/crm/central/nav.blade.php`
- `resources/views/website/crm/central/*`

## უკვე დაწყებული CRM routes

- `#crm`
- `#crm/user/business`
- `#crm/user/messages`
- `#crm/user/calendar`
- `#crm/user/diagnostic`
- `#crm/user/events`
- `#crm/user/materials`
- `#crm/user/plan-visit`
- `#crm/user/changepass`
- `#crm/central/profile`
- `#crm/central/employees`
- `#crm/central/companies`
- `#crm/central/reports`
- `#crm/central/calendar`
- `#crm/central/materials`
- `#crm/central/events`
- `#crm/central/messages`
- `#crm/central/diagnostic`
- `#crm/central/changepass`
- `#crm/bank/profile`

## მიმდინარე სტატუსი

- shared CRM shell გაკეთებულია
- role switch გაკეთებულია
- business, central და bank ძირითადი ვიზუალური დაშლა გაკეთებულია
- ძველი bootstrap/tab სტრუქტურა გადაიწყო თანამედროვე workspace pattern-ზე

## შემდეგი ეტაპი

- თითო page-ზე უფრო ღრმა კომპონენტური დაშლა
- inbox / calendar / reports სპეციფიკური modules
- mock forms და modal flows
- auth/store/API integration-ready არქიტექტურა
