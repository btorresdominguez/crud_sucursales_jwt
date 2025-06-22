// src/app/interceptors/jwt.interceptor.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpHandler, HttpRequest } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

describe('JwtInterceptor', () => {
  let interceptor: JwtInterceptor;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        JwtInterceptor,
        { provide: AuthService, useValue: spy }
      ]
    });

    interceptor = TestBed.inject(JwtInterceptor);
    authServiceMock = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header when token exists', () => {
    authServiceMock.getToken.and.returnValue('ABC123');
    const req = new HttpRequest('GET', '/test');

    const handler: HttpHandler = {
      handle: (r) => {
        expect(r.headers.get('Authorization')).toBe('Bearer ABC123');
        return new Observable();
      }
    };

    interceptor.intercept(req, handler).subscribe();
  });

  it('should NOT add Authorization header when token does not exist', () => {
    authServiceMock.getToken.and.returnValue(null);
    const req = new HttpRequest('GET', '/test');

    const handler: HttpHandler = {
      handle: (r) => {
        expect(r.headers.has('Authorization')).toBeFalse();
        return new Observable();
      }
    };

    interceptor.intercept(req, handler).subscribe();
  });
});
