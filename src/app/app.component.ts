import { Component, OnInit } from '@angular/core';
import { UserInfo } from './models/user-info.model';
import { UserService } from './services/user.service';
import { TableHelper } from './shared/table-helper';
import { LazyLoadEvent } from './shared/models/lazy-load-event.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  tableHelper: TableHelper = new TableHelper();
  selectedUsers: UserInfo[] = [];

  constructor(private userService: UserService){}

  ngOnInit(): void{
    this.tableHelper.cols = [
      {
        name: 'First Name',
        field: 'first_name',
        width: 20
      },
      {
        name: 'Last Name',
        field: 'last_name',
        width: 20
      },
      {
        name: 'Email',
        field: 'email',
        width: 25
      },
      {
        name: 'Gender',
        field: 'gender',
        width: 15
      },
      {
        name: 'Ip Address',
        field: 'ip_address',
        width: 20
      }
    ];
    this.getData({
      rows: 30,
      first: 0
    });
  }

  getData(event: LazyLoadEvent): void{
    if (event.first === 0){
      this.tableHelper.records = [];
    }

    this.tableHelper.isLoading = true ;

    this.userService.getUsers(
      event.globalFilter,
      event.filters,
      event.rows,
      event.first
    ).subscribe((res: any) => {
          this.tableHelper.isLoading = false;
          if (res === undefined || res === null || res.length === 0){
            return;
          }
          this.tableHelper.records.push(...res);
    });
  }

}
