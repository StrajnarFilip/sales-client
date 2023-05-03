import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent {
  cart?: Array<any> = []
  columns: string[] = ["Image", "Name", "Quantity", "Price each", "Price total", "Remove from cart"]
  totalPrice?: number

  constructor(private supabase: SupabaseService) {
    supabase.cartContents().subscribe(cart => {
      console.log(cart, "cart")
      this.cart = cart
      this.calculateTotal()
    })
  }

  calculateTotal() {
    if (this.cart) {
      this.totalPrice = this.cart.map(item => item.price * item.quantity)
        .reduce((acc, n, _i, _a) => acc + n, 0)
    }
  }

  buy() {
    this.supabase.latestSale().subscribe(sale => {
      this.supabase.finalizeSale(sale.sale_id).subscribe(_ => {
        this.supabase.cartContents().subscribe(cart => {
          console.log(cart, "cart")
          this.cart = cart
          this.supabase.cartQuantity().subscribe(newQuantity => {
            this.supabase.quantityEmitter.emit(newQuantity)
            this.totalPrice = undefined
          })
        })
      })
    })
  }

  removeItems(itemQuantityId: number) {
    this.supabase.removeFromCart(itemQuantityId).subscribe(_ => {
      this.supabase.cartContents().subscribe(cart => {
        this.cart = cart
        this.supabase.cartQuantity().subscribe(newQuantity => {
          this.supabase.quantityEmitter.emit(newQuantity)
          this.calculateTotal()
        })
      })
    })
  }
}
