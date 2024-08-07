import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

interface CreateItemData {
  title: string;
  name: string;
  description: string;
  costPerLicense: number;
  organizationId: number | null;
  applicationId: number | null;
  dateFrom: Date | null;
  dateTo: Date | null;
  organizations: { id: number; name: string; }[];
  applications: { id: number; name: string; }[];
}

@Component({
  selector: 'app-create-subscription-dialog',
  templateUrl: './create-subscription-dialog.component.html',
  styleUrls: ['./create-subscription-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class CreateSubscriptionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CreateSubscriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateItemData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data);
  }
}
