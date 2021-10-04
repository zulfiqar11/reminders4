import { UserService } from '../../shared/services/user.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/model/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() public sideNavToggle = new EventEmitter();
  user$!: Observable<User>;
  isLoggedIn$!: Observable<boolean>;
  isLoggedOut$!: Observable<boolean>;
  pictureUrl$!: Observable<string|null>;


  constructor(private user: UserService, private router: Router) { }

  ngOnInit(): void {

    this.user$ = this.user.user$;
    this.isLoggedIn$ = this.user.isLoggedIn$;
    this.isLoggedOut$ = this.user.isLoggedOut$;
    this.pictureUrl$ = this.user.pictureUrl$;

    this.isLoggedIn$.subscribe(l => console.log('loggedin', l));
    this.pictureUrl$.subscribe(p => console.log('picture url', p));
  }

  onToggleSidenav() {
    this.sideNavToggle.emit();
  }

  logout() {
    this.user.logout();
    this.router.navigateByUrl("/login");
  }

}
