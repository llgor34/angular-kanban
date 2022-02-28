import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth, authState, signOut, User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  user: User | null = null;

  constructor(public auth: Auth) {}

  ngOnInit(): void {
    this.authSub = authState(this.auth).subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  signOut() {
    signOut(this.auth);
  }
}
