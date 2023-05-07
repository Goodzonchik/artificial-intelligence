import { Injectable } from '@angular/core';
import { Position, Rover } from './rover';
import { SoursesService } from './sourses.service';
import { lengthTwoNumer } from './shared/length-two-number';

@Injectable({
  providedIn: 'root',
})
export class RoversService {
  base: Position = { x: 70, y: 35 };

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

  roverAction() {
    for (const rover of this.rovers) {
      if (rover.action === 'move') {
        const axis =
          lengthTwoNumer(rover.position.x, rover.endPosition.x) >
          lengthTwoNumer(rover.position.y, rover.endPosition.y)
            ? 'x'
            : 'y';

        this.moveToNextCell(rover, axis);
      }
      if (rover.action === 'mining') {
        rover.payload = rover.payload + 1;
        this.soursesService.sourses$.getValue().sourses[0].payload--;

        // if (this.soursesService.sourses$.getValue().sourses[0].payload <= 0) {
        //   this.soursesService.removeSilver(
        //     this.soursesService.sourses$.getValue().sourses[0].id
        //   );
        // }

        // TODO надо удалить первый источник

        return;
      }
      if (rover.action === 'upload') {
        rover.payload = rover.payload - 1;
        this.soursesService.addSilver();

        if (rover.payload === 0) {
          rover.action = 'move';
          rover.endPosition = {
            ...this.soursesService.sourses$.getValue().sourses[0].position,
          };
        }
      }
      /*if (rover.action === 'search') {
        rover.action = 'move';
        rover.endPosition.x === mapSize.x;
        rover.endPosition.x === mapSize.y;
      }*/
    }
  }

  miningAlgo() {
    for (const rover of this.rovers) {
      if (rover.action === 'wait') {
        this.setRoverEndPosition(
          rover,
          this.soursesService.sourses$.getValue().sourses[0].position
        );
        rover.action = 'move';

        return;
      }
      if (rover.action === 'move') {
        if (
          this.checkPosition(rover.position, rover.endPosition) &&
          !this.checkPosition(rover.position, this.base)
        ) {
          rover.action = 'mining';
          return;
        }
        if (
          this.checkPosition(rover.position, rover.endPosition) &&
          this.checkPosition(rover.position, this.base) &&
          rover.payload > 0
        ) {
          rover.action = 'upload';

          return;
        }
      }
      if (rover.action === 'mining') {
        if (rover.payload === 10) {
          this.setRoverEndPosition(rover, this.base);
          rover.action = 'move';
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

  private checkPosition(
    startPosition: Position,
    endPosition: Position
  ): boolean {
    return (
      startPosition.x === endPosition.x && startPosition.y === endPosition.y
    );
  }

  private setRoverEndPosition(rover: Rover, position: Position) {
    rover.endPosition = { ...position };
  }

  private moveToNextCell(rover: Rover, point: 'x' | 'y') {
    if (rover.position[point] > rover.endPosition[point]) {
      rover.position[point] = rover.position[point] - 1;
    } else if (rover.position[point] < rover.endPosition[point]) {
      rover.position[point] = rover.position[point] + 1;
    }
  }
}
