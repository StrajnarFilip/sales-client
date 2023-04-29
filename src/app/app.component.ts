import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sales-client';

  constructor(public supabase: SupabaseService, private router: Router) { }

  logOut() {
    this.supabase.logOut()
  }
}
