import { Component, computed, inject, signal } from '@angular/core';
import { email, form, minLength, required, Field } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { UserApi } from '../../../../core/services/user-api/user-api';
import { rxResource } from '@angular/core/rxjs-interop';
import { ILoginParams } from '../../models/login-params';
import { tap } from 'rxjs';
import { setErrorMessage } from '../../../../shared/utils/set-error-message';

@Component({
  selector: 'app-login-form',
  imports: [Field],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private readonly _userApi = inject(UserApi);
  private readonly _router = inject(Router);

  loginModel = signal<ILoginParams>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (fieldPath) => {
    required(fieldPath.email, { message: 'O campo E-mail é obrigatório' });
    email(fieldPath.email, { message: 'E-mail inválido' });

    required(fieldPath.password, { message: 'O campo Senha é obrigatório' });
    minLength(fieldPath.password, 8, { message: 'A senha precisa ter pelo menos 8 caracteres' });
  });

  loginParams = signal<ILoginParams | undefined>(undefined);

  loginError = computed(() => setErrorMessage(this.loginResource.error()));

  loginResource = rxResource({
    params: () => this.loginParams(),
    stream: ({ params }) =>
      this._userApi
        .login(params.email, params.password)
        .pipe(tap(() => this._router.navigate(['/explore']))),
  });

  login() {
    const credentials = this.loginForm().value();

    this.loginParams.set(credentials);
  }
}
