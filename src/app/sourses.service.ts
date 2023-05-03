import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Position } from './rover';

@Injectable({
  providedIn: 'root',
})
export class SoursesService {
  sourses$ = new BehaviorSubject<any>({
    silver: 0,
    sourses: [],
    knownSourses: [],
  });

  addSourses(position: Position, known: boolean = false) {
    const newSourses = {
      silver: this.sourses$.getValue().silver,
      sourses: [
        ...this.sourses$.getValue().sourses,
        {
          id: this.sourses$.getValue().sourses.length,
          // TODO здесь нужно увеличить до 500
          payload: Math.floor(Math.random() * 10),
          position,
        },
      ],
      knownSourses: [...this.sourses$.getValue().knownSourses],
    };

    this.sourses$.next(newSourses);
  }

  addSilver() {
    const newSourses = {
      silver: this.sourses$.getValue().silver + 1,
      sourses: this.sourses$.getValue().sourses,
    };

    this.sourses$.next(newSourses);
  }

  removeSilver(id: number) {
    const newSourses = {
      silver: this.sourses$.getValue().silver,
      sourses: [
        ...this.sourses$
          .getValue()
          .sourses.filter((sourse: any) => sourse.id !== id),
      ],
    };

    this.sourses$.next(newSourses);
  }
}
