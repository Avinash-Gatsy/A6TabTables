import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DataService} from '../data.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  form: FormGroup;
  title: string;
  uuid: string;

  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<DialogComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private dataService: DataService) {
    this.title = data.title;
    this.uuid = data.uuid;
    this.form = formBuilder.group({
      status: [status, Validators.required]
    });
  }

  ngOnInit() {
  }

  save() {
    this.dialogRef.close(this.form.value);
    // update in the service
    this.dataService.updateData(this.uuid, this.form.value.status);
  }

  close() {
    this.dialogRef.close();
  }


}
