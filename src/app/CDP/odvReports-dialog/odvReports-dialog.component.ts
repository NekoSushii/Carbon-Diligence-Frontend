import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { SnackbarService } from '../../snackbarService/snackbar.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CreateODVNoonDialogComponent } from '../create-odvnoon-dialog/create-odvnoon-dialog.component';
import { CreateODVReportDialogComponent } from '../create-odvReport-dialog/create-odvReport-dialog.component';
import { ODVNoonReportDto, ODVReportDto, VesselDto } from '../vessels.component';
import { VesselsService } from '../vessels.service';

@Component({
  standalone: true,
  selector: 'app-odv-reports-dialog',
  templateUrl: './odvReports-dialog.component.html',
  styleUrls: ['./odvReports-dialog.component.css'],
  imports: [
    MatTableModule,
    MatIconModule,
    CommonModule,
    MatButtonModule,
    MatDialogModule,
  ]
})
export class ODVReportsDialogComponent implements OnInit {
  displayedColumns: string[] = ['vesselName', 'startDate', 'endDate', 'actions'];
  odvReports: ODVReportDto[] = [];
  vessels: VesselDto[] = [];
  viewingReport: ODVNoonReportDto | null = null;

  constructor(
    public dialogRef: MatDialogRef<ODVReportsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private vesselsService: VesselsService,
    public dialog: MatDialog,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.loadODVReports();
    this.loadVessels();
  }

  loadODVReports() {
    this.vesselsService.getODVReports().subscribe((reports: ODVReportDto[]) => {
      this.odvReports = reports.filter(report => report.vesselId === this.data.vessel.id);
    });
  }

  loadVessels() {
    this.vesselsService.getVessels().subscribe((vessels: VesselDto[]) => {
      this.vessels = vessels;
    });
  }

  getVesselName(vesselId: number): string {
    const vessel = this.vessels.find(v => v.id === vesselId);
    return vessel ? vessel.name : 'Unknown';
  }

  viewNoonReport(reportId: number) {
    this.vesselsService.getODVNoonReports().subscribe((reports: ODVNoonReportDto[]) => {
      this.viewingReport = reports.find(report => report.odvReportId === reportId) || null;
    });
  }

  backToReports() {
    this.viewingReport = null;
  }

  openCreateODVReportDialog() {
    const vessel = this.vessels.find(v => v.id === this.data.vessel.id);
    const dialogRef = this.dialog.open(CreateODVReportDialogComponent, {
      width: '80vw',
      height: '80vh',
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: { vesselId: this.data.vessel.id, vesselName: vessel?.name || 'Unknown' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadODVReports();
      }
    });
  }

  openCreateODVNoonDialog(report: ODVReportDto) {
    const dialogRef = this.dialog.open(CreateODVNoonDialogComponent, {
      width: '80vw',
      height: '80vh',
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: { report }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  deleteReport(reportId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this report?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vesselsService.deleteODVReport(reportId).subscribe(() => {
          this.loadODVReports();
          this.snackbarService.show('Report deleted!', 'Close', 3000);
        });
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
