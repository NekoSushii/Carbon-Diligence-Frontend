import { CommonModule } from '@angular/common';
import { AfterViewChecked, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { LayoutService } from './layout.service';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { LoadingService } from './loading-screen/loading.service';
import { SharedModule } from './shared.module';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from "./shared/sidebar/sidebar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, SidebarComponent, LoadingScreenComponent, SharedModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'GreenTech Hub';
  showHeader$: Observable<boolean>;
  showSidebar: boolean = true;
  isLoading$: Observable<boolean>;

  constructor(private layoutService: LayoutService, private router: Router, private route: ActivatedRoute, private loadingService: LoadingService) {
    this.showHeader$ = this.layoutService.showHeader$;
    this.isLoading$ = this.loadingService.loading$;
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.showSidebar = this.router.url !== '/login';
    });
  }

  ngAfterViewChecked() {
  }
}


