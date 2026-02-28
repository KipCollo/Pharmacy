import {Routes} from "@angular/router";

import {AdminCustomersComponent} from "./admin-customers/admin-customers.component";
import {AdminOrdersComponent} from "./admin-orders/admin-orders.component";
import {MedicineComponent} from "./medicine/medicine.component";
import {AdminMedicineComponent} from "./admin-medicine/admin-medicine.component";
import {AdminInventoryComponent} from "./admin-inventory/admin-inventory.component";
import {AdminCategoryComponent} from "./admin-medicine/admin-category/admin-category.component";
import {AdminPrescriptionsComponent} from "./admin-prescriptions/admin-prescriptions.component";
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";
import {SettingsComponent} from "./settings/settings.component";
import {HelpComponent} from "./help/help.component";
import {NotificationComponent} from "./notification/notification.component";
import {PaymentComponent} from "./payment/payment.component";

export const ADMIN_ROUTES: Routes = [
  { path: '',redirectTo: 'dashboard', pathMatch: 'full'},
  { path: 'dashboard', component: AdminDashboardComponent },
  // Customers routes
  { path: 'customers', component: AdminCustomersComponent },
  { path: 'admin-orders', component: AdminOrdersComponent },
  // Inventory routes
  { path: 'inventory', component: AdminInventoryComponent},
  // Products routes
  { path: 'medicine', component: AdminMedicineComponent },
  { path: 'medicine/add', component: MedicineComponent },
  { path: 'medicine/expired', component: MedicineComponent },
  { path: 'medicine/out-of-stock', component: MedicineComponent },
  { path: 'medicine/categories', component: AdminCategoryComponent},
  // Prescriptions routes
  { path: 'prescriptions', component: AdminPrescriptionsComponent },
  // { path: 'prescriptions/:id', component: AdminPrescriptionReviewComponent },
  //  Reports routes
  { path: 'reports', loadChildren: () => import('./reports/reports.routes').then(c => c.REPORTS_ROUTES) },
  { path: 'help', component: HelpComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'notifications', component: NotificationComponent },
  { path: 'payments', component: PaymentComponent }

]
