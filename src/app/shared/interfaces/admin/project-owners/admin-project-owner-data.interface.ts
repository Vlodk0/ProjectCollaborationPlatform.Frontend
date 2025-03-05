import {AddressInterface} from "../../developer/address.interface";
import {FeedbackInterface} from "../../feedback/feedback.interface";

export interface AdminProjectOwnerDataInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
  isDeleted: boolean;
  bio: string;
  avatarName: string;
  projectsCount: number;
  address: AddressInterface;
  feedbacks: Array<FeedbackInterface>;
}
