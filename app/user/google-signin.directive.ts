import { Directive, HostListener } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

@Directive({
  selector: '[appGoogleSignin]',
})
export class GoogleSigninDirective {
  constructor(private auth: Auth) {}

  @HostListener('click') onClick() {
    signInWithPopup(this.auth, new GoogleAuthProvider());
  }
}
