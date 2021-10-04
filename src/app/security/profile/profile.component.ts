import { UserService } from './../../shared/services/user.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  pictureUrl$!: Observable<string | null>;
  userName$!: Observable<string | null>;
  userEmail$!: Observable<string | null>;

  constructor(private user: UserService) {

  }

  ngOnInit(): void {
    this.pictureUrl$ = this.user.pictureUrl$;
    this.userName$ = this.user.userName$;
    this.userEmail$ = this.user.userEmail$;
  }

}
