export const environment = {
  production: true,
  domain: 'skillschecker.mt',
  api: {
    //host: 'https://skillscheck.citoproject.eu',
    //host: 'https://34.254.132.188',
    host: 'https://www.skillschecker.mt',
    port: '',
    path: '/api/',
  },
  readspeaker: {
    enabled: true,
    id: 12420,
    lang: 'en_uk',
    voice: 'Hugh',
    baseurl: '//app-eu.readspeaker.com/cgi-bin/rsent'
  },
  analytics: {
    google: {
      id: 'UA-170127374-1'
    }
  },
  download: {
    level: true
  },
  product: 'nala-mt',
  locale: 'mt',
  regions: [
    'Online',
    'Malta',
    'Gozo'
  ],
  regions_orig: [
    'Online',
    'Birkirkara',
    'Blata l-Bajda Adult Learning Centre',
    'Floriana',
    'Għajnsielem (Gozo)',
    'Ħal Far',
    'Mosta',
    'Paola',
    'Qormi',
    'Qormi Local Council',
    'Tarxien Adult Learning Centre',
    'Valletta',
    'Żebbuġ'
  ]
};
