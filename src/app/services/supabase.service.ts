import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, AuthResponse, PostgrestSingleResponse } from '@supabase/supabase-js'
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

  itemDetails(itemId: number): Observable<any> {
    return new Observable((sub) => {
      this.supabase.rpc("item_details", { iid: itemId }).then(({ data, error }) => {
        if (error === null) {
          sub.next(data)
        }
      })
    })
  }

  latestSale(): Observable<any> {
    return new Observable((sub) => {
      this.supabase.auth.getUser().then(user => {
        this.supabase.rpc("ongoing_sale", { user_uuid: user.data.user?.id }).then(response => {
          if (response.error === null) {
            if (response.data.sale_id === null) {
              console.log("Creating new sale")
              this.createNewSale().subscribe(res => {
                this.latestSale().subscribe(latest => {
                  sub.next(latest)
                })
              })
            } else {
              sub.next(response.data)
            }
          }
        })
      })
    })
  }

  createNewSale(): Observable<PostgrestSingleResponse<null>> {
    return new Observable<PostgrestSingleResponse<null>>(sub => {
      this.supabase.auth.getUser().then(user => {
        if (user.data.user) {
          this.supabase.from("sales").insert([{ "user_id": user.data.user.id }]).then(response => {
            sub.next(response)
          })
        }
      })
    })
  }

  addToCart(itemId: number, quantity: number, price: number) {
    return new Observable<PostgrestSingleResponse<null>>(sub => {
      this.latestSale().subscribe(sale => {
        this.supabase.from("item_quantities").insert({ "quantity": quantity, "price": price, "item": itemId, "sale": sale.sale_id })
          .then(res => sub.next(res))
      })
    })
  }

  cartContents() {
    return new Observable<PostgrestSingleResponse<any>>(sub => {
      this.latestSale().subscribe(sale => {
        this.supabase.rpc("sale_items", { "input_sale_items": sale.sale_id }).then(res => {
          if (res.error === null) {
            sub.next(res.data)
          }
        })
      })
    })
  }

  finalizeSale(saleId: number) {
    return new Observable(sub => {
      this.supabase
        .from('sales')
        .update({ sold: true })
        .eq('id', saleId)
        .then(res => {
          sub.next(res)
        })
    })
  }
}
