import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { NgForm } from '@angular/forms';
import { SetdataService } from '../setdata.service';
import { Subscription } from 'rxjs';
import { Setdata } from '../setdata.model';


@Component({
  selector: 'app-setdata-create',
  templateUrl: './setdata-create.component.html',
  styleUrls: ['./setdata-create.component.css']
})
export class SetdataCreateComponent implements OnInit, OnDestroy {

  form: FormGroup;
  answer: string;
  arr: number[];
  prevArr: number[];
  search: number;
  private setdataSub: Subscription;
  constructor(public setdataService: SetdataService) {}

  ngOnInit(){
    this.form = new FormGroup({
      data: new FormControl(null, {validators: [Validators.required]}),
      search: new FormControl(null, { validators: [Validators.required]})
    });
  }

  onAddSetdata() {
    if(this.form.invalid) {
      return;
    }
    //console.log(this.prevArr.toString() === this.arr.toString());
    this.arr = this.form.value.data;
    console.log(this.prevArr);
    if((this.search === +this.form.value.search) && (this.arr.toString() === this.prevArr.toString())){
      return;
    }
    this.arr = this.form.value.data.split(' ').map(Number);
    this.prevArr = this.form.value.data.split(' ').map(Number);
    this.search = +this.form.value.search;
    this.setdataService.addSetdata(this.arr, this.search);
    this.setdataSub = this.setdataService.getSetdataUpdateListener()
      .subscribe((setdata) => {
          this.answer = setdata.setdata[setdata.setdata.length - 1].answer;
        });

    //console.log(this.form);
    //this.form.reset();
  }

  ngOnDestroy() {
    if(this.setdataSub){
    this.setdataSub.unsubscribe();
    }
  }
}
