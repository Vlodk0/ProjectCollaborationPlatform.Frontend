import {TaskLabelType} from "../../../core/enums/task-label-type.enum";
import {TaskStatus} from "../../../core/enums/task-status.enum";

export interface FunctionalityBlockInterface {
  id: string;
  taskName: string;
  description: string;
  label: TaskLabelType;
  status: TaskStatus;
  developerId: string;
  projectId: string;
}
