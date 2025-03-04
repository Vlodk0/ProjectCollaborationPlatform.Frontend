import {AddressInterface} from "../developer/address.interface";
import {ProjectInterface} from "./project.interface";

export interface ProjectOwnerInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
  isDeleted: boolean;
  bio: string;
  avatarName: string;
  address: AddressInterface;
  projects: Array<ProjectInterface>;
}
