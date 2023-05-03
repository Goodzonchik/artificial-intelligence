import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MapComponent } from './map/map.component';
import { SoursesService } from './sourses.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [MapComponent, CommonModule],
  selector: 'artificial-intelligence-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  sourses$ = this.soursesService.sourses$;

  constructor(private soursesService: SoursesService) {}
}
