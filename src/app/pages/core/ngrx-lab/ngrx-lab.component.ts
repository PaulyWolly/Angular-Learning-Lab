import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { CRUMB_CORE, CRUMB_HOME } from '../../../shared/directives/lesson-breadcrumb/crumb-presets';
import { LessonBreadcrumbComponent } from '../../../shared/directives/lesson-breadcrumb/lesson-breadcrumb.component';
import { LessonSyntaxComponent } from '../../../shared/lesson-syntax/lesson-syntax.component';
import { ToastService } from '../../../shared/toast/toast.service';
import { LabCartSignalStore } from './cart.signal-store';
import { CartActions } from './store/cart.actions';
import { CATALOG, CatalogItem } from './store/cart.state';
import {
  selectCartError,
  selectCartItemCount,
  selectCartItems,
  selectCartStatus,
  selectCartTotal,
} from './store/cart.selectors';

@Component({
  selector: 'app-ngrx-lab',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, LessonBreadcrumbComponent, LessonSyntaxComponent],
  providers: [LabCartSignalStore],
  templateUrl: './ngrx-lab.component.html',
  styleUrl: './ngrx-lab.component.scss',
})
export class NgrxLabComponent {
  private readonly store = inject(Store);
  private readonly toast = inject(ToastService);

  readonly crumbs = [CRUMB_HOME, CRUMB_CORE, { label: 'NgRx' }];
  readonly catalog = CATALOG;
  readonly signalCart = inject(LabCartSignalStore);

  readonly items = this.store.selectSignal(selectCartItems);
  readonly itemCount = this.store.selectSignal(selectCartItemCount);
  readonly total = this.store.selectSignal(selectCartTotal);
  readonly status = this.store.selectSignal(selectCartStatus);
  readonly error = this.store.selectSignal(selectCartError);

  /** Rolling log of dispatched action types (classic Store only). */
  readonly actionLog = signal<string[]>([]);

  add(product: CatalogItem): void {
    this.dispatch(CartActions.addItem(product), product.name);
  }

  decrement(id: string): void {
    this.dispatch(CartActions.decrementItem({ id }));
  }

  remove(id: string): void {
    this.dispatch(CartActions.removeItem({ id }));
  }

  clear(): void {
    this.dispatch(CartActions.clear());
  }

  loadSeed(): void {
    this.dispatch(CartActions.loadSeed(), 'effect ~700ms');
  }

  private dispatch(action: Action, detail?: string): void {
    this.store.dispatch(action);
    this.actionLog.update((rows) =>
      [`${action.type}${detail ? ` · ${detail}` : ''} @ ${new Date().toLocaleTimeString()}`, ...rows].slice(
        0,
        6,
      ),
    );
    this.toast.info('dispatch', action.type);
  }

  readonly installTpl = `<!-- app.config.ts — empty root store + DevTools -->
provideStore(),
provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })`;

  readonly installTs = `npm install @ngrx/store @ngrx/effects @ngrx/signals @ngrx/store-devtools

// app.config.ts
import { isDevMode } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};

// Feature slice on the lazy /core/ngrx route
providers: [
  provideState('labCart', cartReducer),
  provideEffects(CartEffects),
]`;

  readonly installModal = `import { isDevMode } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { cartReducer } from './store/cart.reducer';
import { CartEffects } from './store/cart.effects';

// Root (app.config.ts) — one state container for the app
provideStore(),
provideStoreDevtools({
  maxAge: 25,
  logOnly: !isDevMode(),
  connectInZone: true,
}),

// Feature (lazy /core/ngrx) — one state slice (demo key 'labCart')
export const NGRX_ROUTES: Routes = [{
  path: '',
  providers: [
    provideState('labCart', cartReducer),
    provideEffects(CartEffects),
  ],
  loadComponent: () => import('./ngrx-lab.component').then(m => m.NgrxLabComponent),
}];`;

  readonly storeTpl = `<button (click)="add(product)">Add {{ product.name }}</button>
<p>count = {{ itemCount() }} · total = {{ total() | currency }}</p>
@for (item of items(); track item.id) {
  <span>{{ item.name }} × {{ item.qty }}</span>
  <button (click)="decrement(item.id)">−</button>
}`;

