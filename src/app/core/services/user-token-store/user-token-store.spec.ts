import { TestBed } from '@angular/core/testing';

import { UserTokenStore } from './user-token-store';

describe('UserTokenStore', () => {
  let service: UserTokenStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTokenStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
