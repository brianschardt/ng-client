import { Component, OnInit, Inject }      from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }  from '@angular/material';

@Component({
  selector: 'app-dialog-remove',
  templateUrl: './dialog-remove.component.html',
  styleUrls: ['./dialog-remove.component.css']
})
export class DialogRemoveComponent implements OnInit {

  remove:boolean = false;
  constructor(public dialogRef: MatDialogRef<DialogRemoveComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

  }

  onDelete(){
    this.remove = true;
    this.dialogRef.close(this.remove);
  }

  onCancel(){
    this.dialogRef.close(this.remove);
  }

}
