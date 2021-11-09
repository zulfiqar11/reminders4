import { DataService } from 'src/app/shared/services/data.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Campaign } from 'src/app/shared/model/reminder';

@Component({
  selector: 'app-campaigns-list',
  templateUrl: './campaigns-list.component.html',
  styleUrls: ['./campaigns-list.component.css']
})
export class CampaignsListComponent implements OnInit {

  campaigns$!: Observable<Campaign[]>;
  spin = false;
  displayedColumnsCampaigns: string[] = ['id','campaignName','frequency', 'time', 'message'];

  constructor(private dataService: DataService<Campaign>) {
    this.dataService.Url('api/campaigns');
  }

  ngOnInit(): void {
    this.campaigns$ = this.dataService.get();
  }

  selectCampaign(campaign: any) {

  }

  onDelete() {

  }

}
