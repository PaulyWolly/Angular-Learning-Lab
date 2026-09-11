import { createReducer, on } from '@ngrx/store';
import { CartActions } from './cart.actions';
import {
  addToCart,
  decrementCart,
  initialCartState,
  removeFromCart,
} from './cart.state';

/**
 * Pure function: (state, action) → new state.
 * Never mutate arrays/objects — return copies (spread / map / filter).
 */
export const cartReducer = createReducer(
  initialCartState,
  on(CartActions.addItem, (state, { id, name, price }) => ({
    ...state,
    items: addToCart(state.items, { id, name, price }),
  })),
  on(CartActions.decrementItem, (state, { id }) => ({
    ...state,
    items: decrementCart(state.items, id),
  })),
  on(CartActions.removeItem, (state, { id }) => ({
    ...state,
    items: removeFromCart(state.items, id),
  })),
  on(CartActions.clear, (state) => ({
    ...state,
    items: [],
  })),
  on(CartActions.loadSeed, (state) => ({
    ...state,
    status: 'loading' as const,
    error: null,
  })),
  on(CartActions.loadSeedSuccess, (state, { items }) => ({
    ...state,
    status: 'loaded' as const,
    items,
  })),
  on(CartActions.loadSeedFailure, (state, { error }) => ({
    ...state,
    status: 'error' as const,
    error,
  })),
);
