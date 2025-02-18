import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    const userRoles = JSON.parse(localStorage.getItem('roles') || '[]');

    // If user is not logged in, redirect to login page
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check if the user has the required role for this route
    const requiredRoles = route.data['roles'] as string[];
    if (requiredRoles && !userRoles.some((role: string) => requiredRoles.includes(role))) {
      this.router.navigate(['/home']); // Redirect unauthorized users
      return false;
    }

    return true;
  }
}
