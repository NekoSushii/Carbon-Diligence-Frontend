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
import { CreateVesselDialogComponent } from './create-vessel-dialog/create-vessel-dialog.component';
import { EditVesselDialogComponent } from './edit-vessel-dialog/edit-vessel-dialog.component';
import { ODVReportsDialogComponent } from './odvReports-dialog/odvReports-dialog.component';
import { VesselsService } from './vessels.service';

export interface VesselDto {
  id: number;
  vesselTypeId: number;
  flagId: number | null;
  imo: number;
  yearBuilt: number;
  name: string;
  deadweight: number;
  grossTonnage: number;
  deleted: Date | null;
}

export interface VesselTypeDto {
  id: number;
  name: string;
  code: string;
  cargoTypes: string;
  customTypes: string;
}

export interface VesselEvent {
  id: number;
  vesselId: number;
  attribute: string;
  oldValue: string;
  newValue: string;
  timestamp: Date;
}

export interface VesselConsumer {
  id: number;
  vesselId: number;
  name: string;
  code: string;
  sfoc: number;
}

export interface VesselData {
  id: number;
  vesselTypeId: number;
  flagId: number | null;
  imo: number;
  yearBuilt: number;
  name: string;
  deadweight: number;
  grossTonnage: number;
}

export interface ODVReportDto {
  id: number;
  vesselId: number;
  startDate: Date;
  endDate: Date;
  deleted: Date | null;
}

export interface ODVNoonReportDto {
  id: number;
  odvReportId: number;
  timestamp: Date;
  port: string;
  meRunningHours: number;
  driftingHours: number;
  durationSea: number;
  anchorageHours: number;
  distance: number;
  latitude: number;
  longitude: number;
  comments: string;
  source: string;
  deleted: Date | null;
}

export interface ODVNoonReportData {
  odvReportId: number;
  timestamp: Date;
  port: string;
  meRunningHours: number;
  driftingHours: number;
  durationSea: number;
  anchorageHours: number;
  distance: number;
  latitude: number;
  longitude: number;
  comments: string;
  source: string;
}

export interface odvReportCreateDto {
  vesselId: number;
  startDate: Date;
  endDate: Date;
}

export interface portDto {
  name: string;
  countryCode: string;
  location: string;
  latitude: number;
  longtitude: number;
  isEu: boolean;
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
  vesselTypes: VesselTypeDto[] = [];
  loading: boolean = true;
  displayedColumns: string[] = ['name', 'imo', 'yearBuilt', 'deadweight', 'grossTonnage', 'action'];
  dataLoaded: boolean = false;
  permissions: string[] = [];

  constructor(
    private vesselsService: VesselsService,
    public dialog: MatDialog,
    private cdref: ChangeDetectorRef,
    private ngZone: NgZone,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    const userString = sessionStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      if (user && user.roles) {
        this.getRolesForUser(user.roles);
      }
    }
  }

  getRolesForUser(roleIds: number[]) {
    this.vesselsService.getRoles().subscribe({
      next: (roles) => {
        const userRoles = roles.filter(role => roleIds.includes(role.id));
        this.permissions = userRoles.flatMap(role => role.permissions);
        this.loadData();
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      }
    });
  }

  ngAfterViewInit() {
  }

  ngAfterViewChecked() {}

  loadData() {
    this.vesselsService.loadAllData().subscribe({
      next: (result) => {
        this.ngZone.run(() => {
          this.vesselsData = result.vessels;
          this.vesselTypes = result.vesselTypes;
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

  saveChanges(updatedVessel: VesselData) {
    const { deleted, ...vesselDto } = {
      ...updatedVessel,
      deleted: null
    };

    this.vesselsService.updateVessel(vesselDto as VesselDto).subscribe({
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

  deleteVessel(vessel: VesselDto) {
    this.vesselsService.deleteVesselById(vessel.id).subscribe({
      next: (response) => {
        this.loadData();
      },
      error: (error) => {
        console.error('Error deleting vessel:', error);
      }
    });
  }

  openEditDialog(vessel: VesselDto) {
    const vesselData: VesselData = {
      id: vessel.id,
      vesselTypeId: vessel.vesselTypeId,
      flagId: vessel.flagId,
      imo: vessel.imo,
      yearBuilt: vessel.yearBuilt,
      name: vessel.name,
      deadweight: vessel.deadweight,
      grossTonnage: vessel.grossTonnage
    };

    const dialogRef = this.dialog.open(EditVesselDialogComponent, {
      width: '80vw',
      height: '80vh',
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: vesselData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveChanges(result.vessel);
      }
    });
  }

  openCreateVesselDialog() {
    const dialogRef = this.dialog.open(CreateVesselDialogComponent, {
      width: '80vw',
      height: '80vh',
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: { vesselTypes: this.vesselTypes }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vesselsService.createVessel(result.vessel).subscribe({
          next: (response) => {
            this.snackbarService.show('Vessel created', 'Close', 3000);
            this.loadData();
          },
          error: (error) => {
            console.error('Error creating vessel:', error);
          }
        });
      }
    });
  }

  openODVReportsDialog(vessel: VesselDto) {
    const dialogRef = this.dialog.open(ODVReportsDialogComponent, {
      width: '80vw',
      height: '80vh',
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: { vessel }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  canPerformAction(action: string): boolean {
    return this.permissions.includes(action);
  }
}