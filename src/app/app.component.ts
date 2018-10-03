import {Component, OnInit} from '@angular/core';
import {Observable, Observer, Subscription} from 'rxjs';
import {DataService} from './data.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {DialogComponent} from './dialog/dialog.component';

export interface ExampleTab {
  label: string;
  content: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private tableData;
  private pendingData;
  private rejectedData;
  private successData;
  asyncTabs: Observable<ExampleTab[]>;
  public displayedColumns: string[] = ['uuid', 'country', 'service', 'component', 'status'];

  private serverSubscription: Subscription;

  constructor(private dataService: DataService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    // this is the function that will be executed once your component is started
    // check more on angular life cycle hooks
    this.tableData = this.dataService.getData();
    this.computeTabData();
    this.serverSubscription = this.dataService.serverStateChanged
      .subscribe((data: any) => {
        this.tableData = data;
        // tab data will change
        this.computeTabData();

        // need to reset the old values
        this.asyncTabs = Observable.create((observer: Observer<ExampleTab[]>) => {
          setTimeout(() => {
            observer.next([
              {label: 'Pending', content: this.pendingData},
              {label: 'Rejected', content: this.rejectedData},
              {label: 'Success', content: this.successData},
            ]);
          }, 0);
        });
      });

    this.asyncTabs = Observable.create((observer: Observer<ExampleTab[]>) => {
      setTimeout(() => {
        observer.next([
          {label: 'Pending', content: this.pendingData},
          {label: 'Rejected', content: this.rejectedData},
          {label: 'Success', content: this.successData},
        ]);
      }, 1000);
    });
  }

  computeTabData() {
    this.pendingData = this.tableData.filter((data) => {
      return data.status === 'pending';
    });
    this.rejectedData = this.tableData.filter((data) => {
      return data.status === 'rejected';
    });
    this.successData = this.tableData.filter((data) => {
      return data.status === 'success';
    });
  }

  openDialog(e, row) {
    const dialogConfig = new MatDialogConfig();
    // user will not be able to close the dialog by clicking outside
    dialogConfig.disableClose = true;
    // focus will automatically be set to the 1st form field
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      title: 'Select the dropdown to change status',
      uuid: row.uuid
    };
    this.dialog.open(DialogComponent, dialogConfig);
  }
}
