import {TaskLabelType} from "../../../core/enums/task-label-type.enum";

export interface CreateFunctionalityBlockInterface {
  taskName: string;
  description: string;
  label: TaskLabelType
}
