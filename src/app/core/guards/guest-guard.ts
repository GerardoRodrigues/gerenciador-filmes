import { CanActivateFn, GuardResult, MaybeAsync, Router } from '@angular/router';
import { UserTokenStore } from '../services/user-token-store/user-token-store';
import { inject } from '@angular/core';

export const guestGuard: CanActivateFn = (route, state): MaybeAsync<GuardResult> => {
  const _userTokenStore = inject(UserTokenStore);
  const _router = inject(Router);

  const HAS_TOKEN = _userTokenStore.hasToken();

  const exploreRoute = _router.createUrlTree(['/']);

  if (HAS_TOKEN) return exploreRoute;

  return true;
};
