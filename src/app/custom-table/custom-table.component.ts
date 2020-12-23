import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { Column } from '../models/column';
import { FilterMetadata } from '../shared/models/filter-metadata';
import { LazyLoadEvent } from '../shared/models/lazy-load-event.model';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.css']
})
export class CustomTableComponent implements OnInit {

  // props
  @Input()  values: any[]                           = [];
  @Input()  cols: Column[]                          = [];
  @Input()  emptyMessage                            = 'No data found.';
  @Input()  loading                                 = false;
  @Input()  rows                                    = 30;
  @Input()  selection: any[]                        = [];
  @Output() selectionChange: EventEmitter<any>      = new EventEmitter();
  @Output() onLazyLoad: EventEmitter<LazyLoadEvent> = new EventEmitter();

  // state
  selectedRecords: any[]               = [];
  checkAll                             = false;
  globalFilter                         = '';
  filters: FilterMetadata[]            = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  lazyLoad(event: LazyLoadEvent): void {
    this.onLazyLoad.emit(event);
  }

  // request 01 -	Support infinitive load (scroll down to load more item to list)
  onScroll(e: any): void{
    const scrollTop    = e.target.scrollTop;
    const clientHeight = e.target.clientHeight;
    const scrollHeight = e.target.scrollHeight;
    const percent      = (scrollTop + clientHeight ) * 100 / scrollHeight;
    // when scroll down to x% page => get new data
    if (percent === 100 && !this.loading){
        const event: LazyLoadEvent = {
          rows: this.rows,
          first: this.values.length,
          filters: this.filters,
          globalFilter: this.globalFilter
        };
        this.lazyLoad(event);
    }
  }

  // request 03 - multiple selection (check all / uncheck all)
  selectRecord(checked: boolean, record: any): void{
    if (checked){
      // add new record to selection and check all if this is a last record of list
      this.selection.push(record);
      if (this.selection.length === this.values.length){
          this.checkAll = true;
      }
    }else{
      // remove record from selection and uncheck checkall-button
      const indexRecord = this.selection.findIndex( x => x === record);
      this.selection.splice(indexRecord, 1);
      this.checkAll = false;
    }
    this.selectionChange.emit(this.selection);
  }

  selectAll(checked: boolean): void{
    const allCheckBox = document.getElementsByName('cb-row');
    if (checked){
      // check all
      this.selection = [...this.values];
      allCheckBox.forEach((x: any) => x.checked = true);
    }else{
      // uncheck all
      this.selection = [];
      allCheckBox.forEach((x: any) => x.checked = false);
    }
    this.selectionChange.emit(this.selection);
  }

  // request 02 -	Support filter by multiple column

  // if you change the input filter by field then this method will be called
  filter(e: any, field: string): void {
    const filterItem: FilterMetadata = {
      key: field,
      value: e
    };

    const index = this.filters.findIndex(x => x.key === field);
    if ( index === -1){
      this.filters.push(filterItem);
    }else{
      this.filters[index] = filterItem;
    }

    const event: LazyLoadEvent = {
      rows: this.rows,
      first: 0,
      filters: this.filters,
      globalFilter: this.globalFilter
    };
    this.lazyLoad(event);
  }

  // if you change the input filter global then this method will be called
  filterGlobal(e: any): void{
    const event: LazyLoadEvent = {
      rows: this.rows,
      first: 0,
      filters: this.filters,
      globalFilter: this.globalFilter
    };
    this.lazyLoad(event);
  }
}
