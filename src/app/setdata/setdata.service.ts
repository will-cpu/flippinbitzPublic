import { Setdata } from './setdata.model';
import { Injectable, asNativeElements } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from "../../environments/environment.prod"
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + "/setdata/";

@Injectable({providedIn: 'root'})
export class SetdataService{
  private setdata: Setdata[] = [];
  private setdataUpdated = new Subject<{setdata: Setdata[], setCount: number }>();
  constructor(private http: HttpClient, private router: Router){}
  private answer: string;

  getSetdata(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string; setdata: any; maxPosts: number}>(BACKEND_URL + queryParams)
      .pipe(
        map(setdataData => {
        return { 
          sets: setdataData.setdata.map(setd => {
          return {
            data: setd.data,
            search: setd.search,
            answer: setd.answer,
            id: setd._id
          };
        }),
        MaxPosts: setdataData.maxPosts
        };
      })
    )
      .subscribe((transformedSetdata) => {
        this.setdata = transformedSetdata.sets;              //updates the services array of data
        this.setdataUpdated.next({
          setdata: [...this.setdata],
          setCount: transformedSetdata.MaxPosts });     //gives a copy to anyone listening
      });
  }

  getSetdataUpdateListener(){
    return this.setdataUpdated.asObservable();
  }

  addSetdata(data: number[], search: number){
    const setdata: Setdata = {id: null, data: data, search: search, answer: null};
    this.http.post<{message: string, setId: string, answer: string, maxPosts: number}>(BACKEND_URL, setdata)
      .subscribe((responseData) => {
        //console.log(responseData.answer);
        this.answer = responseData.answer;
        const id = responseData.setId;
        const ans = responseData.answer;
        const count = responseData.maxPosts;
        setdata.id = id;
        setdata.answer = ans;
        this.setdata.push(setdata);
        this.setdataUpdated.next({setdata: [...this.setdata], setCount: count});
      });
}

getAnswer(){
  return this.answer;
}

  deleteSet(setId: string, count: number){
    this.http.delete<{message: string, count: number}>(BACKEND_URL + setId)
      .subscribe((result) => {
        console.log("setData Deleted");
        const updatedSetdata = this.setdata.filter(set => set.id != setId);
        this.setdata = updatedSetdata;
        this.setdataUpdated.next({setdata: [...this.setdata], setCount: count});
      });

  }

}
