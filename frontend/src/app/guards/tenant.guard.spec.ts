import { TestBed } from '@angular/core/testing';

import { TenantGuard } from './tenant.guard';

describe('TenantGuard', () => {
  let guard: TenantGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TenantGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
