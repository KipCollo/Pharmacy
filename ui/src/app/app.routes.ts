import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {RegisterComponent} from "./register/register.component";
import {ActivateAccountComponent} from "./activate-account/activate-account.component";
import {MedicineComponent} from "./medicine/medicine.component";
import {MenuComponent} from "./menu/menu.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {UnauthorizedComponent} from "./unauthorized/unauthorized.component";
import { MedicineListComponent } from './medicine-list/medicine-list.component';
import { MedicineDetailsComponent } from './medicine-details/medicine-details.component';
import { AdminComponent } from './admin/admin.component';
import { DoctorComponent } from './doctor/doctor.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent},
  {path: 'register',component: RegisterComponent},
  {path: 'activate-account',component: ActivateAccountComponent},
  {path: 'medicine-list', component: MedicineListComponent},
  {path: 'medicine-details', component: MedicineDetailsComponent},
  {path:'medicine',component: MedicineComponent},
  {path:'admin', component: AdminComponent, canActivate:[AuthGuard],data: { roles: ['ADMIN'] }},
  {path: 'doctor', component: DoctorComponent,canActivate:[AuthGuard],data: { roles: ['DOCTOR'] }},
  {path: 'user', component: UserComponent,canActivate:[AuthGuard],data: { roles: ['USER'] }},
  {path:'menu', component: MenuComponent},
  {path:'home',component: HomeComponent},
  {path:'unauthorized',component: UnauthorizedComponent},
  {path:'**', component: NotFoundComponent}
]
