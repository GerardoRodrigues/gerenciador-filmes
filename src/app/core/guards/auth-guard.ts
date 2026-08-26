import { inject } from '@angular/core';
import { CanActivateFn, GuardResult, MaybeAsync, Router } from '@angular/router';
import { UserTokenStore } from '../services/user-token-store/user-token-store';
import { UserApi } from '../services/user-api/user-api';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state): MaybeAsync<GuardResult> => {
  const _userTokenStore = inject(UserTokenStore);
  const _userApi = inject(UserApi);
  const _router = inject(Router);

  const HAS_TOKEN = _userTokenStore.hasToken();

  const loginRoute = _router.createUrlTree(['/auth/login']);

  if (!HAS_TOKEN) return loginRoute;

  return _userApi.validateToken().pipe(
    map(() => true),
    catchError(() => {
      _userTokenStore.removeToken();
      return of(loginRoute);
    }),
  );
};
