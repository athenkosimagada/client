import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(!authService.isLoggedIn()){
    router.navigate(["account/login"]);
    return false;
  }
  return true;
};

export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isLoggedIn()){
    router.navigate(["cb/feed"]);
    return false;
  }
  return true;
};
