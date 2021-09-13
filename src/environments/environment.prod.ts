import  *  as  keys  from  '../../secret.json';

console.log('keys', keys)
const  firebaseConfigKey: any = (keys as any).default
export const environment = {
  production: true,
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
console.log('production', environment.firebaseConfig)
