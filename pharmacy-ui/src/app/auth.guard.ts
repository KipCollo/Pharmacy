import {inject, Injectable} from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {TokenService} from "./services/token/token.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  router = inject(Router);
  tokenService = inject(TokenService);

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const userRoles: string[] = this.tokenService.getRoles();
    const loggedIn = this.tokenService.isLoggedIn();

    const requiresLogin = route.data['requiresLogin'] as boolean | undefined;
    const requiredRoles = route.data['roles'] as string[] | undefined;

    if (requiresLogin && !loggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    if (requiredRoles && !requiredRoles.some(role => userRoles.includes(role))) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }

}

