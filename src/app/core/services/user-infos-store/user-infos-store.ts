import { computed, Injectable, signal } from '@angular/core';
import { IUserInfos } from '../../../shared/models/user-infos';

@Injectable({
  providedIn: 'root',
})
export class UserInfosStore {
  private readonly USER_NAME_KEY = 'user-name';
  private readonly user = signal<IUserInfos | undefined>(undefined);

  userInfos = this.user.asReadonly();

  userName = computed(() => {
    const HAS_USER = this.user();
    const userNameLocalStorage = localStorage.getItem(this.USER_NAME_KEY);

    if (!HAS_USER) return userNameLocalStorage ? userNameLocalStorage : '';

    return this.user()?.name;
  });

  setUserInfos(userInfos: IUserInfos) {
    this.user.set(userInfos);

    localStorage.setItem(this.USER_NAME_KEY, userInfos.name);
  }

  removeUserName() {
    localStorage.removeItem(this.USER_NAME_KEY);
  }
}
