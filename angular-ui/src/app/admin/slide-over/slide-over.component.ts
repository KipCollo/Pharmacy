import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-slide-over',
  standalone: true,
  imports: [],
  templateUrl: './slide-over.component.html',
  styleUrl: './slide-over.component.css'
})
export class SlideOverComponent {
  @Input() open = false;
  @Input() data: any;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

}