  readonly storeTs = `readonly store = inject(Store);
readonly items = this.store.selectSignal(selectCartItems);
readonly itemCount = this.store.selectSignal(selectCartItemCount);
readonly total = this.store.selectSignal(selectCartTotal);

add(product: CatalogItem) {
  this.store.dispatch(CartActions.addItem(product));
}`;

  readonly storeModal = `import { createActionGroup, emptyProps, props, createReducer, on, Store } from '@ngrx/store';

// Demo domain = snack list. Same pattern for todos, filters, auth session…
export const CartActions = createActionGroup({
  source: 'Lab Cart',
  events: {
    'Add Item': props<{ id: string; name: string; price: number }>(),
    'Decrement Item': props<{ id: string }>(),
    Clear: emptyProps(),
  },
});

export const cartReducer = createReducer(
  { items: [] as CartItem[] },
  on(CartActions.addItem, (state, product) => ({
    ...state,
    items: addToCart(state.items, product), // new array — never mutate
  })),
  on(CartActions.decrementItem, (state, { id }) => ({
    ...state,
    items: decrementCart(state.items, id),
  })),
  on(CartActions.clear, (state) => ({ ...state, items: [] })),
);

// Component
readonly items = inject(Store).selectSignal(selectCartItems);
this.store.dispatch(CartActions.addItem(product));`;

  readonly effectsTpl = `<button (click)="loadSeed()" [disabled]="status() === 'loading'">
  Load seed (async state)
</button>
<span class="chip">{{ status() }}</span>`;

  readonly effectsTs = `@Injectable()
export class CartEffects {
  private readonly actions$ = inject(Actions);

  readonly loadSeed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadSeed),
      exhaustMap(() =>
        timer(700).pipe(
          map(() => CartActions.loadSeedSuccess({ items: SEED_CART })),
        ),
      ),
    ),
  );
}`;

  readonly effectsModal = `import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, timer } from 'rxjs';

@Injectable()
export class CartEffects {
  private readonly actions$ = inject(Actions);

  readonly loadSeed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadSeed),
      // Ignore extra clicks while the fake request is in flight
      exhaustMap(() =>
        timer(700).pipe(
          map(() => CartActions.loadSeedSuccess({ items: SEED_CART })),
        ),
      ),
    ),
  );
}

// Route providers
provideEffects(CartEffects);

// Reducer handles the *result* — still pure
on(CartActions.loadSeed, (state) => ({ ...state, status: 'loading' })),
on(CartActions.loadSeedSuccess, (state, { items }) => ({
  ...state, status: 'loaded', items,
})),`;

  readonly signalTpl = `<p>{{ signalCart.itemCount() }} items · {{ signalCart.total() | currency }}</p>
<button (click)="signalCart.add(product)">Add</button>
<button (click)="signalCart.clear()">Clear</button>`;

  readonly signalTs = `export const LabCartSignalStore = signalStore(
  withState({ items: [] as CartItem[] }),
  withComputed(({ items }) => ({
    itemCount: computed(() => cartItemCount(items())),
    total: computed(() => cartTotal(items())),
  })),
  withMethods((store) => ({
    add(product: CatalogItem) {
      patchState(store, (s) => ({ items: addToCart(s.items, product) }));
    },
  })),
);

readonly signalCart = inject(LabCartSignalStore);`;

  readonly signalModal = `import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export const LabCartSignalStore = signalStore(
  withState({ items: [] as CartItem[] }),
  withComputed(({ items }) => ({
    itemCount: computed(() => items().reduce((n, i) => n + i.qty, 0)),
    total: computed(() => items().reduce((sum, i) => sum + i.price * i.qty, 0)),
  })),
  withMethods((store) => ({
    add(product: CatalogItem) {
      patchState(store, (state) => ({
        items: addToCart(state.items, product),
      }));
    },
    clear() {
      patchState(store, { items: [] });
    },
  })),
);

@Component({
  providers: [LabCartSignalStore], // component-scoped — independent of classic Store
})
export class NgrxLabComponent {
  readonly signalCart = inject(LabCartSignalStore);
}`;
}
