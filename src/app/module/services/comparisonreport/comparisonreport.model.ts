import {ReviseEnum} from '../../../service/enums/ReviseStatus';
import ReviseStatus = ReviseEnum.ReviseStatus;
import ReviseStatusIn = ReviseEnum.ReviseStatusIn;
import ConfPersonType = ReviseEnum.ConfPersonType;

export interface ReviseAppReq {
  id?: string;               // create paytida optional
  personId?: string;
  number?: string;

  docDate?: string;          // LocalDate → ISO string (yyyy-MM-dd)
  fromDate?: string;         // LocalDate → ISO string
  toDate?: string;           // LocalDate → ISO string

  status?: ReviseStatus;
  statusIn?: ReviseStatusIn;

  confPer?: string;
  confPerType?: ConfPersonType;
}

















export interface Payment {
  id: number;
  sana: string;
  hujjatRaqami: string;
  hujjatTuri: string;
  byudRaqami: string;
  tmzDebet: number;
  tmzKredit: number;
  bojxonaDebet: number;
  bojxonaKredit: number;
}

export interface ResponsiblePerson {
  id?: number;
  fullName?: string;
  position?: string;
  phone?: string;
  email?: string;
  [key: string]: any;
}
