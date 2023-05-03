import { Injectable } from '@angular/core';
import { Rover } from './rover';
import { SoursesService } from './sourses.service';

@Injectable({
  providedIn: 'root',
})
export class RoversService {
  rovers: Rover[] = [
    {
      id: 0,
      position: { x: 1, y: 1 },
      endPosition: { x: 1, y: 1 },
      payload: 0,
      action: 'wait',
    },
    {
      id: 1,
      position: { x: 0, y: 1 },
      endPosition: { x: 0, y: 1 },
      payload: 0,
      action: 'wait',
    },
  ];

  constructor(private soursesService: SoursesService) {}

  updateRovers() {
    for (const rover of this.rovers) {
      if (rover.action === 'move') {
        if (
          Math.abs(Math.abs(rover.position.x) - Math.abs(rover.endPosition.x)) >
          Math.abs(Math.abs(rover.position.y) - Math.abs(rover.endPosition.y))
        ) {
          if (rover.position.x > rover.endPosition.x) {
            rover.position.x = rover.position.x - 1;
          } else if (rover.position.x < rover.endPosition.x) {
            rover.position.x = rover.position.x + 1;
          }
        } else {
          if (rover.position.y > rover.endPosition.y) {
            rover.position.y = rover.position.y - 1;
          } else if (rover.position.y < rover.endPosition.y) {
            rover.position.y = rover.position.y + 1;
          }
        }
      }
      if (rover.action === 'mining') {
        rover.payload = rover.payload + 1;
        //this.soursesService.sourses$.getValue().sourses[0].payload--;

        // if (this.soursesService.sourses$.getValue().sourses[0].payload <= 0) {
        //   this.soursesService.removeSilver(
        //     this.soursesService.sourses$.getValue().sourses[0].id
        //   );
        // }

        // TODO надо удалить первый источник
      }
      if (rover.action === 'upload') {
        rover.payload = rover.payload - 1;
        this.soursesService.addSilver();

        if (rover.payload === 1) {
          rover.action = 'move';
          rover.endPosition =
            this.soursesService.sourses$.getValue().sourses[0].position;
        }
      }
      /*if (rover.action === 'search') {
        rover.action = 'move';
        rover.endPosition.x === mapSize.x;
        rover.endPosition.x === mapSize.y;
      }*/
      console.log(rover.action);
    }
  }

  miningAlgo() {
    for (const rover of this.rovers) {
      if (rover.action === 'wait') {
        rover.endPosition = {
          ...this.soursesService.sourses$.getValue().sourses[0].position,
        };
        rover.action = 'move';

        return;
      }
      if (rover.action === 'move') {
        if (
          rover.position.x === rover.endPosition.x &&
          rover.position.y === rover.endPosition.y &&
          rover.endPosition.x !== 0 &&
          rover.endPosition.y !== 0
        ) {
          rover.action = 'mining';
          return;
        }
        if (
          rover.position.x === rover.endPosition.x &&
          rover.position.y === rover.endPosition.y &&
          rover.endPosition.x === 0 &&
          rover.endPosition.y === 0 &&
          rover.payload > 0
        ) {
          rover.action = 'upload';

          return;
        }
      }
      if (rover.action === 'mining') {
        if (rover.payload === 10) {
          rover.action = 'move';
          rover.endPosition.x = 0;
          rover.endPosition.y = 0;
          return;
        }
      }
      /*if (
        rover.action === 'upload' &&
        rover.payload === 0 &&
        this.soursesService.sourses$.getValue().knownSourses.length === 0
      ) {
        rover.action = 'search';
        return;
      }*/
    }
  }
}
