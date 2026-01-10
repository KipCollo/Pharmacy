import { Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { RegisterComponent } from "./register/register.component";
import { ActivateAccountComponent } from "./activate-account/activate-account.component";
import { MedicineComponent } from "./medicine/medicine.component";
import { MenuComponent } from "./menu/menu.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { UnauthorizedComponent } from "./unauthorized/unauthorized.component";
import { MedicineListComponent } from './medicine-list/medicine-list.component';
import { MedicineDetailsComponent } from './medicine-details/medicine-details.component';
import { AdminComponent } from './admin/admin-panel/admin-panel.component';
import { DoctorComponent } from './doctor/doctor.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from './auth.guard';
import { CartReportsComponent } from "./cart-reports/cart-reports.component";
import { AboutComponent } from "./about/about.component";
import { ContactComponent } from "./contact/contact.component";
import { CartComponent } from "./cart/cart.component";
import { PrescriptionUploadComponent } from "./prescription-upload/prescription-upload.component";
import { OrderTrackingComponent } from "./admin/order-tracking/order-tracking.component";
import { AdminOrdersComponent } from "./admin/admin-orders/admin-orders.component";
import { ProfileComponent } from "./profile/profile.component";
import { ProductsComponent } from "./products/products.component";
import { AdminCustomersComponent } from "./admin/admin-customers/admin-customers.component";
import { ReportsComponent } from "./admin/reports/reports.component";
import { CustomersReportComponent } from "./admin/customers-report/customers-report.component";
import { OrdersReportComponent } from "./orders-report/orders-report.component";
import { InventoryComponent } from "./inventory/inventory.component";
import { AdminMedicineComponent } from './admin/admin-medicine/admin-medicine.component';
import { AdminPanelComponent } from './admin/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'activate-account', component: ActivateAccountComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'product', component: MedicineListComponent },
  { path: 'product/:id', component: MedicineDetailsComponent },
  { path: 'order', component: OrderTrackingComponent },
  { path: 'prescriptions', component: PrescriptionUploadComponent },
  { path: 'doctor', component: DoctorComponent, canActivate: [AuthGuard], data: { roles: ['DOCTOR'] } },
  //{path: 'user', component: UserComponent},//canActivate:[AuthGuard],data: { roles: ['USER'] }},
  { path: 'profile', component: ProfileComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'cart', component: CartComponent },
  { path: 'home', component: HomeComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  {
    path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] }, children: [
      { path: 'dashboard', component: AdminPanelComponent },
      { path: 'customers', component: AdminCustomersComponent },
      { path: 'reports', component: OrdersReportComponent },
      { path: 'inventory', component: InventoryComponent },
      // Products routes
      { path: 'medicine', component: AdminMedicineComponent },
      { path: 'medicine/add', component: MedicineComponent },
      { path: 'medicine/expired', component: MedicineComponent },
      { path: 'medicine/out-of-stock', component: MedicineComponent },
      // Other reports
      { path: 'orders-report', component: OrdersReportComponent },
      { path: 'cart-reports', component: CartReportsComponent },
      { path: 'customers-report', component: CustomersReportComponent },
      { path: 'admin-orders', component: AdminOrdersComponent },
    ]
  },

  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }

]
