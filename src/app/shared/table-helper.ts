import { Column } from "../models/column";
import { FilterMetadata } from "./models/filter-metadata";
import { LazyLoadEvent } from "./models/lazy-load-event.model";

export class TableHelper{
  records: any[] = [];
  isLoading = false;
  cols: Column[] = [];
  totalRecordsCount = 0;

  constructor(){
  }

  getMaxResultCount(event: LazyLoadEvent): number{
    return event.rows;
  }

  getSkipCount(event: LazyLoadEvent): number{
    return event.first;
  }

}

