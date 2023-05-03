import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapItem } from '../map/map.component';

@Component({
  selector: 'app-map-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-row.component.html',
  styleUrls: ['./map-row.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapRowComponent {
  @Input() row: MapItem[] = [];

  identify(_: any, mapItem: MapItem) {
    return mapItem.type;
  }
}
