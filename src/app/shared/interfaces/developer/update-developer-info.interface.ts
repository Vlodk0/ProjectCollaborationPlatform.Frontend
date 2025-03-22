import {DeveloperPositionEnum} from "../../../core/enums/developer-position.enum";

export interface UpdateDeveloperInfoInterface {
  positions: DeveloperPositionEnum;
  hourlyPayment: number;
}
