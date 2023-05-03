import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ItemComponent } from './components/item/item.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ShopComponent } from './components/shop/shop.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { AuthenticatedGuard } from './guard/authenticated.guard';

const routes: Routes = [
  { path: "", component: HomeComponent},
  { path: "login", component: LoginComponent},
  { path: "register", component: RegisterComponent },
  { path: "shop", component: ShopComponent, canActivate: [AuthenticatedGuard] },
  { path: "shopping-cart", component: ShoppingCartComponent, canActivate: [AuthenticatedGuard] },
  { path: "item/:id", component: ItemComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
