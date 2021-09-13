// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import  *  as  keys  from  '../../secret.json';

console.log('keys', keys)
const  firebaseConfigKey: any = (keys as any).default
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: firebaseConfigKey.API_KEY,
    authDomain: firebaseConfigKey.PROJECT_ID_DOMAIN,
    databaseURL: firebaseConfigKey.PROJECT_ID_LINK,
    projectId: firebaseConfigKey.PROJECT_ID,
    storageBucket: firebaseConfigKey.PROJECT_ID_BUCKET,
    messagingSenderId: firebaseConfigKey.SENDER_ID,
    appId: firebaseConfigKey.APP_ID,
    measurementId: firebaseConfigKey.G_MEASUREMENT_ID
  }
};
console.log('firebaseConfig', environment.firebaseConfig)
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
