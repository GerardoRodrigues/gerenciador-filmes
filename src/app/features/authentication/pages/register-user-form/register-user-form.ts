import { Component, computed, inject, signal } from '@angular/core';
import { UserApi } from '../../../../core/services/user-api/user-api';
import { Router } from '@angular/router';
import { IRegisterParams } from '../../models/register-params';
import { email, form, minLength, required, Field } from '@angular/forms/signals';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { setErrorMessage } from '../../../../shared/utils/set-error-message';
import { confirmPassword } from '../../validators/confirm-password';

@Component({
  selector: 'app-register-user-form',
  imports: [Field],
  templateUrl: './register-user-form.html',
  styleUrl: './register-user-form.css',
})
export class RegisterUserForm {
  private readonly _userApi = inject(UserApi);
  private readonly _router = inject(Router);

  registerModel = signal<IRegisterParams>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  registerForm = form(this.registerModel, (fieldPath) => {
    required(fieldPath.name, { message: 'O Nome é obrigatório' });
    minLength(fieldPath.name, 5, { message: 'O Nome precisa ter pelo menos 5 caracteres' });

    required(fieldPath.email, { message: 'O E-mail é obrigatório' });
    email(fieldPath.email, { message: 'E-mail inválido' });

    required(fieldPath.password, { message: 'O campo Senha é obrigatório' });
    minLength(fieldPath.password, 8, { message: 'A Senha precisa ter pelo menos 8 caracteres' });

    confirmPassword(fieldPath.confirmPassword, fieldPath.password);
  });

  registerParams = signal<IRegisterParams | undefined>(undefined);

  registerResource = rxResource({
    params: () => this.registerParams(),
    stream: ({ params }) =>
      this._userApi.register(params.name, params.email, params.password).pipe(
        tap(() => {
          setTimeout(() => this._router.navigate(['/login']), 700);
        }),
      ),
  });

  registerError = computed(() => setErrorMessage(this.registerResource.error()));

  registerSuccess = computed(() => {
    const USER_REGISTRATION = this.registerResource.hasValue();

    return USER_REGISTRATION ? 'Usuário cadastrado com sucesso!' : undefined;
  });

  register() {
    const userInfos = this.registerForm().value();

    this.registerParams.set(userInfos);
  }
}
