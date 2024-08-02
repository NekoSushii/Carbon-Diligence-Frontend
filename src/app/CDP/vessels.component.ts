import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { SnackbarService } from '../snackbarService/snackbar.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { VesselsService } from './vessels.service';

export interface VesselDto {
  id: number;
  vesselTypeId: number;
  flagId: number;
  imo: number;
  yearBuilt: number;
  name: string;
  deadweight: number;
  grossTonnage: number;
  created: Date;
  updated: Date;
  deleted: Date | null;
}

@Component({
  standalone: true,
  selector: 'app-vessels',
  templateUrl: './vessels.component.html',
  styleUrls: ['./vessels.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTableModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VesselsComponent implements OnInit, AfterViewInit, AfterViewChecked {
  vesselsData: VesselDto[] = [];
  loading: boolean = true;
  displayedColumns: string[] = ['name', 'imo', 'yearBuilt', 'deadweight', 'grossTonnage', 'action'];
  dataLoaded: boolean = false;

  constructor(
    private vesselsService: VesselsService,
    public dialog: MatDialog,
    private cdref: ChangeDetectorRef,
    private ngZone: NgZone,
    private snackbarService: SnackbarService,
  ) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadData();
    });
  }

  ngAfterViewChecked() {
  }

  loadData() {
    this.vesselsService.loadAllData().subscribe({
      next: (result) => {
        this.ngZone.run(() => {
          this.vesselsData = result;
          this.dataLoaded = true;
          setTimeout(() => {
            this.loading = false;
            this.cdref.detectChanges();
          }, 0);
        });
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.ngZone.run(() => {
          setTimeout(() => {
            this.loading = false;
            this.cdref.detectChanges();
          }, 0);
        });
      }
    });
  }

  showErrorMessage(message: string) {
    this.snackbarService.show('Failed to load data!: ' + message, 'Close', 3000);
  }

  saveChanges(updatedVessel: VesselDto) {
    this.vesselsService.updateVessel(updatedVessel).subscribe({
      next: (response) => {
        this.snackbarService.show('Vessel updated', 'Close', 3000);
        this.loadData();
      },
      error: (error) => {
        console.error('Error updating vessel:', error);
      }
    });
  }

  confirmDelete(vessel: VesselDto) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this vessel?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteVessel(vessel);
        this.snackbarService.show('Vessel deleted', 'Close', 3000);
      }
    });
  }

  confirmUndelete(vessel: VesselDto) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to restore this vessel?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.undeleteVessel(vessel);
        this.snackbarService.show('Vessel restored', 'Close', 3000);
      }
    });
  }

  deleteVessel(vessel: VesselDto) {
    const updatedVessel = { ...vessel, deleted: new Date() };
    this.vesselsService.updateVessel(updatedVessel).subscribe({
      next: (response) => {
        this.loadData();
      },
      error: (error) => {
        console.error('Error deleting vessel:', error);
      }
    });
  }

  undeleteVessel(vessel: VesselDto) {
    const updatedVessel = { ...vessel, deleted: null };
    this.vesselsService.updateVessel(updatedVessel).subscribe({
      next: (response) => {
        this.loadData();
      },
      error: (error) => {
        console.error('Error undeleting vessel:', error);
      }
    });
  }
}
