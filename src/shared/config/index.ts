import routes from './routes.json';
export const routeManifest = routes;
export const routePaths = Object.fromEntries(routes.map((route) => [route.id, route.path]));
