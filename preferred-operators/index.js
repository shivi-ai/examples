import { createRoute, getOperatorList } from './client';
import { attachEventListeners } from './operators';

createRoute({});
getOperatorList({ page: 0 });
attachEventListeners();
