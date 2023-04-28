import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {
  constructor(private supabase: SupabaseService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log("logged in", this.supabase.loggedIn)
    if (!this.supabase.loggedIn) { }
    return this.supabase.loggedIn;
  }

}
