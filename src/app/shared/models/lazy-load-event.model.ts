import { FilterMetadata } from "./filter-metadata";

export interface LazyLoadEvent{
  rows: number;
  first: number;
  filters?: FilterMetadata[];
  globalFilter?: any;
}
