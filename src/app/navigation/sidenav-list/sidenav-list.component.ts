import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {

  user$!: Observable<any>;
  @Output() sideNavClose = new EventEmitter
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.user$ = this.userService.user$;
  }

  onSideNavClose() {
    this.sideNavClose.emit();
  }

}
