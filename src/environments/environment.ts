// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  domain: 'localhost',
  api: {
    //host: 'https://skillscheck.citoproject.eu',
    //host: 'https://34.254.132.188',
    host: 'https://www.skillschecker.ie',
    port: '',
    path: '/api/',
  },
  readspeaker: {
    enabled: true,
    id: 12420,
    lang: 'en_uk',
    voice: 'Alice',
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
  product: 'nala',
  locale: 'ie',
  regions: [
    'Online',
    'Carlow',
    'Cavan',
    'Clare',
    'Cork City',
    'Cork County',
    'Donegal',
    'Dublin North',
    'Dublin North County - Fingal',
    'Dublin South',
    'Dublin West County',
    'Dun Laoghaire - Rathdown',
    'Galway',
    'Kerry',
    'Kildare',
    'Kilkenny',
    'Laois',
    'Leitrim',
    'Limerick City',
    'Limerick County',
    'Longford',
    'Louth',
    'Mayo',
    'Meath',
    'Monaghan',
    'Offaly',
    'Roscommon',
    'Sligo',
    'Tipperary',
    'Waterford City',
    'Waterford County',
    'Westmeath',
    'Wexford',
    'Wicklow'
  ]

  //Local dev environment
  //apiHost: 'localhost:3000',
  //apiPort: '3000',
  //apiPath: ''
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
