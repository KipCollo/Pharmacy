import { Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import {RevenueReportComponent} from "./revenue-report/revenue-report.component";
import {ProfitReportComponent} from "./profit-report/profit-report.component";
import {OrdersReportComponent} from "./orders-report/orders-report.component";
import {RefundsReportComponent} from "./refunds-report/refunds-report.component";
import {CustomersReportComponent} from "./customers-report/customers-report.component";
import {CartReportsComponent} from "./cart-reports/cart-reports.component";
import {ForecastReportComponent} from "./forecast-report/forecast-report.component";

export const REPORTS_ROUTES: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      { path: 'revenue', component: RevenueReportComponent },
      { path: 'profit', component: ProfitReportComponent },
      { path: 'orders', component: OrdersReportComponent },
      { path: 'refunds', component: RefundsReportComponent },
      { path: 'carts', component: CartReportsComponent },
      { path: 'customers', component: CustomersReportComponent },
      { path: 'forecast', component: ForecastReportComponent },
      { path: '', redirectTo: 'revenue', pathMatch: 'full' }
    ]
  }
];
