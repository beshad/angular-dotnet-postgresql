import { Component, Inject, NgZone, PLATFORM_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import am5index from "@amcharts/amcharts5/index";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";
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
  chart1: am5xy.XYChart;
  series1: am5xy.LineSeries;
  xAxis1: any;

  private rootChart2: am5.Root;
  chart2: am5xy.XYChart;
  series2: am5xy.LineSeries;
  xAxis2: any;

  private rootChart3: am5.Root;
  chart3: am5xy.XYChart;
  series3: am5xy.LineSeries;
  xAxis3: any;

  private rootChart4: am5.Root;
  chart4: am5xy.XYChart;
  series4: am5xy.LineSeries;
  xAxis4: any;

  data;
  options = [];
  selectedOption = new FormControl({});

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
          console.log(this.selectedOption)
        });
      })
    );
  }

  ngAfterViewInit() {
    this.rootChart1 = am5.Root.new("chart-1");
    this.rootChart2 = am5.Root.new("chart-2");
    this.rootChart3 = am5.Root.new("chart-3");
    // this.rootChart4 = am5.Root.new("chart-4");

    this.getLogs()
      .pipe(
        tap((data) => {
          this.calculateAverageOfSomething(data);
          const logs = [];
          data = data[0].message.data;
          data.forEach((d) => {
            logs.push({
              category: d["Finish Time"],
              value: parseInt(d["End Current (A)"]),
            });
          });
          this.browserOnly(() => {
            this.initChart1(logs);
            // this.initChart2(logs);
          });
        })
      )
      .subscribe();
  }

  onChargerChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const data = this.data.find(
      (charger) => charger.chargerSerialNumber === value
    );

    const data1 = data.message.data;
    const logs = [];

    data1.forEach((d) => {
      logs.push({
        category: d["Finish Time"],
        value: parseInt(d["End Current (A)"]),
      });
    });
    this.series1.data.setAll(logs);
    this.xAxis1.data.setAll(logs);
  }

  initChart1(data) {
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

    this.xAxis1 = chart.xAxes.push(
      am5xy.CategoryAxis.new(this.rootChart1, {
        renderer: am5xy.AxisRendererX.new(this.rootChart1, {}),
        categoryField: "category",
      })
    );

    this.xAxis1.get("renderer").labels.template.setAll({
      fill: am5.color(0xffffff),
      fontSize: "10px",
    });
    this.xAxis1.children.push(
      am5.Label.new(this.rootChart1, {
        text: "Charge Finish Time",
        x: am5.p50,
        centerX: am5.p50,
        centerY: am5.p50,
        fontSize: "14px",
        fill: am5.color(0xffffff),
      })
    );
    this.xAxis1.data.setAll(data);

    this.series1 = chart.series.push(
      am5xy.SmoothedXLineSeries.new(this.rootChart1, {
        name: "Series",
        xAxis: this.xAxis1,
        yAxis: yAxis,
        valueYField: "value",
        categoryXField: "category",
      })
    );
    this.series1.data.setAll(data);

    let legend = this.chart1?.children.push(
      am5.Legend.new(this.rootChart1, {})
    );
    legend?.data.setAll(chart.series.values);

    this.chart1?.set("cursor", am5xy.XYCursor.new(this.rootChart1, {}));
    this.chart1?.appear(1000, 100);
  }

  calculateAverageOfSomething(logs) {
    const soh = [];
    const terminationCellVoltage = [];

    logs.forEach((d) => {
      const avg = this.getAvg(d.message.data, "State Of Health (%)");
      soh.push(avg);
      terminationCellVoltage.push(
        this.getAvg(d.message.data, "Energy Returned (kWh)")
      );
    });

    const sum = soh.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    const sum2 = terminationCellVoltage.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
    const avg = sum / soh.length;
    const avg2 = sum2 / terminationCellVoltage.length;
    this.initChart2(avg);
    this.initChart3(avg2);
  }

  getAvg(dataArray, property) {
    const total = dataArray.reduce((sum, item) => {
      const value = parseFloat(item[property]);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);

    const average = total / dataArray.length;
    return average;
  }

  initChart2(soh) {
    this.rootChart2.setThemes([am5themes_Animated.new(this.rootChart2)]);

    var chart = this.rootChart2.container.children.push(
      am5radar.RadarChart.new(this.rootChart2, {
        panX: false,
        panY: false,
        startAngle: -180,
        endAngle: 0,
      })
    );

    var axisRenderer = am5radar.AxisRendererCircular.new(this.rootChart2, {
      innerRadius: -10,
      strokeOpacity: 1,
      strokeWidth: 2,
      strokeGradient: am5.LinearGradient.new(this.rootChart2, {
        stops: [
          { color: am5.color(0xfb7116) },
          { color: am5.color(0xf6d32b) },
          { color: am5.color(0xf4fb16) },
          { color: am5.color(0x19d228) },
        ],
      }),
    });

    var xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(this.rootChart2, {
        maxDeviation: 0,
        min: 0,
        max: 100,
        strictMinMax: true,
        renderer: axisRenderer,
      })
    );

    var axisDataItem = xAxis.makeDataItem({});
    axisDataItem.set("value", 0);

    const hand = am5radar.ClockHand.new(this.rootChart2, {
      pinRadius: 40,
      radius: am5.percent(100),
      innerRadius: 40,
      bottomWidth: 10,
      topWidth: 0,
    });

    hand.pin.setAll({
      fillOpacity: 0,
      strokeOpacity: 1,
      stroke: am5.color(0xffffff),
      strokeWidth: 2,
    });
    hand.hand.setAll({
      fillOpacity: 0,
      strokeOpacity: 1,
      stroke: am5.color(0xffffff),
      strokeWidth: 2,
    });

    const bullet = axisDataItem.set(
      "bullet",
      am5xy.AxisBullet.new(this.rootChart2, {
        sprite: hand,
      })
    );

    const label = chart.radarContainer.children.push(
      am5.Label.new(this.rootChart2, {
        centerX: am5.percent(50),
        textAlign: "center",
        centerY: am5.percent(50),
        fontSize: "1.5em",
      })
    );

    label.set("fill", am5.color(0xffffff));
    const rounded = parseFloat(soh.toFixed(1));
    label.set("text", Math.round(rounded).toString() + "%");

    xAxis.createAxisRange(axisDataItem);

    axisDataItem.get("grid").set("visible", true);
    axisDataItem.get("tick").set("visible", true);

    axisDataItem.animate({
      key: "value",
      to: rounded,
      duration: 800,
      easing: am5.ease.out(am5.ease.cubic),
    });

    chart.appear(1000, 100);
  }

  initChart3(terminationCellVoltage) {
    this.rootChart3.setThemes([am5themes_Animated.new(this.rootChart3)]);

    var chart = this.rootChart3.container.children.push(
      am5radar.RadarChart.new(this.rootChart3, {
        panX: false,
        panY: false,
        startAngle: -180,
        endAngle: 0,
      })
    );

    var axisRenderer = am5radar.AxisRendererCircular.new(this.rootChart3, {
      innerRadius: -10,
      strokeOpacity: 1,
      strokeWidth: 2,
      strokeGradient: am5.LinearGradient.new(this.rootChart3, {
        rotation: 0,
        stops: [
          { color: am5.color(0xfb7116) },
          { color: am5.color(0xf6d32b) },
          { color: am5.color(0xf4fb16) },
          { color: am5.color(0x19d228) },
        ],
      }),
    });

    var xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(this.rootChart3, {
        maxDeviation: 0,
        min: 0,
        max: 10,
        strictMinMax: true,
        renderer: axisRenderer,
      })
    );

    var axisDataItem = xAxis.makeDataItem({});
    axisDataItem.set("value", 0);

    const hand = am5radar.ClockHand.new(this.rootChart3, {
      pinRadius: 40,
      radius: am5.percent(100),
      innerRadius: 40,
      bottomWidth: 7,
      topWidth: 0,
    });

    hand.pin.setAll({
      fillOpacity: 0,
      strokeOpacity: 1,
      stroke: am5.color(0xffffff),
      strokeWidth: 2,
    });
    hand.hand.setAll({
      fillOpacity: 0,
      strokeOpacity: 1,
      stroke: am5.color(0xffffff),
      strokeWidth: 2,
    });

    const bullet = axisDataItem.set(
      "bullet",
      am5xy.AxisBullet.new(this.rootChart3, {
        sprite: hand,
      })
    );

    const label = chart.radarContainer.children.push(
      am5.Label.new(this.rootChart3, {
        centerX: am5.percent(50),
        textAlign: "center",
        centerY: am5.percent(50),
        fontSize: "1.5em",
      })
    );

    label.set("fill", am5.color(0xffffff));
    const rounded = parseFloat(terminationCellVoltage.toFixed(1));
    label.set("text", Math.round(rounded).toString() + "kWh");

    xAxis.createAxisRange(axisDataItem);

    axisDataItem.get("grid").set("visible", true);
    axisDataItem.get("tick").set("visible", true);

    axisDataItem.animate({
      key: "value",
      to: rounded,
      duration: 800,
      easing: am5.ease.out(am5.ease.cubic),
    });

    chart.appear(1000, 100);
  }

  ngOnDestroy() {
    this.browserOnly(() => {
      if (this.rootChart1) {
        this.rootChart1.dispose();
      }
      if (this.rootChart2) {
        this.rootChart2.dispose();
      }
    });
  }
}
