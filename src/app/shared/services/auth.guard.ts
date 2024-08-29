import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const authorized = this.authService.getAccessToken();

      this.authService.setUrlRedirect(state.url || '/');

      if (authorized) {
        return Promise.resolve(true);
      }

      this.router.navigate(['/auth/login'], {queryParams: {returnUrl: state.url}});
      this.authService.clearStoreData();
      
      return Promise.resolve(true);
  }
}
