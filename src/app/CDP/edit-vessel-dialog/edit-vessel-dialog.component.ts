import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { VesselData } from '../vessels.component';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-edit-vessel-dialog',
  templateUrl: './edit-vessel-dialog.component.html',
  styleUrls: ['./edit-vessel-dialog.component.css'],
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
    MatTableModule,
  ]
})
export class EditVesselDialogComponent {
  displayedColumns: string[] = ['name', 'imo', 'yearBuilt', 'deadweight', 'grossTonnage'];
  vessel: VesselData;

  constructor(
    public dialogRef: MatDialogRef<EditVesselDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VesselData
  ) {
    this.vessel = { ...data };
  }

  onClose(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    this.dialogRef.close({ vessel: this.vessel });
  }
}
