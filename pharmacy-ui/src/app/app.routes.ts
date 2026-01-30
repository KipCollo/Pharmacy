import { Routes } from '@angular/router';

import { RegisterComponent } from "./auth/register/register.component";
import { NotFoundComponent } from "./shared/not-found/not-found.component";
import { UnauthorizedComponent } from "./products/unauthorized/unauthorized.component";
import { AdminComponent } from './admin/admin-panel/admin-panel.component';
import { DoctorComponent } from './doctor/doctor.component';
import { AuthGuard } from './auth.guard';
import { AboutComponent } from "./pages/about/about.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { CartComponent } from "./cart/cart.component";
import { PrescriptionUploadComponent } from "./prescription/prescription-upload/prescription-upload.component";
import { OrderTrackingComponent } from "./admin/order-tracking/order-tracking.component";
import { AdminOrdersComponent } from "./admin/admin-orders/admin-orders.component";
import { AdminCustomersComponent } from "./admin/admin-customers/admin-customers.component";
import { CustomersReportComponent } from "./admin/customers-report/customers-report.component";
import { OrdersReportComponent } from "./admin/orders-report/orders-report.component";
import { AdminMedicineComponent } from './admin/admin-medicine/admin-medicine.component';
import { AdminPanelComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { CartReportsComponent } from './admin/cart-reports/cart-reports.component';
import { MedicineComponent } from './admin/medicine/medicine.component';
import { LoginComponent } from './auth/login/login.component';
import { ActivateAccountComponent } from './auth/activate-account/activate-account.component';
import { MenuComponent } from './chat/menu/menu.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { ProfileComponent } from './user/profile/profile.component';
import {CheckoutComponent} from "./checkout/checkout.component";
import {PrescriptionApprovalComponent} from "./prescription/prescription-approval/prescription-approval";
import {OrdersComponent} from "./orders/orders.component";
import {WishlistComponent} from "./wishlist/wishlist.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'activate-account', component: ActivateAccountComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'product/:productId', component: ProductDetailsComponent },
  { path: 'product', component: ProductListComponent },
  {path: 'checkout', component: CheckoutComponent},
  { path: 'orders', component: OrdersComponent},
  { path: 'order', component: OrderTrackingComponent },
  { path: 'prescriptions', component: PrescriptionUploadComponent },
  { path: 'prescription-approval', component: PrescriptionApprovalComponent},
  { path: 'doctor', component: DoctorComponent, canActivate: [AuthGuard], data: { roles: ['DOCTOR'] } },
  //{path: 'user', component: UserComponent},//canActivate:[AuthGuard],data: { roles: ['USER'] }},
  { path: 'profile', component: ProfileComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'cart', component: CartComponent },
  { path: 'wishlist', component: WishlistComponent},
  { path: 'home', component: HomeComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  {
    path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] }, children: [
      { path: 'dashboard', component: AdminPanelComponent },
      { path: 'customers', component: AdminCustomersComponent },
      { path: 'reports', component: OrdersReportComponent },
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
