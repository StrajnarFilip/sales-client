import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent {
  cart?: any = []
  constructor(private supabase: SupabaseService) {
    supabase.cartContents().subscribe(cart => {
      console.log(cart, "cart")
      this.cart = cart
    })
  }

  buy() {
    this.supabase.latestSale().subscribe(sale => {
      this.supabase.finalizeSale(sale.sale_id).subscribe(_ => {
        this.supabase.cartContents().subscribe(cart => {
          console.log(cart, "cart")
          this.cart = cart
          this.supabase.cartQuantity().subscribe(newQuantity => {
            this.supabase.quantityEmitter.emit(newQuantity)
          })
        })
      })
    })
  }
}
