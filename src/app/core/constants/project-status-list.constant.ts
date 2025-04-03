import {ProjectStatusEnum} from "../enums/project-status.enum";

export const projectStatusListConstant = [
  {
    type: ProjectStatusEnum.Draft,
    label: 'projectStatus.draftLabel'
  },
  {
    type: ProjectStatusEnum.Active,
    label: 'projectStatus.activeLabel'
  },
  {
    type: ProjectStatusEnum.Ended,
    label: 'projectStatus.endedLabel'
  },
  {
    type: ProjectStatusEnum.Paused,
    label: 'projectStatus.pausedLabel'
  }
]
