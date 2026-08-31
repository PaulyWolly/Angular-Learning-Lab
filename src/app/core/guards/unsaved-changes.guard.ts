import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { ToastService } from '../../shared/toast/toast.service';

/** Component contract for the unsaved-changes CanDeactivate guard. */
export interface CanLeaveDirtyForm {
  /** Return true when navigation away is safe (form pristine / saved). */
  canLeave(): boolean;
}

/**
 * Functional CanDeactivate guard — blocks leave when the component reports dirty state.
 * Uses window.confirm so the learner sees the browser dialog interviewers mention.
 */
export const unsavedChangesGuard: CanDeactivateFn<CanLeaveDirtyForm> = (component) => {
  const toast = inject(ToastService);

  if (component.canLeave()) {
    return true;
  }

  const leave = window.confirm(
    'You have unsaved changes. Leave this page anyway?',
  );

  if (leave) {
    toast.success('Left with unsaved edits', 'CanDeactivate allowed navigation after confirm.');
    return true;
  }

  toast.info('Stay on page', 'CanDeactivate blocked navigation — form is still dirty.');
  return false;
};
