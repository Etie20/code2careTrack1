import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {TokenService} from '../../services/token/token-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  const isAuthRequest =
    req.url.includes('/auth/login') || req.url.includes('/auth/register');

  if (token && !isAuthRequest) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(clonedReq);
  }

  return next(req);
};
