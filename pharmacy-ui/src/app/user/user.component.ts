import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {UserResponse} from "../services/models/user-response";
import {CustomersApIsService} from "../services/services/customers-ap-is.service";
import {jwtDecode} from "jwt-decode";
import {TokenService} from "../services/token/token.service";

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
export class UserComponent implements OnInit{
  user: UserResponse = {};

  orders = [
    { name: 'Order 1', status: 'Pending' },
    { name: 'Order 2', status: 'Shipped' },
    { name: 'Order 3', status: 'Delivered' },
  ];

  constructor( private router: Router,
               private customerService:CustomersApIsService,
               ) {
  }

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
     this.customerService.getCurrentCustomer().subscribe(data => {
       this.user = data;
     },(error) => {
      console.error('Error fetching user data:', error);
    })
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
