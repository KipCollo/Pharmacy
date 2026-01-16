import { NgIf } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {AuthenticationApIsService} from "../services/services/authentication-ap-is.service";
import {SidebarComponent} from "../admin/sidebar/sidebar.component";
import {ChatListComponent} from "../chat-list/chat-list.component";
import {ChatWindowComponent} from "../chat-window/chat-window.component";
import {SideChatComponent} from "../side-chat/side-chat.component";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    SidebarComponent,
    ChatListComponent,
    ChatWindowComponent,
    SideChatComponent
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{

  constructor(
   private authService: AuthenticationApIsService
  ){ }
  logout() {
    const linkColor = document.querySelectorAll("nav-link");
    linkColor.forEach(link => {
      if (window.location.href.endsWith(link.getAttribute("href") || '')) {
        link.classList.add('active');
      }
    })
  }

  isAuthenticated(): any{
    //return this.authService.isAuthenticated();
  }

  ngOnInit(): void {
  }
}
