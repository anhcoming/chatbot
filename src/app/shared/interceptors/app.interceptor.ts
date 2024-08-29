import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
//import { AuthService } from 'app/services/auth.service';
import { Router, RouterStateSnapshot } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  constructor(
    private injector: Injector, 
    private authService: AuthService, 
    private router : Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    //const authService = this.injector.get(AuthService);
        const router = this.injector.get(Router);
        const token = this.authService.getAccessToken() || '';
        
        const reqHeader = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        return next.handle(reqHeader).pipe(
          map((res: any) => {
            return res;
          }),
          catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {

              if (this.router.url != '/auth/login') {
                this.authService.clearStoreData();
                this.router.navigate(['/auth/login'], {queryParams: {returnUrl: this.router.url}});
              }
            }

            const error = err.message || err.statusText;

            return throwError(error);
          }),
        );
  }
}
