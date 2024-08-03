import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { VesselData, VesselTypeDto } from '../vessels.component';

@Component({
  selector: 'app-create-vessel-dialog',
  templateUrl: './create-vessel-dialog.component.html',
  styleUrls: ['./create-vessel-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class CreateVesselDialogComponent {
  vessel: VesselData = {
    id: 0,
    vesselTypeId: 0,
    flagId: null,
    imo: 0,
    yearBuilt: 0,
    name: '',
    deadweight: 0,
    grossTonnage: 0,
  };

  vesselTypes: VesselTypeDto[] = [];

  constructor(
    public dialogRef: MatDialogRef<CreateVesselDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vesselTypes: VesselTypeDto[] }
  ) {
    this.vesselTypes = data.vesselTypes;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    // Convert relevant fields to integers
    this.vessel.imo = parseInt(this.vessel.imo as any, 10);
    this.vessel.yearBuilt = parseInt(this.vessel.yearBuilt as any, 10);
    this.vessel.deadweight = parseInt(this.vessel.deadweight as any, 10);
    this.vessel.grossTonnage = parseInt(this.vessel.grossTonnage as any, 10);

    this.dialogRef.close({ vessel: this.vessel });
  }
}
