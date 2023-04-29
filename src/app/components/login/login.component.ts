import { Component } from '@angular/core';
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
    this.supabase.login(this.email, this.password).subscribe(res => {
      console.log("Logged in successfully")
      this.router.navigate(["shop"])
    })
  }
}
