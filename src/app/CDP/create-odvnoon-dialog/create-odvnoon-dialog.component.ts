import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { map, startWith } from 'rxjs/operators';
import { SnackbarService } from '../../snackbarService/snackbar.service';
import { ODVNoonReportData, portDto } from '../vessels.component';
import { VesselsService } from '../vessels.service';

@Component({
  standalone: true,
  selector: 'app-create-odvnoon-dialog',
  templateUrl: './create-odvnoon-dialog.component.html',
  styleUrls: ['./create-odvnoon-dialog.component.css'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class CreateODVNoonDialogComponent implements OnInit {
  noonReport: ODVNoonReportData;
  ports: portDto[] = [];
  filteredPorts: portDto[] = [];
  portControl = new FormControl();

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

  ngOnInit(): void {
    this.vesselsService.getPorts().subscribe(ports => {
      this.ports = ports;
      this.filteredPorts = ports;
    });

    this.portControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterPorts(value))
    ).subscribe(filteredPorts => {
      this.filteredPorts = filteredPorts;
    });
  }

  private _filterPorts(value: string): portDto[] {
    const filterValue = value.toLowerCase();
    return this.ports.filter(port => port.name.toLowerCase().includes(filterValue));
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
