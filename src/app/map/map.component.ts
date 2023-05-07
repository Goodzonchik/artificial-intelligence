import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Rover } from '../rover';
import { RoversService } from '../rovers.service';
import { SoursesService } from '../sourses.service';
import { MapRowComponent } from '../map-row/map-row.component';
import { vectorSize } from '../shared/vector-size';

export type MapItem = {
  type: '▒' | '░' | '█' | '@' | '◙' | '~' | '▓';
  styleClass: 'green' | 'brown' | 'silver' | 'gold' | 'base' | 'blue' | 'sand';
  isOpen: boolean;
};

const blocks: Record<number, MapItem> = {
  0: { type: '▒', styleClass: 'green', isOpen: false },
  1: { type: '░', styleClass: 'brown', isOpen: false },
  2: { type: '~', styleClass: 'blue', isOpen: false },
  3: { type: '▓', styleClass: 'sand', isOpen: false },
  //4: { type: '~', styleClass: 'blue', isOpen: false },
};

const sourse: Record<number, MapItem> = {
  0: { type: '█', styleClass: 'silver', isOpen: false },
};

const actors: Record<number, MapItem> = {
  0: { type: '█', styleClass: 'gold', isOpen: true },
  1: { type: '◙', styleClass: 'base', isOpen: true },
};

export const mapSize = {
  x: 150,
  y: 50,
};

export const initMap: MapItem[][] = [];

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, MapRowComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {
  map$: BehaviorSubject<MapItem[][]> = new BehaviorSubject<MapItem[][]>([]);
  rovers: Rover[] = this.roversService.rovers;

  base = { x: 0, y: 0 };

  constructor(
    private roversService: RoversService,
    private soursesService: SoursesService
  ) {
    this.generateMap();
    this.drawSourse();
    this.drawRower();
  }

  ngOnInit() {
    setInterval(() => {
      this.roversService.roverAction();
      this.roversService.miningAlgo();
      this.openWorld();
      this.drawRower();
    }, 10);
  }

  generateMap() {
    const biomenters = this.generateBiomSeed();
    for (let i = 0; i < mapSize.x; i++) {
      initMap[i] = this.generateMapRow(mapSize.y, i, biomenters);
    }

    this.setBase();
  }

  setBase(): void {
    initMap[this.roversService.base.x][this.roversService.base.y] = actors[1];
  }

  generateMapRow(size: number, x: number, biomenters: any[]): MapItem[] {
    const row: MapItem[] = [];

    for (let j = 0; j < size; j++) {
      let biom = biomenters[0];
      let biomLength = vectorSize(biomenters[0].position, { x, y: j });

      for (let i = 1; i < biomenters.length; i++) {
        const vector = vectorSize(biomenters[i].position, { x, y: j });

        if (vector < biomLength) {
          biom = biomenters[i];
          biomLength = vector;
        }
      }

      const blockType = biom.blockType;

      row.push(blocks[blockType]);
    }

    return row;
  }

  drawRower() {
    const newMap = structuredClone(initMap);

    for (const rover of this.rovers) {
      newMap[rover.position.x][rover.position.y] = { ...actors[0] };
    }

    this.map$.next(newMap);
  }

  openWorld() {
    const viewSize = 2;
    function minCoord(currentCord: number, size: number) {
      return currentCord - size >= 0 ? currentCord - size : 0;
    }

    function maxCoord(
      currentCord: number,
      size: number,
      mapSizeLength: number
    ) {
      return currentCord + size <= mapSizeLength
        ? currentCord + size
        : mapSizeLength;
    }

    for (const rover of this.rovers) {
      const minX = minCoord(rover.position.x, viewSize);
      const minY = minCoord(rover.position.y, viewSize);
      const maxX = maxCoord(rover.position.x, viewSize, mapSize.x);
      const maxY = maxCoord(rover.position.y, viewSize, mapSize.y);

      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          initMap[x][y] = {
            ...initMap[x][y],
            isOpen: true,
          };

          // TODO
          //if (initMap[x][y].type === '█') {
          //  this.soursesService.addSourses({ x, y }, true);
          //}
        }
      }
    }
  }

  drawSourse() {
    const sourses = [];
    const getSoursePosition = () => ({
      x: Math.floor(Math.random() * mapSize.x),
      y: Math.floor(Math.random() * mapSize.y),
    });

    for (let i = 0; i < 10; i++) {
      const position = getSoursePosition();

      sourses.push(position);
      this.soursesService.addSourses(position);
      initMap[position.x][position.y] = sourse[0];
    }
  }

  generateBiomSeed(): any[] {
    const biomCentres = [];
    const getSoursePosition = () => ({
      x: Math.floor(Math.random() * mapSize.x),
      y: Math.floor(Math.random() * mapSize.y),
    });

    for (let i = 0; i < 10; i++) {
      const position = getSoursePosition();

      const blockType = Math.floor(Math.random() * 4);

      biomCentres.push({ position, blockType });
    }

    return biomCentres;
  }

  identify(index: any) {
    return index;
  }
}
