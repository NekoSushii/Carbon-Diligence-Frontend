import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VesselsService } from '../vessels.service';
import { CreateODVReportDialogComponent } from '../create-odvReport-dialog/create-odvReport-dialog.component';
import { ODVReportDto, VesselDto } from '../vessels.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CreateODVNoonDialogComponent } from '../create-odvnoon-dialog/create-odvnoon-dialog.component';
import { ODVNoonReport } from '../vessels.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

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
  viewingReport: ODVNoonReport | null = null;

  constructor(
    public dialogRef: MatDialogRef<ODVReportsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private vesselsService: VesselsService,
    public dialog: MatDialog
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
    this.vesselsService.getODVNoonReports().subscribe((reports: ODVNoonReport[]) => {
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
        // Handle the result if needed
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
