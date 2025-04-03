import {PaymentTypeEnum} from "../enums/payment-type.enum";

export const paymentTypeListConstant = [
  {
    type: PaymentTypeEnum.TimeAndMaterials,
    label: 'paymentType.timeAndMaterialsLabel'
  },
  {
    type: PaymentTypeEnum.FixBid,
    label: 'paymentType.fixedBidLabel'
  }
]
