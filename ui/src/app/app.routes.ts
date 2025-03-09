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
import {AdminPanelComponent} from "./admin-panel/admin-panel.component";
import {CartReportsComponent} from "./cart-reports/cart-reports.component";
import {AboutComponent} from "./about/about.component";
import {ContactComponent} from "./contact/contact.component";
import {CartComponent} from "./cart/cart.component";
import {PrescriptionUploadComponent} from "./prescription-upload/prescription-upload.component";
import {OrderTrackingComponent} from "./order-tracking/order-tracking.component";
import {AdminOrdersComponent} from "./admin-orders/admin-orders.component";
import {ProfileComponent} from "./profile/profile.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent},
  {path: 'register',component: RegisterComponent},
  {path: 'activate-account',component: ActivateAccountComponent},
  {path: 'medicine-list', component: MedicineListComponent},
  {path: 'medicine-details', component: MedicineDetailsComponent},
  {path: 'about' ,component: AboutComponent},
  {path: 'contact', component: ContactComponent},
  {path:'medicine',component: MedicineComponent},
  {path: 'order',component:OrderTrackingComponent},
  {path:'admin-order', component: AdminOrdersComponent},
  {path: 'prescriptions',component: PrescriptionUploadComponent},
  {path: 'cart',component: CartComponent},// canActivate: [AuthGuard]},
  {path:'admin', component: AdminComponent},//, canActivate:[AuthGuard],data: { roles: ['ADMIN'] }},
  {path: 'doctor', component: DoctorComponent,canActivate:[AuthGuard],data: { roles: ['DOCTOR'] }},
  {path: 'user', component: UserComponent},//canActivate:[AuthGuard],data: { roles: ['USER'] }},
  {path: 'profile',component: ProfileComponent},
  {path:'menu', component: MenuComponent},
  {path:'home',component: HomeComponent},
  {path:'unauthorized',component: UnauthorizedComponent},
  {path:'adminp',component: AdminPanelComponent},
  { path: 'cart-reports', component: CartReportsComponent },
  {path:'', component: HomeComponent},
  {path:'**', component: NotFoundComponent}

]
