import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

class MockRouter {
  navigateSpy = jasmine.createSpy('navigate');
  navigate(commands: any[]) {
    this.navigateSpy(commands);
  }
}

class MockAuthService {
  private _loggedIn = false;
  loginState = this._loggedIn;

  isLoggedIn(): boolean {
    return this._loggedIn;
  }

  setLoggedIn(value: boolean) {
    this._loggedIn = value;
  }
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: MockAuthService;
  let router: MockRouter;

  // dummy snapshots
  const fakeRoute = {} as ActivatedRouteSnapshot;
  const fakeState = { url: '/test' } as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router,      useClass: MockRouter }
      ]
    });

    guard       = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as any;
    router      = TestBed.inject(Router)      as any;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation when user is logged in', () => {
    authService.setLoggedIn(true);
    const can = guard.canActivate();
    expect(can).toBeTrue();
    expect(router.navigateSpy).not.toHaveBeenCalled();
  });

  it('should block activation and redirect to /login when not logged in', () => {
    authService.setLoggedIn(false);
    const can = guard.canActivate();
    expect(can).toBeFalse();
    expect(router.navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
