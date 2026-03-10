export interface DataTableInput {
  draw: number;
  start: number;
  length: number;
  search: { value: string; regex: boolean };
  order: Array<{ column: number; dir: string }>;
  columns: Column[];
}

export interface Column {
  data: string;
  name: string;
  searchable: boolean;
  orderable: boolean;
  search: {
    value: string;
    regex: boolean
  }
}

export interface ResponseDtoForDataTableOutput<T> {
  data: DataTableOutput<T>;
  message: string;
  status: string;
  success: boolean
}

export interface DataTableOutput<T> {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  totalSum: number;
  data: T[];
}
