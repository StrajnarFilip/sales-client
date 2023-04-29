import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent {
  data?: any = undefined

  constructor(private supabase: SupabaseService) {
    this.listItems()
  }

  listItems() {
    this.supabase.itemsWithLatestPrices().subscribe(data => {
      console.log(data)
      this.data = data
    })
  }
}
