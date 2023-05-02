import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent {
  data?: any
  constructor(private supabase: SupabaseService) {
    supabase.latestSale().subscribe(data => {
      console.log(data)
      this.data = data
    })
  }
}
