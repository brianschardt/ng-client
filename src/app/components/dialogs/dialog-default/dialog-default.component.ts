import { Component, OnInit, Inject }      from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }  from '@angular/material';

@Component({
  selector: 'app-dialog-default',
  templateUrl: './dialog-default.component.html',
  styleUrls: ['./dialog-default.component.css']
})
export class DialogDefaultComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogDefaultComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
