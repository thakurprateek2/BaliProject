// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mapbox:{
    accessToken: "pk.eyJ1IjoidGhha3VycHJhdGVlayIsImEiOiJjaXF1bG4xdzgwMDVpMDlqNmkzd3pxZmF2In0.PokcK8U_vHGgeJ0m1rdAhA"
  },
  firebaseConfig :{
    apiKey: "AIzaSyAIY0Me_b2cM6pNWOpNKhhohFVvQywEAYg",
    authDomain: "baliproject-ab5e2.firebaseapp.com",
    databaseURL: "https://baliproject-ab5e2.firebaseio.com",
    projectId: "baliproject-ab5e2",
    storageBucket: "baliproject-ab5e2.appspot.com",
    messagingSenderId: "796427477463"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
