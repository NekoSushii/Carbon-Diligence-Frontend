import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatListModule, MatCheckboxModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

}
