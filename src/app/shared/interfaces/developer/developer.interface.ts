import {AddressInterface} from "./address.interface";
import {TechnologyInterface} from "../project/technology.interface";
import {FrameworkInterface} from "../project/framework.interface";

export interface DeveloperInterface {
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
  isDeleted: boolean;
  bio: string;
  address: AddressInterface;
  technologies: Array<TechnologyInterface>;
  frameworks: Array<FrameworkInterface>;
  avatarName?: string;
}
