import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ApplicationDto, UserGroupDto } from '../admin.component';

@Component({
  selector: 'app-user-group-dialog',
  templateUrl: './user-group-dialog.component.html',
  styleUrls: ['./user-group-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule
  ]
})
export class UserGroupDialogComponent {
  displayedColumns: string[] = ['name', 'description', 'applications'];
  originalUserGroups: UserGroupDto[];

  constructor(
    public dialogRef: MatDialogRef<UserGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userGroups: UserGroupDto[], applications: ApplicationDto[] }
  ) {
    this.originalUserGroups = JSON.parse(JSON.stringify(data.userGroups)); // Deep copy to track changes
  }

  onClose(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    const changedUserGroups = this.data.userGroups.filter((group, index) => {
      return JSON.stringify(group) !== JSON.stringify(this.originalUserGroups[index]);
    });

    console.log('Changed User Groups:', changedUserGroups);
    this.dialogRef.close(changedUserGroups);
  }
}
