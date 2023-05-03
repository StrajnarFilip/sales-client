import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  itemData: any
  amount: number = 1

  constructor(private supabase: SupabaseService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe(pMap => {
      const id = pMap.get("id")
      if (id) {
        this.supabase.itemDetails(Number.parseInt(id)).subscribe(data => this.itemData = data)
      }
    })
  }

  addToCart() {
    this.supabase.addToCart(this.itemData.id, this.amount, this.itemData.latest_price).subscribe(res => {
      this.supabase.cartQuantity().subscribe(newQuantity => {
        this.supabase.quantityEmitter.emit(newQuantity)
      })
    })
  }
}
