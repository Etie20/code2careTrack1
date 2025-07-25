import {Component, inject, signal} from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ArrowLeft, ArrowRight, Eye, EyeOff, Heart, LockIcon, LucideAngularModule, Mail, User} from 'lucide-angular';
import {TokenService} from '../../services/token/token-service';

@Component({
  selector: 'app-login',
  imports: [
    LucideAngularModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  standalone: true,
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  loading = signal(false);
  error = signal('');
  showPassword = signal(false);

  constructor(private router: Router, private fb: FormBuilder, private authService : AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if(this.loginForm.valid) {
      this.loading.set(true);
      this.authService.login(this.loginForm.value).subscribe({
      complete: () => {
        this.loading.set(false);
        this.router.navigate(['/home']).then();
      }
    ,
      error: (err)=> {
        document.dispatchEvent(new CustomEvent('basecoat:toast', {
          detail: {
            config: {
              category: 'error',
              title: 'Error',
              description: err,
              cancel: {
                label: 'Dismiss'
              }
            }
          }
        }))
      }
    })
    } else {
        document.dispatchEvent(new CustomEvent('basecoat:toast', {
          detail: {
            config: {
              category: 'error',
              title: 'Error',
              description: 'Please, fill all the form correctly',
              cancel: {
                label: 'Dismiss'
              }
            }
          }
        }))
    }
  }

  setDefaultAccount() {
    this.loginForm.setValue({
      email: 'foyangjunior02@gmail.com',
      password: 'Fcbarcelone'
    })
  }

  showPasswordToggle() {
    if (this.showPassword()){
      this.showPassword.set(false);
    } else {
      this.showPassword.set(true);
    }
  }

  navigateToLanding() {
    this.router.navigate(['/landing']).then();
  }

  protected readonly ArrowRight = ArrowRight;
  protected readonly ArrowLeft = ArrowLeft;
  protected readonly Heart = Heart;
  protected readonly Mail = Mail;
  protected readonly Lock = Lock;
  protected readonly EyeOff = EyeOff;
  protected readonly LockIcon = LockIcon;
  protected readonly User = User;
  protected readonly Eye = Eye;
}
