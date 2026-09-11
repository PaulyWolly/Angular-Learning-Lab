import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  cartItemCount,
  cartTotal,
  CartState,
  LAB_CART_FEATURE_KEY,
} from './cart.state';

export const selectCartState = createFeatureSelector<CartState>(LAB_CART_FEATURE_KEY);

export const selectCartItems = createSelector(selectCartState, (state) => state.items);
export const selectCartStatus = createSelector(selectCartState, (state) => state.status);
export const selectCartError = createSelector(selectCartState, (state) => state.error);

export const selectCartItemCount = createSelector(selectCartItems, cartItemCount);
export const selectCartTotal = createSelector(selectCartItems, cartTotal);
