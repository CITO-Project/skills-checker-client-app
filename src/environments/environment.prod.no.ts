export const environment = {
  production: false,
  api: {
//    host: 'https://skillscheck.citoproject.eu',
//    host: 'https://skillschecker.no',
    host: 'https://34.254.132.188',
    port: '',
    path: '/api/',
  },
  readspeaker: {
    enabled: true,
    id: 12420,
    lang: 'no_nb',
    voice: 'Lykke',
    baseurl: '//app-eu.readspeaker.com/cgi-bin/rsent'
  },
  product: 'nala-no',
  locale: 'no',
  regions: [
    'Online',
    'Agder',
    'Finnmark',
    'Hedmark',
    'Møre og Romsdal',
    'Nordland',
    'Oppland',
    'Oslo',
    'Rogaland',
    'Telemark',
    'Troms',
    'Trøndelag',
    'Vestfold',
    'Vestland',
    'Viken'
  ]
};
