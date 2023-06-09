import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from "@angular/common/http";
import { throwError, Observable, BehaviorSubject, of } from "rxjs";
import { catchError, filter, finalize, take, switchMap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AccessIntercepterService implements HttpInterceptor {

  // constructor(private route: Router,
  //   private storageService: StorageService) { }

  // private handleAuthError(err: HttpErrorResponse): Observable<any> {
  //   //handle your auth error or rethrow
  //   if (err.status === 401 || err.status === 403 ) {

  //     this.storageService.logout();
  //     //navigate /delete cookies or whatever
  //     this.route.navigateByUrl(`/home`);
  //     // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
  //     return of(err.message); // or EMPTY may be appropriate here
  //   }
  //   return throwError(() => new Error("access denied"));
  // }

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

  //     // Clone the request to add the new header.
  //     const authReq = req.clone({headers: req.headers.set("Content-Type", "application/json")});
  //     // catch the error, make specific functions for catching specific errors and you can chain through them with more catch operators
  //     return next.handle(authReq).pipe(catchError(x=> this.handleAuthError(x)));
  // }
  private AUTH_HEADER = "Authorization";
  private token = "secrettoken";
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.url.includes('auth')) {
      return next.handle(req);
    }
    console.warn("AuthInterceptor");
    if (!req.headers.has("Content-Type")) {
      req = req.clone({
        headers: req.headers.set("Content-Type", "application/json")
      });
    }

    req = this.addAuthenticationToken(req);

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error && error.status === 401) {
          // 401 errors are most likely going to be because we have an expired token that we need to refresh.
          if (this.refreshTokenInProgress) {
            // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
            // which means the new token is ready and we can retry the request again
            return this.refreshTokenSubject.pipe(
              filter(result => result !== null),
              take(1),
              switchMap(() => next.handle(this.addAuthenticationToken(req)))
            );
          } else {
            this.refreshTokenInProgress = true;

            // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
            this.refreshTokenSubject.next(null);

            return this.refreshAccessToken().pipe(
              switchMap((success: boolean) => {
                this.refreshTokenSubject.next(success);
                return next.handle(this.addAuthenticationToken(req));
              }),
              // When the call to refreshToken completes we reset the refreshTokenInProgress to false
              // for the next time the token needs to be refreshed
              finalize(() => (this.refreshTokenInProgress = false))
            );
          }
        } else {
          return throwError(error);
        }
      })
    );
  }

  private refreshAccessToken(): Observable<any> {
    return of("secret token");
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    // If we do not have a token yet then we should not set the header.
    // Here we could first retrieve the token from where we store it.
    if (!this.token) {
      return request;
    }
    // If you are calling an outside domain then do not add the token.
    if (!request.url.match(/www.mydomain.com\//)) {
      return request;
    }
    return request.clone({
      headers: request.headers.set(this.AUTH_HEADER, "Bearer " + this.token)
    });
  }
}
