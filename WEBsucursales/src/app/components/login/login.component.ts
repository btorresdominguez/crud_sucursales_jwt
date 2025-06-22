import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [NzFormModule, ReactiveFormsModule]
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private msg: NzMessageService
  ) {
    this.form = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.msg.error('Faltan campos obligatorios');
      return;
    }
    const { username, password } = this.form.value;
  this.auth.login(username, password).subscribe({
  next: () => {
    this.msg.success('Login exitoso');
    this.router.navigate(['/sucursales']);
  },
  error: (err) => {
    console.error('Error en el login:', err);
    this.msg.error('Usuario o contraseña inválidos'); // O un mensaje más específico según el error
  }
});
  }
}