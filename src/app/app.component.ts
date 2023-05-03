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
  loggedIn = false
  cartQuantity = 0

  constructor(public supabase: SupabaseService) {
    supabase.cartQuantity().subscribe(amount => this.cartQuantity = amount)
    supabase.checkLoggedin().subscribe(res => {
      this.loggedIn = res
    })

    supabase.statusEmitter.subscribe(status => {
      this.loggedIn = status
    })

    supabase.quantityEmitter.subscribe(newQuantity => {
      this.cartQuantity = newQuantity
    })
  }

  logOut() {
    this.supabase.logOut()
    this.supabase.checkLoggedin().subscribe(res => {
      this.loggedIn = res
    })
  }

  changeLogin(status: boolean) {
    this.loggedIn = status
  }
}
