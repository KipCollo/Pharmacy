import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {RegisterComponent} from "./register/register.component";
import {ActivateAccountComponent} from "./activate-account/activate-account.component";
import {MedicineComponent} from "./medicine/medicine.component";
import {MenuComponent} from "./menu/menu.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent},
  {path: 'register',component: RegisterComponent},
  {path: 'activate-account',component: ActivateAccountComponent},
  {path:'medicine',component: MedicineComponent},
  {path:'menu', component: MenuComponent},
  {path:'home',component: HomeComponent}
]
