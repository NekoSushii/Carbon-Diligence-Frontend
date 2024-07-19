import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private showHeaderSubject = new BehaviorSubject<boolean>(true);
  showHeader$ = this.showHeaderSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      if (event.url === '/login' || event.urlAfterRedirects === '/login') {
        this.showHeaderSubject.next(false);
      } else {
        this.showHeaderSubject.next(true);
      }
    });
  }
}
