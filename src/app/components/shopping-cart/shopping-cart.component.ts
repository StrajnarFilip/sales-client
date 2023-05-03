import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent {
  data?: any
  cart?: any
  constructor(private supabase: SupabaseService) {
    supabase.latestSale().subscribe(data => {
      console.log(data)
      this.data = data
    })

    supabase.cartContents().subscribe(cart => {
      console.log(cart, "cart")
      this.cart = cart
    })
  }

  buy() {
    this.supabase.finalizeSale(this.data.sale_id).subscribe(res => console.log(res))
  }
}
