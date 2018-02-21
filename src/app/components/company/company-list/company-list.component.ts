import { Component, OnInit } from '@angular/core';
import { Company } from "./../../../models/company.model";

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {
  companies;
  constructor() { }

  async ngOnInit() {
    this.companies = await Company.getAllAuthCompanies();
  }

}
