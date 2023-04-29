import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, AuthResponse } from '@supabase/supabase-js'
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabase = createClient("https://tgiowkibbduosdckdeiv.supabase.co",
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnaW93a2liYmR1b3NkY2tkZWl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI3OTQ4MzYsImV4cCI6MTk5ODM3MDgzNn0.7_oWgKrJRBL_P7gKQf3Em6Dc8QxyURamkMnSqesSvj8')
  loggedIn = false

  constructor(private router: Router) {
    this.supabase.auth.getUser().then(user => {
      this.loggedIn = user.data.user !== null
    })
  }

  signUp(email: string, password: string): Observable<AuthResponse> {
    return new Observable((sub) => {
      this.supabase.auth.signUp({
        email: email,
        password: password,
      }).then((response) => { sub.next(response) })
    })
  }

  signIn(email: string, password: string) {
    return new Observable((sub) => {
      this.supabase.auth.signInWithPassword({
        email: email,
        password: password,
      }).then((response) => {
        if (response.error === null) {
          this.loggedIn = true
          sub.next(response)
        }
      })
    })
  }

  signInEmail(email: string) {
    this.supabase.auth.signInWithOtp({ email: email }).then(response => {
      console.log("Look in your email")
    })
  }

  listItems() {
    return new Observable((sub) => {
      this.supabase.from("items").select("*").then(res =>
        sub.next(res.data))
    })
  }

  logOut() {
    this.supabase.auth.signOut().then(response => {
      if (response.error === null) {
        this.router.navigate(["login"])
        this.loggedIn = false
      }
    })
  }

  itemsWithLatestPrices(): Observable<any> {
    return new Observable((sub) => {
      this.supabase
        .rpc('latest_item_prices').then(({ data, error }) => {
          console.log(data, error)
          if (error === null)
            sub.next(data)
        })
    })
  }
}
