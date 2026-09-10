import { LessonCrumb } from './lesson-breadcrumb.component';

/** Shared ancestors for lesson breadcrumbs. */
export const CRUMB_HOME: LessonCrumb = { label: 'Home', path: '/' };
export const CRUMB_BASICS: LessonCrumb = { label: 'Basics', path: '/basics/overview' };
export const CRUMB_CORE: LessonCrumb = { label: 'Core', path: '/core/setup' };
export const CRUMB_ROUTES: LessonCrumb = { label: 'Routes', path: '/routes' };
export const CRUMB_MATERIAL: LessonCrumb = { label: 'Material', path: '/material/overview' };
export const CRUMB_THIRD_PARTY: LessonCrumb = {
  label: 'Third Party',
  path: '/third-party/overview',
};
export const CRUMB_USERS: LessonCrumb = { label: 'Users', path: '/users' };
