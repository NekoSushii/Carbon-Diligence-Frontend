import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VesselsService } from '../vessels.service';
import { ODVNoonReportData } from '../vessels.component';
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
  selector: 'app-create-odvnoon-dialog',
  templateUrl: './create-odvnoon-dialog.component.html',
  styleUrls: ['./create-odvnoon-dialog.component.css'],
  imports: [
    MatFormFieldModule,
    MatLabel,
    MatInputModule,
    MatDatepickerModule,
    MatInput,
    FormsModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class CreateODVNoonDialogComponent {
  noonReport: ODVNoonReportData;

  constructor(
    public dialogRef: MatDialogRef<CreateODVNoonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private vesselsService: VesselsService,
    public snackBarService: SnackbarService,
  ) {
    this.noonReport = {
      odvReportId: this.data.report.id,
      timestamp: new Date(),
      port: '',
      meRunningHours: 0,
      driftingHours: 0,
      durationSea: 0,
      anchorageHours: 0,
      distance: 0,
      latitude: 0,
      longitude: 0,
      comments: '',
      source: '',
    };
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    this.vesselsService.addODVNoonReport(this.noonReport).subscribe(() => {
      this.dialogRef.close(true);
    });
    this.snackBarService.show('Vessel created~!', 'Close', 3000);
  }
}
