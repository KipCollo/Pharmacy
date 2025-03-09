import {AfterViewInit, Component} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import Swiper from "swiper";
import {Navigation} from "swiper/modules";



@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    DatePipe,
    RouterLink
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent{
  user: any = {name:"Collins Kipkosgei"};
  orders = [
    { name: 'Order 1', status: 'Pending' },
    { name: 'Order 2', status: 'Shipped' },
    { name: 'Order 3', status: 'Delivered' },
  ];

  constructor( private router: Router) {}

  ngOnInit() {
    // this.authService.getProfile().subscribe(data => {
    //   this.user = data;
    // });
  }

  logout() {
    // this.authService.logout();
    // this.router.navigate(['/login']);
  }

}
