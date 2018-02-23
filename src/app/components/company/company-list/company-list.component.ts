import { Component, OnInit } from '@angular/core';
import { Company } from "./../../../models/company.model";

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {
  companies:Array<Company> = [];
  constructor() { }

  async ngOnInit() {
    this.companies = await Company.getAllAuthCompanies();

    let company1 = Company.find({'name':"Parcel Pending"});
    console.log('company 1', company1);
    let company = Company.find({'test.name':"test"})
    console.log('company', company);
  }

}
