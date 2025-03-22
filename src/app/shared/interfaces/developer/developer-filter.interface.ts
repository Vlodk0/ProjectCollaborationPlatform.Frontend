import {DeveloperPositionEnum} from "../../../core/enums/developer-position.enum";

export interface DeveloperFilterInterface {
  selectedCountry: string[];
  selectedTechnologies: string[];
  selectedFrameworks: string[];
  selectedPositions: DeveloperPositionEnum[],
  selectedFrom: number;
  selectedTo: number;
}
