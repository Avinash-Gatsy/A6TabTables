import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public serverStateChanged = new Subject<any>();
  private data = [
    {
      uuid: '12323',
      country: 'India',
      service: 'SMS',
      component: 'Inbound',
      status: 'pending'
    }, {
      uuid: '12324',
      country: 'India',
      service: 'SMS',
      component: 'Inbound',
      status: 'rejected'
    }, {
      uuid: '12325',
      country: 'India',
      service: 'SMS',
      component: 'Inbound',
      status: 'success'
    }, {
      uuid: '12326',
      country: 'India',
      service: 'SMS',
      component: 'Inbound',
      status: 'pending'
    }, {
      uuid: '12327',
      country: 'India',
      service: 'SMS',
      component: 'Inbound',
      status: 'rejected'
    }, {
      uuid: '12328',
      country: 'India',
      service: 'SMS',
      component: 'Inbound',
      status: 'success'
    }, {
      uuid: '12329',
      country: 'India',
      service: 'SMS',
      component: 'Inbound',
      status: 'pending'
    }, {
      uuid: '12332',
      country: 'India',
      service: 'SMS',
      component: 'Inbound',
      status: 'pending'
    }, {
      uuid: '12335',
      country: 'India',
      service: 'SMS',
      component: 'Inbound',
      status: 'pending'
    }, {
      uuid: '12338',
      country: 'India',
      service: 'SMS',
      component: 'Inbound',
      status: 'pending'
    }, {
      uuid: '12341',
      country: 'India',
      service: 'SMS',
      component: 'Inbound',
      status: 'pending'
    }, {
      uuid: '12330',
      country: 'India',
      service: 'SMS',
      component: 'Inbound',
      status: 'rejected'
    }, {
      uuid: '12331',
      country: 'India',
      service: 'SMS',
      component: 'Inbound',
      status: 'success'
    }
  ];

  constructor() {
  }

  getData() {
    // this is where you need to make an api call to get the data
    return this.data.slice();
  }

  updateData(uuid: string, updatedStatus: string) {
    // handle the logic to update server data
    // example send to server and once its successful then send the new value via subject
    this.data.forEach((obj) => {
      if (obj.uuid === uuid) {
        obj.status = updatedStatus;
      }
    });
    this.serverStateChanged.next(this.data.slice());
  }
}
