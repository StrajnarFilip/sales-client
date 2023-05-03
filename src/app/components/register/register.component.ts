import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email: string = ""
  password: string = ""
  checkEmail = false
  constructor(private supabase: SupabaseService) { }

  register() {
    this.supabase.signUp(this.email, this.password).subscribe(res => this.checkEmail = true)
  }

  private containsPassword(): boolean {
    return this.password.length > 0
  }

  private containsEmail(): boolean {
    return this.email.match(/^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/) instanceof Array
  }

  canRegister() {
    return this.containsEmail() && this.containsPassword()
  }
}
