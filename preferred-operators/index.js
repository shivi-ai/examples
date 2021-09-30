import { createRoute, getOperatorList } from './client';
import { attachEventListeners } from './operators';

/*
 * On initial load we configure our UI. We fetch a first route without any preferred operators.
 * We also fetch the operator list with the first 10 items on page 0.
 * Finally we register the event listeners for certain elements.
 */
createRoute({});
getOperatorList({ page: 0 });
attachEventListeners();
