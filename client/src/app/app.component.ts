import { Component, Inject, NgZone, PLATFORM_ID } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HttpClient } from "@angular/common/http";

// amCharts imports
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { isPlatformBrowser } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { from, map, skip, switchMap, tap } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  imports: [HttpClientModule],
})
export class AppComponent {
  private root!: am5.Root;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone,
    private http: HttpClient
  ) {
    this.getLogs();
  }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  getLogs() {
    this.http
      .get<any[]>("api/charge-logs")
      .pipe(
        switchMap((resp: any) => from(resp)),
        map((resp: any) => {
          const message = JSON.parse(resp.message);
          resp.message = message;
          // Fix this! first element is the bloody csv header
          resp.message.data.shift();
          return resp;
        }),
        tap(console.log)
      )
      .subscribe();
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly(() => {
      let root = am5.Root.new("chartdiv");

      root.setThemes([am5themes_Animated.new(root)]);

      let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panY: false,
          layout: root.verticalLayout,
        })
      );

      // Define data
      let data = [
        {
          category: "Charger 1",
          value1: 1000,
          value2: 588,
        },
        {
          category: "Charger 2",
          value1: 1200,
          value2: 1800,
        },
        {
          category: "Charger 3",
          value1: 850,
          value2: 1230,
        },
      ];

      // Create Y-axis
      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {}),
        })
      );

      /// text color white to y Axis text
      yAxis.get("renderer").labels.template.set("fill", am5.color(0xffffff));

      // Create X-Axis
      let xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          renderer: am5xy.AxisRendererX.new(root, {}),
          categoryField: "category",
        })
      );

      /// text color white to x Axis text
      xAxis.get("renderer").labels.template.set("fill", am5.color(0xffffff));
      xAxis.data.setAll(data);

      // Create series
      let series1 = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: "Series",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value1",
          categoryXField: "category",
        })
      );
      series1.data.setAll(data);

      let series2 = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: "Series",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value2",
          categoryXField: "category",
        })
      );
      series2.data.setAll(data);

      // Add legend
      let legend = chart.children.push(am5.Legend.new(root, {}));
      legend.data.setAll(chart.series.values);

      // Add cursor
      chart.set("cursor", am5xy.XYCursor.new(root, {}));

      this.root = root;
    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }
}
