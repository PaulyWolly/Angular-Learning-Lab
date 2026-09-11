import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CartItem, CatalogItem } from './cart.state';

/** Events — the only way the classic Store changes. DevTools lists these by type. */
export const CartActions = createActionGroup({
  source: 'Lab Cart',
  events: {
    'Add Item': props<CatalogItem>(),
    'Decrement Item': props<{ id: string }>(),
    'Remove Item': props<{ id: string }>(),
    Clear: emptyProps(),
    'Load Seed': emptyProps(),
    'Load Seed Success': props<{ items: CartItem[] }>(),
    'Load Seed Failure': props<{ error: string }>(),
  },
});
