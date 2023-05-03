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

  logInEmail() {
    this.supabase.signInEmail(this.email)
  }
}
