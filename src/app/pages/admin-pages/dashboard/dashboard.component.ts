import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SpinnerService} from "../../../shared/services/spinner.service";
import {AdminDashboardService} from "../../../shared/services/admin/admin-dashboard.service";
import {finalize, Subject, takeUntil} from "rxjs";
import {
  DashboardAggregationDataInterface
} from "../../../shared/interfaces/admin/dashboard/dashboard-aggregation-data.interface";
import {
  ChartComponent
} from 'ng-apexcharts';
import {PieChartOptions, ChartService, AreaChartOptions} from "../../../shared/services/admin/chart.service";

@Component({
  selector: 'collabro-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild("projectByTypeChart") projectByTypeChart: ChartComponent;
  @ViewChild("projectByTimeDurationChart") projectByTimeDurationChart: ChartComponent;
  @ViewChild("projectByDayChart") projectByDayChart: ChartComponent;

  public dashboardData: DashboardAggregationDataInterface = null;
  public fromDate: Date = new Date();
  public toDate: Date = new Date();
  public projectByTypeChartOptions: Partial<PieChartOptions>;
  public projectByStatusChartOptions: Partial<PieChartOptions>;
  public projectByDayChartOptions: Partial<AreaChartOptions>;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly spinnerService: SpinnerService,
              private readonly chartService: ChartService,
              private readonly cdr: ChangeDetectorRef,
              private readonly adminDashboardService: AdminDashboardService) {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.setForm();
    this.getDashboardData();
  }

  private getDashboardData(): void {
    this.spinnerService.showSpinner();

    this.adminDashboardService.searchDashboardAggregation({
      from: this.fromDate,
      to: this.toDate,
      countryCodes: ["UA", "US"]
    })
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: data => {
          this.dashboardData = data;
          this.projectByTypeChartOptions = this.chartService.initPieChart(this.dashboardData.projectByType);
          this.projectByStatusChartOptions = this.chartService.initPieChart(this.dashboardData.projectByStatus);
          this.projectByDayChartOptions = this.chartService.initAreaChart(this.dashboardData.projectByDay);
          this.cdr.detectChanges();
        }
      });
  }

  private setForm(): void {
    const today = new Date();
    this.fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    this.toDate = new Date(today.getFullYear(), today.getMonth(), 0);
  }
}
