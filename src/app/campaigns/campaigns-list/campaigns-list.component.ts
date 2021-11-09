import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-campaigns-list',
  templateUrl: './campaigns-list.component.html',
  styleUrls: ['./campaigns-list.component.css']
})
export class CampaignsListComponent implements OnInit {

  campaigns$!: Observable<string[]>;
  spin = false;
  displayedColumnsCampaigns = null;

  constructor() { }

  ngOnInit(): void {
  }

  selectCampaign(campaign: any) {

  }

  onDelete() {

  }

}
