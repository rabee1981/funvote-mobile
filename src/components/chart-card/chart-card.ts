import { Component, Input } from '@angular/core';
import { ChartDetails } from "../../data/chartDetails";
import { ChartService } from "../../services/chart.service";

@Component({
  selector: 'chart-card',
  templateUrl: 'chart-card.html'
})
export class ChartCard {
  @Input() chartDetails;
  @Input() owner;
  @Input() justShow = false;

  constructor(private chartService : ChartService) {}
  onDelete(){
    this.chartService.deleteChart(this.chartDetails.$key);
  }

}
