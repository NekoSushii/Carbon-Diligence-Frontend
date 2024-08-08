import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { VesselTypeDto } from '../vessels.component';
import { VesselsService } from '../vessels.service';

export interface VesselTypeData {
  name: string;
  code: string;
  cargoTypes: string;
  customTypes: string;
}

@Component({
  selector: 'app-manage-vessel-types-dialog',
  templateUrl: './manage-vessel-types-dialog.component.html',
  styleUrls: ['./manage-vessel-types-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
  ]
})
export class ManageVesselTypesDialogComponent implements OnInit {
  vesselTypes: VesselTypeDto[] = [];
  currentPage: 'list' | 'create' | 'edit' = 'list';
  selectedVesselType: VesselTypeDto = { id: 0, name: '', code: '', cargoTypes: '', customTypes: '' };

  constructor(
    private vesselsService: VesselsService,
    private dialogRef: MatDialogRef<ManageVesselTypesDialogComponent>
  ) {}

  ngOnInit() {
    this.loadVesselTypes();
  }

  loadVesselTypes() {
    this.vesselsService.getVesselTypes().subscribe(vesselTypes => {
      this.vesselTypes = vesselTypes;
    });
  }

  openCreatePage() {
    this.currentPage = 'create';
    this.selectedVesselType = { id: 0, name: '', code: '', cargoTypes: '', customTypes: '' };
  }

  openEditPage(vesselType: VesselTypeDto) {
    this.currentPage = 'edit';
    this.selectedVesselType = { ...vesselType };
  }

  saveVesselType() {
    if (this.selectedVesselType) {
      const { id, ...vesselTypeData } = this.selectedVesselType;
      if (this.currentPage === 'create') {
        this.vesselsService.createVesselType(vesselTypeData).subscribe(() => {
          this.currentPage = 'list';
          this.loadVesselTypes();
        });
      } else if (this.currentPage === 'edit') {
        this.vesselsService.updateVesselType(this.selectedVesselType).subscribe(() => {
          this.currentPage = 'list';
          this.loadVesselTypes();
        });
      }
    }
  }

  deleteVesselType(vesselType: VesselTypeDto) {
    this.vesselsService.deleteVesselType(vesselType.id).subscribe(() => {
      this.loadVesselTypes();
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
