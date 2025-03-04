import {AddressInterface} from "../../developer/address.interface";
import {TechnologyInterface} from "../../project/technology.interface";
import {FrameworkInterface} from "../../project/framework.interface";

export interface AdminDeveloperDataInterface {
  id: string
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
  createdTimeStamp: string;
  updatedTimeStamp: string;
}
