import { TestBed } from '@angular/core/testing';

import { UserInfosStore } from '../user-infos-store';

describe('UserInfosStore', () => {
  let service: UserInfosStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserInfosStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
