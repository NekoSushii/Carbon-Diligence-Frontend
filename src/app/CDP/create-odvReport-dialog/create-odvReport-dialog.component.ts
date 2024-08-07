import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { SnackbarService } from '../../snackbarService/snackbar.service';
import { ODVReportDto } from '../vessels.component';
import { VesselsService } from '../vessels.service';

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
    this.snackbarService.show('ODV Report Created', 'Close', 3000);
  }
}
