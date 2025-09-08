import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartData } from 'chart.js';
import * as moment from 'moment';
import { Observable, ReplaySubject } from 'rxjs';
import { AdvancedPieChartWidgetOptions } from './widgets/advanced-pie-chart-widget/advanced-pie-chart-widget-options.interface';
import { AudienceOverviewWidgetOptions } from './widgets/audience-overview-widget/audience-overview-widget-options.interface';
import { BarChartWidgetOptions } from './widgets/bar-chart-widget/bar-chart-widget-options.interface';
import { DonutChartWidgetOptions } from './widgets/donut-chart-widget/donut-chart-widget-options.interface';
import { RealtimeUsersWidgetData, RealtimeUsersWidgetPages } from './widgets/realtime-users-widget/realtime-users-widget.interface';
import { RecentSalesWidgetOptions } from './widgets/recent-sales-widget/recent-sales-widget-options.interface';
import { SalesSummaryWidgetOptions } from './widgets/sales-summary-widget/sales-summary-widget-options.interface';
import { DashboardService } from './dashboard.service';
import { ChartWidgetOptions } from '../../../@fury/shared/chart-widget/chart-widget-options.interface';
import { MasterService } from '../master/master.service';

@Component({
  selector: 'fury-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
   stats = [
    { title: 'Total Assamese Songs', count: 250, color: 'primary' },
    { title: 'Total Bengali Songs', count: 180, color: 'accent' },
    { title: 'Total Hindi Songs', count: 75, color: 'warn' },
    { title: 'Total English Songs', count: 30, color: 'primary' },
  ];

   totalSongs:{language:string,total:number}[]=[]


  constructor(private masterService: MasterService,
              private router: Router) {
  }
  ngOnInit() {
     this.getAllTotalSongs();
  }

    getAllTotalSongs() {
       this.masterService.getSongsCountByLanguage().subscribe({
      next: (data) => {
       const colors = ['primary', 'accent', 'warn', 'primary'];
      this.totalSongs = data.map((song, i) => ({
        ...song,
        color: colors[i % colors.length]
      }));
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

}
