import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VesselsService } from '../vessels.service';
import { ODVReportDto } from '../vessels.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { SnackbarService } from '../../snackbarService/snackbar.service';

@Component({
  standalone: true,
  selector: 'app-create-odvReport-dialog',
  templateUrl: './create-odvReport-dialog.component.html',
  styleUrls: ['./create-odvReport-dialog.component.css'],
  imports:
[
    MatFormFieldModule,
    MatLabel,
    MatInputModule,
    MatDatepickerModule,
    MatInput,
    FormsModule,
    MatNativeDateModule
  ],
  providers:[
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
  ]
})
export class CreateODVReportDialogComponent {
  odvReport: ODVReportDto;
  vesselName: string;

  constructor(
    public dialogRef: MatDialogRef<CreateODVReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vesselId: number, vesselName: string },
    private vesselsService: VesselsService,
    private snackbarService: SnackbarService,
  ) {
    this.odvReport = {
      id: 0,
      vesselId: data.vesselId,
      startDate: new Date(),
      endDate: new Date(),
      deleted: null
    };
    this.vesselName = data.vesselName;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    this.vesselsService.createODVReport(this.odvReport).subscribe(() => {
      this.dialogRef.close(this.odvReport)
    });
    this.snackbarService.show('User created', 'Close', 3000);
  }
}
