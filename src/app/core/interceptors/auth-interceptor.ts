import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserTokenStore } from '../services/user-token-store/user-token-store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const _userToken = inject(UserTokenStore);
  const HAS_TOKEN = _userToken.hasToken();

  if (HAS_TOKEN) {
    const newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${_userToken.getToken()}`,
      },
    });

    return next(newReq);
  }

  return next(req);
};
