import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Setdata } from '../setdata.model';
import { SetdataService } from '../setdata.service';
import { AuthService } from 'src/app/auth/auth.service';
import { PageEvent } from '@angular/material';



@Component({
  selector: 'app-setdata-list',
  templateUrl: './setdata-list.component.html',
  styleUrls: ['./setdata-list.component.css']
})
export class SetdataListComponent implements OnInit, OnDestroy {
  setdatas: Setdata[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  userIsAuthenticated = false;
  private authStatusSub: Subscription;

  private setdataSub: Subscription;
  constructor(
    public setdataService: SetdataService,
    private authService: AuthService
    ) {}

  ngOnInit() {
    this.isLoading = true;
    this.setdataService.getSetdata(this.postsPerPage, this.currentPage);
    this.setdataSub = this.setdataService.getSetdataUpdateListener()
      .subscribe((setdata: {setdata: Setdata[], setCount: number}) => {
          this.isLoading = false;
          this.totalPosts = setdata.setCount;
          this.setdatas = setdata.setdata.reverse();
        });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
          });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.setdataService.getSetdata(this.postsPerPage, this.currentPage);
  }

  onDelete(setId: string){
    this.setdataService.deleteSet(setId, this.totalPosts - 1);
    this.totalPosts = this.totalPosts - 1;
  }

  ngOnDestroy(){
    this.setdataSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
