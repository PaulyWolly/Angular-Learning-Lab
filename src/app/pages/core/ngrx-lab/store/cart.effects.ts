import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, timer } from 'rxjs';
import { CartActions } from './cart.actions';
import { SEED_CART } from './cart.state';

/**
 * Effects listen to actions, do async work, then dispatch a new action.
 * Reducers stay pure — no HTTP, no timers, no toasts inside them.
 */
@Injectable()
export class CartEffects {
  private readonly actions$ = inject(Actions);

  readonly loadSeed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadSeed),
      exhaustMap(() =>
        timer(700).pipe(
          map(() => CartActions.loadSeedSuccess({ items: SEED_CART })),
          catchError(() =>
            of(CartActions.loadSeedFailure({ error: 'Seed load failed.' })),
          ),
        ),
      ),
    ),
  );
}
