import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUserTokenSuccessAuthResponse } from '../../../shared/models/user-token-success-auth-response';
import { UserTokenStore } from '../user-token-store/user-token-store';
import { tap } from 'rxjs';
import { IUserLoginSuccessResponse } from '../../../shared/models/user-login-success-response';
import { IUserRegisterSuccessResponse } from '../../../shared/models/user-register-success-response';
import { UserInfosStore } from '../user-infos-store/user-infos-store';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  private readonly _httpClient = inject(HttpClient);
  private readonly _userTokenStore = inject(UserTokenStore);
  private readonly _userInfosStore = inject(UserInfosStore);

  private readonly URL = environment.baseUrl;

  validateToken() {
    return this._httpClient.get<IUserTokenSuccessAuthResponse>(`${this.URL}/users/validate-token`);
  }

  login(email: string, password: string) {
    return this._httpClient
      .post<IUserLoginSuccessResponse>(`${this.URL}/users/login`, {
        email,
        password,
      })
      .pipe(
        tap(({ user }) => this._userInfosStore.setUserInfos(user)),
        tap((response) => this._userTokenStore.saveToken(response.token)),
      );
  }

  register(name: string, email: string, password: string) {
    return this._httpClient.post<IUserRegisterSuccessResponse>(`${this.URL}/users`, {
      name,
      email,
      password,
    });
  }
}
