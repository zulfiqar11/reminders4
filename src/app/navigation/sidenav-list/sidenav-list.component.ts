import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {

  user$!: Observable<any>;
  isLoggedOut$!: Observable<boolean>;
  isLoggedIn$!: Observable<boolean>;
  userName$!: Observable<string | null>;

  @Output() sideNavClose = new EventEmitter
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.user$ = this.userService.user$;
    this.isLoggedOut$ = this.userService.isLoggedOut$;
    this.isLoggedIn$ = this.userService.isLoggedIn$;
    this.userName$ = this.userService.userName$;
  }

  logout() {
    this.userService.logout();
    this.router.navigateByUrl("/login");
  }
}
