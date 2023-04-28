import { Injectable } from '@angular/core';
import { createClient, AuthResponse } from '@supabase/supabase-js'
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabase = createClient("https://qeosutncecrujnpzwmie.supabase.co",
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlb3N1dG5jZWNydWpucHp3bWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI2ODY1OTQsImV4cCI6MTk5ODI2MjU5NH0.tptmdZiw8fWwwS3NLjucEa094A59uy9XFwervMUreIQ')
  loggedIn = false

  constructor() {
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

  login(email: string, password: string) {
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

  listItems() {
    return new Observable((sub) => {
      this.supabase.from("items").select("*").then(res =>
        sub.next(res.data))
    })
  }
}
