import {ApiUrls} from "./apiConfigDto";

const MAIN_URL = 'http://192.168.224.18:9090/services';

export const apiConfigData: ApiUrls[] = [
  /** Module */
  {
    module: "services",
    host: MAIN_URL,
    ssl: false,
    active: true,
    list: [
      {
        url: "/create/revise",
        method: "POST",
        label: "create_revise",
        comment: "solishtiruv dalolatnomalar yaratish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },
      {
        url: "/update/revise",
        method: "PATCH",
        label: "update_revise",
        comment: "solishtiruv dalolatnomalar yaratish",
        active: true,
        showSuccess: true,
        showWarning: true,
        roles: []
      },

      {
        url: "/datatable/revise",
        method: "POST",
        label: "datatable_revise",
        comment: "solishtiruv dalolatnomalar masul hodimlar",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
      {
        url: "/spto-payment/route-payment/pintin",
        method: "POST",
        label: "pintin",
        comment: "tinga sorov yuborish",
        active: true,
        showSuccess: false,
        showWarning: true,
        roles: []
      },
    ]
  }
]
