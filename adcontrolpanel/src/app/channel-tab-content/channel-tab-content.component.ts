import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import * as Handsontable from 'handsontable';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';
import { tableMap } from '../table-map';

@Component({
  selector: 'app-channel-tab-content',
  templateUrl: './channel-tab-content.component.html',
  styleUrls: ['./channel-tab-content.component.css']
})
export class ChannelTabContentComponent implements OnInit {
  dataset: any[] = [];
  hotSettings;
  colHeaders = [];
  result;
  disabled = true;
  dispaly = 'none';
  @Input() data: any;
  @Input() editaction: EventEmitter<any>;
  constructor(
    private dataService: DataService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    if (this.data) {
      const fileName = this.data.fileName;
      this.setDataSet(fileName);
    }
    if (this.editaction) {
      this.editaction.subscribe(res => {
        if (res.tab) {
          this.setDataSet(res.tab.fileName);
        } else {
          this.result = null;
          this.dataset = [];
          this.colHeaders = [];
        }

      });
    }
  }

  setDataSet(fileName) {
    this.dataset = [];
    this.colHeaders = [];
    this.dataService.getRow(fileName).subscribe(
      res => {
        this.result = res;
        if (this.result.response.length > 0) {
          this.dataset = this.result.response;
          this.colHeaders = Object.keys(this.result.response[0]);
        }
      },
      error => {
        console.log(error);
        alert('Unable to fetch data');
      }
    );
  }

  edit(event) {
    if (event.params.length > 0) {
      if (event.params[0] && event.params[0].length > 0) {
        const editvalue = event.params[0][0];
        if (editvalue[2] !== editvalue[3]) {
          this.disabled = false;
        }
      }
    }
  }

  updateConfirm() {
    this.dispaly = 'block';
  }

  updateCancel() {
    this.dispaly = 'none';
  }

  updateAllData() {
    this.dispaly = 'none';
    this.dataService.updateRow(this.dataset).subscribe(
      res => {
        if (res['success']) {
          if (res['response'].length > 0) {
            this.toastr.error(res['response'][0], 'Update status');
          } else {
            this.toastr.success('All data changed!', 'Update status');
            this.disabled = true;
          }
        } else {
          this.toastr.error('Update Error', 'Update status');
        }

      },
      error => {
        console.log(error);
        alert('Unable to fetch data');
      }
    );
  }

  setWidth(event) {
    event.hotInstance.updateSettings({ width: 1200});
    event.hotInstance.updateSettings({});
    // event.hotInstance.updateHotTable();
  }
}


