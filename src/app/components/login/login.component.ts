import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = ""
  password: string = ""

  constructor(private supabase: SupabaseService, private router: Router) { }

  logIn() {
    this.supabase.signIn(this.email, this.password).subscribe(res => {
      console.log("Logged in successfully")
      this.supabase.statusEmitter.emit(true)
      this.router.navigate(["shop"])
    })
  }

  private containsPassword(): boolean {
    return this.password.length > 0
  }

  private containsEmail(): boolean {
    return this.email.match(/^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/) instanceof Array
  }

  canLogin() {
    return this.containsEmail() && this.containsPassword()
  }

  canEmailLogin() {
    return this.containsEmail()
  }

  logInEmail() {
    this.supabase.signInEmail(this.email)
  }
}
