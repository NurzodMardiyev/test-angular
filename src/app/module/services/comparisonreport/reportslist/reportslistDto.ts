export interface Payment {
  id: string;
  number: string;
  fromDate: string;
  toDate: string;
  confPer: string | null;
  status: string;
  statusIn: string;
  confPerType: string;
  docDate: string;
  personId: string;
}

export interface FilterCounts {
  jami: number;
  yangi: number;
  jarayonda: number;
  qabulQilingan: number;
  radEtilgan: number;
}

export interface DataTableInput {
  draw: number;
  start: number;
  length: number;
  search: {
    value: string;
    regex: boolean;
  };
  order: Array<{
    column: number;
    dir: 'asc' | 'desc';
  }>;
  columns: Array<{
    data: string;
    name: string;
    searchable: boolean;
    orderable: boolean;
    search: {
      value: string;
      regex: boolean;
    };
  }>;
}
