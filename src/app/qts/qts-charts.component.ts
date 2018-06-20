import { Component, OnInit, ViewChild, SimpleChanges, OnChanges, Pipe, PipeTransform, Input, Output, EventEmitter } from '@angular/core';
import { QtsService } from './qts.service';
import { Subscription }   from 'rxjs';
import { RepresentationData }   from './data';

import { DecimalPipe } from '@angular/common';
@Pipe({
  name: 'formatData'
})
export class FormatDataPipe implements PipeTransform {
  constructor(private dp: DecimalPipe){}
  transform(dataElement: any): any {
      if (isNaN(dataElement)) {
      return dataElement;
    } else {
      return this.dp.transform(dataElement);
    }
  }
}

@Component({
  selector: 'app-qts-charts',
  templateUrl: './qts-charts.component.html',
  styleUrls: ['./qts-charts.component.css']
})
export class QtsChartsComponent implements OnInit {
  
  subscription: Subscription;
  model = new RepresentationData();
  activeChart = "values";
  
  constructor(private qtsService : QtsService) {  
  }
  
  @Output() ready = new EventEmitter<boolean>();
  
  setChart(str){
    /* console.log('Now chart is ' + str); */
    this.activeChart = str;
  }
  ngOnInit() {
    this.subscription = this.qtsService.latestCharts$.subscribe(newData => {
      this.chartsReady = false;
      this.model = newData;
      setTimeout(() => {
/* without timeout chart will not disappear from the page, thus, it will not be re-initialised, its number of columns will not change etc... */      
        this.chartsReady = true;
        this.ready.emit(true);
      }, 50);
    });
  }
  
  @Input('showCharts') chartsReady = false;
  oldestAvailableDate = '';
  newestAvailableDate = '';
  stockName = '';
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
