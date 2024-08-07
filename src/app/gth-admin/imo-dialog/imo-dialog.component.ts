import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { IMODto, OrganizationDto } from '../gth-admin.component';
import { GthAdminService } from '../gth-admin.service';

@Component({
  standalone: true,
  selector: 'app-imo-dialog',
  templateUrl: './imo-dialog.component.html',
  styleUrls: ['./imo-dialog.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTableModule,
    MatIconModule,
  ]
})
export class ImoDialogComponent implements OnInit {
  selectedOrganization: number | null = null;
  imos: IMODto[] = [];
  displayedColumns: string[] = ['id', 'imo', 'action'];
  creatingImo: boolean = false;
  newImo: IMODto = { id: 0, imo: 0, deleted: null };

  constructor(
    public dialogRef: MatDialogRef<ImoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { organizations: OrganizationDto[] },
    private gthAdminService: GthAdminService
  ) {}

  ngOnInit() {}

  onOrganizationChange(organizationId: number) {
    this.selectedOrganization = organizationId;
    this.gthAdminService.getImoByOrganization(organizationId).subscribe((imos) => {
      this.imos = imos;
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  createImo() {
    this.creatingImo = true;
    this.newImo = { id: 0, imo: 0, deleted: null };
  }

  saveNewImo() {
    if (this.selectedOrganization !== null) {
      this.gthAdminService.createImo(this.selectedOrganization, this.newImo).subscribe(() => {
        this.onOrganizationChange(this.selectedOrganization!);
        this.creatingImo = false;
      });
    }
  }

  deleteImo(imoId: number) {
    if (this.selectedOrganization !== null) {
      this.gthAdminService.deleteImo(this.selectedOrganization, imoId).subscribe(() => {
        this.onOrganizationChange(this.selectedOrganization!);
      });
    }
  }

  cancelNewImo() {
    this.creatingImo = false;
  }
}
