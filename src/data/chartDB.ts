import { ChartDetails } from "./chartDetails";
import { FirebaseListObservable } from "angularfire2/database";

export class ChartDB {
  chartDetails : FirebaseListObservable<any[]>;
  owner : string;
}