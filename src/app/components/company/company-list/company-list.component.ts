import { Component, OnInit } from '@angular/core';
import { Company } from "./../../../models/company.model";
import { User } from "./../../../models/user.model";
@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {
  companies:Array<Company> = [];
  user:User;
  constructor() { }

  async ngOnInit() {
    this.companies = await Company.getAllAuthCompanies();

    this.user = User.Auth();
  }

}
