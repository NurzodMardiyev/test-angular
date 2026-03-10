
export interface ResponseDto {
  data: Object;
  message: string;
  status: string;
  success: boolean
}


export interface ResponseDtoError {
  data: {
    errors?: { field: string; message: string }[];
    [key: string]: any;
  };
  message: string;
  status: string;
  success: boolean
}

export interface historyDto {
  id: string;
  insTime: string;
  insUser: string;
  isDelete: boolean;
  updTime: string;
  updUser: string;
  comment: string;
  insUserName: string;
  parentId: string;
  status: string;
}

export interface personDto {
  id: string;
  insTime: string;
  insUser: string;
  isDelete: boolean;
  updTime: string;
  updUser: string;
  email: string;
  firstName: string;
  fullName: string;
  lastName: string;
  legalName: string;
  surName: string;
  phone: string;
  tin: string;
  pin: string;
  personType: string;
  personAdr: string;
}
