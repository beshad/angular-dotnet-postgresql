import { Component, Inject, NgZone, PLATFORM_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { isPlatformBrowser } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { from, map, switchMap, tap, toArray } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  imports: [HttpClientModule, ReactiveFormsModule],
})
export class AppComponent {
  private rootChart1: am5.Root;
  data;
  options = [];
  selectedOption = new FormControl({});
  chart: am5xy.XYChart;
  series: am5xy.LineSeries;
  xAxis: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone,
    private http: HttpClient
  ) {}

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  getLogs() {
    return this.http.get<unknown[]>("api/charge-logs").pipe(
      switchMap((resp: any) => from(resp)),
      map((resp: any) => {
        const message = JSON.parse(resp.message);
        resp.message = message;
        return resp;
      }),
      toArray(),
      tap(console.log),
      tap((resp) => {
        this.data = resp;
        resp.forEach((charger) => {
          this.options.push({
            label: charger.chargerName,
            value: charger.chargerSerialNumber,
          });
          this.selectedOption.setValue(this.options[0].value);
        });
      })
    );
  }

  ngAfterViewInit() {
    this.rootChart1 = am5.Root.new("chart-1");
    this.getLogs()
      .pipe(
        tap((data) => {
          const logs = [];
          data = data[0].message.data;
          data.forEach((d) => {
            logs.push({
              category: d["Finish Time"],
              value: parseInt(d["End Current (A)"]),
            });
          });
          this.chart1(logs);
        })
      )
      .subscribe();
  }

  onChargerChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const data = this.data.find(
      (charger) => charger.chargerSerialNumber === value
    ).message.data;
    const logs = [];
    data.forEach((d) => {
      logs.push({
        category: d["Finish Time"],
        value: parseInt(d["End Current (A)"]),
      });
    });
    this.series.data.setAll(logs);
    this.xAxis.data.setAll(logs);
  }

  chart1(data) {
    this.browserOnly(() => {
      this.rootChart1.setThemes([am5themes_Animated.new(this.rootChart1)]);

      let chart = this.rootChart1.container.children.push(
        am5xy.XYChart.new(this.rootChart1, {
          panY: false,
          layout: this.rootChart1.verticalLayout,
        })
      );

      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(this.rootChart1, {
          renderer: am5xy.AxisRendererY.new(this.rootChart1, {}),
        })
      );

      yAxis.children.push(
        am5.Label.new(this.rootChart1, {
          rotation: -90,
          text: "End Current (A)",
          y: am5.p50,
          centerX: am5.p50,
          centerY: am5.p50,
          fontSize: "14px",
          fill: am5.color(0xffffff),
        })
      );

      yAxis.get("renderer").labels.template.set("fill", am5.color(0xffffff));

      this.xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(this.rootChart1, {
          renderer: am5xy.AxisRendererX.new(this.rootChart1, {}),
          categoryField: "category",
        })
      );

      this.xAxis.get("renderer").labels.template.setAll({
        fill: am5.color(0xffffff),
        fontSize: "10px",
      });
      this.xAxis.children.push(
        am5.Label.new(this.rootChart1, {
          text: "Finish Time",
          x: am5.p50,
          centerX: am5.p50,
          centerY: am5.p50,
          fontSize: "14px",
          fill: am5.color(0xffffff),
        })
      );
      this.xAxis.data.setAll(data);

      this.series = chart.series.push(
        am5xy.SmoothedXLineSeries.new(this.rootChart1, {
          name: "Series",
          xAxis: this.xAxis,
          yAxis: yAxis,
          valueYField: "value",
          categoryXField: "category",
        })
      );
      this.series.data.setAll(data);

      let legend = this.chart.children.push(
        am5.Legend.new(this.rootChart1, {})
      );
      legend.data.setAll(chart.series.values);

      this.chart.set("cursor", am5xy.XYCursor.new(this.rootChart1, {}));
    });
  }

  ngOnDestroy() {
    this.browserOnly(() => {
      if (this.rootChart1) {
        this.rootChart1.dispose();
      }
    });
  }
}
