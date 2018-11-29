import {Component, OnInit} from '@angular/core';
import {Observable, Observer, Subscription} from 'rxjs';
import {DataService} from './data.service';
import {MatDialog, MatDialogConfig, PageEvent} from '@angular/material';
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

  // MatPaginator Inputs
  length = 5;
  pageSize = 2;
  pageSizeOptions: number[] = [2];
  currentPageIndex = 0;

  // MatPaginator Output
  pageEvent: PageEvent;
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
          this.length = this.pendingData.length;
          setTimeout(() => {
            observer.next([
              {label: 'Pending', content: this.pendingData.slice(0, this.pageSize)},
              {label: 'Rejected', content: this.rejectedData},
              {label: 'Success', content: this.successData},
            ]);
          }, 0);
        });
      });

    this.asyncTabs = Observable.create((observer: Observer<ExampleTab[]>) => {
      this.length = this.pendingData.length;
      setTimeout(() => {
        observer.next([
          {label: 'Pending', content: this.pendingData.slice(0, this.pageSize)},
          {label: 'Rejected', content: this.rejectedData},
          {label: 'Success', content: this.successData},
        ]);
      }, 0);
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
  onPageChange(event) {
    console.log(this.pageEvent.pageIndex);
    // if its a forward arrow
    if (this.pageEvent.pageIndex > this.currentPageIndex) {
      const MinSize = this.pageSize * this.pageEvent.pageIndex;
      const MaxSize = this.pageSize * (this.pageEvent.pageIndex + 1 );

      // need to reset the old values - create a function that is reusuable
      this.asyncTabs = Observable.create((observer: Observer<ExampleTab[]>) => {
        this.length = this.pendingData.length;
        setTimeout(() => {
          observer.next([
            {label: 'Pending', content: this.pendingData.slice(MinSize, MaxSize)},
            {label: 'Rejected', content: this.rejectedData},
            {label: 'Success', content: this.successData},
          ]);
        }, 0);
      });
    } else if (this.pageEvent.pageIndex < this.currentPageIndex) {
      // backward arrow
      const MinSize = this.pageSize * this.pageEvent.pageIndex;
      const MaxSize = this.pageSize * this.currentPageIndex;

      // need to reset the old values - create a function that is reusuable
      this.asyncTabs = Observable.create((observer: Observer<ExampleTab[]>) => {
        this.length = this.pendingData.length;
        setTimeout(() => {
          observer.next([
            {label: 'Pending', content: this.pendingData.slice(MinSize, MaxSize)},
            {label: 'Rejected', content: this.rejectedData},
            {label: 'Success', content: this.successData},
          ]);
        }, 0);
      });
    }
    this.currentPageIndex = this.pageEvent.pageIndex;
  }
}
