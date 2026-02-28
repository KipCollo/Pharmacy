import { Routes } from '@angular/router';

import { RegisterComponent } from "./auth/register/register.component";
import { NotFoundComponent } from "./shared/not-found/not-found.component";
import { UnauthorizedComponent } from "./unauthorized/unauthorized.component";
import { DoctorComponent } from './doctor/doctor.component';
import { AuthGuard } from './auth.guard';
import { AboutComponent } from "./pages/about/about.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { CartComponent } from "./cart/cart.component";
import { PrescriptionUploadComponent } from "./prescription/prescription-upload/prescription-upload.component";
import { OrderTrackingComponent } from "./admin/order-tracking/order-tracking.component";
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
import {SpecialOffersComponent} from "./pages/home/special-offers/special-offers.component";
import {TrendingComponent} from "./pages/home/trending/trending.component";
import {AdminComponent} from "./admin/admin/admin.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'activate-account', component: ActivateAccountComponent },
  { path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(a => a.AboutComponent)
  },

  { path: 'contact', component: ContactComponent },
  {
  path: 'map',
  loadComponent: () =>
    import('./map/map.component').then(m => m.MapComponent)
},
  { path: 'products/:productId', component: ProductDetailsComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'offers', component: SpecialOffersComponent },
  { path: 'trending', component: TrendingComponent },
  {path: 'checkout', component: CheckoutComponent,canActivate: [AuthGuard], data: { requiresLogin: true } },
  { path: 'orders', component: OrdersComponent},
  { path: 'order', component: OrderTrackingComponent },
  { path: 'prescriptions', component: PrescriptionUploadComponent ,canActivate: [AuthGuard], data: { requiresLogin: true } },
  { path: 'prescription-approval', component: PrescriptionApprovalComponent,canActivate: [AuthGuard], data: { requiresLogin: true } },
  { path: 'doctor', component: DoctorComponent, canActivate: [AuthGuard], data: { roles: ['DOCTOR'] } },
  //{path: 'user', component: UserComponent},//canActivate:[AuthGuard],data: { roles: ['USER'] }},
  { path: 'profile', component: ProfileComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'cart', component: CartComponent },
  { path: 'wishlist', component: WishlistComponent},
  { path: 'home', component: HomeComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () => import('./admin/admin.routes').then(c => c.ADMIN_ROUTES)

  },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }

]
