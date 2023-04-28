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
  constructor(private supabase: SupabaseService) { }

  register() {
    this.supabase.signUp(this.email, this.password).subscribe(res => console.log)
  }
}
