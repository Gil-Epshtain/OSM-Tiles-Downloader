// // Angular
// import { NgModule }             from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';

// // Application Pages
// import { MainComponent }        from './components/main/main.component';

// const routes: Routes =
// [
//   // { 
//   //   path: 'detail/:id', // url with parameter
//   //   component: xComponent 
//   // },
//   { 
//     path: '', // Default path [/main]
//     redirectTo: 'main', 
//     pathMatch: 'full'
//   },
//   {
//     path: 'main', 
//     component: MainComponent,
//   }
// ];
  
// @NgModule({
//   imports: 
//   [
//     RouterModule.forRoot(routes)
//   ],
//   exports: 
//   [ 
//     /* 
//       exporting RouterModule makes router directives available
//       for use in the AppModule components that will need them
//     */
//     RouterModule 
//   ]
// })
// export class AppRoutingModule
// {
//   public constructor()
//   {
//     console.log("App-Router.module - ctor");
//   }
// }