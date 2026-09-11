import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { CartEffects } from './store/cart.effects';
import { cartReducer } from './store/cart.reducer';
import { LAB_CART_FEATURE_KEY } from './store/cart.state';

/** Lazy feature route — Store slice + effects load with this lab, not the main bundle. */
export const NGRX_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideState(LAB_CART_FEATURE_KEY, cartReducer),
      provideEffects(CartEffects),
    ],
    loadComponent: () => import('./ngrx-lab.component').then((m) => m.NgrxLabComponent),
    title: 'NgRx',
  },
];
