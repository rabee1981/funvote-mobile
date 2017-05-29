import { Component, Input } from '@angular/core';
import { ChartDetails } from "../../data/chartDetails";

@Component({
  selector: 'chart-card',
  templateUrl: 'chart-card.html'
})
export class ChartCard {
  @Input() chartDetails : ChartDetails;

  constructor() {}

}
