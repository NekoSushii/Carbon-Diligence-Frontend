import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { LayoutService } from './layout.service';
import { Observable } from 'rxjs';
import { SidebarComponent } from "./shared/sidebar/sidebar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'GreenTech Hub';
  showHeader$: Observable<boolean>;
  showSidebar: boolean = true;

  constructor(private layoutService: LayoutService, private router: Router, private route: ActivatedRoute) {
    this.showHeader$ = this.layoutService.showHeader$;
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.showSidebar = this.router.url !== '/login';
    });
  }
}
