import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import {
  addToCart,
  CartState,
  cartItemCount,
  cartTotal,
  CatalogItem,
  decrementCart,
  initialCartState,
  removeFromCart,
} from './store/cart.state';

/**
 * SignalStore — same snack cart, no actions/reducers.
 * Provide it on the component so this basket is independent of the classic Store.
 */
export const LabCartSignalStore = signalStore(
  withState<CartState>(initialCartState),
  withComputed(({ items }) => ({
    itemCount: computed(() => cartItemCount(items())),
    total: computed(() => cartTotal(items())),
  })),
  withMethods((store) => ({
    add(product: CatalogItem): void {
      patchState(store, (state) => ({ items: addToCart(state.items, product) }));
    },
    decrement(id: string): void {
      patchState(store, (state) => ({ items: decrementCart(state.items, id) }));
    },
    remove(id: string): void {
      patchState(store, (state) => ({ items: removeFromCart(state.items, id) }));
    },
    clear(): void {
      patchState(store, { items: [] });
    },
  })),
);
