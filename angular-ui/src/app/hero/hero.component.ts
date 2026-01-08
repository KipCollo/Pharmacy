import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements OnInit,OnDestroy {

  images: string[] = [
    '../public/hero.jpg',
    '../public/hero1.jpg',
    '../public/hero2.jpg',
  ];
  currentImageIndex = 0;
  currentImage = this.images[0];
  intervalId: any;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      this.currentImage = this.images[this.currentImageIndex];
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

}
