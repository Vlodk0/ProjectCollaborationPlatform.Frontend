import {AddressInterface} from "../../developer/address.interface";
import {FeedbackInterface} from "../../feedback/feedback.interface";

export interface AdminProjectOwnerDataInterface {
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
  isDeleted: boolean;
  bio: string;
  avatarName: string;
  address: AddressInterface;
  feedbacks: Array<FeedbackInterface>;
}
