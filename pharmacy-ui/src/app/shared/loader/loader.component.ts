import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [NgIf,AsyncPipe],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  constructor(public loaderService: LoaderService) {}
}
