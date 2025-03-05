import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './app/services/interceptor/http-token.interceptor';

bootstrapApplication(AppComponent,appConfig)
  .catch((err) => console.error(err));
