import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-create-odvnoon-dialog',
  templateUrl: './create-odvnoon-dialog.component.html',
  styleUrls: ['./create-odvnoon-dialog.component.css']
})
export class CreateODVNoonDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CreateODVNoonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
