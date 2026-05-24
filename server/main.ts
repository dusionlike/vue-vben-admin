import type { EventHandler } from 'h3';

import { createServer } from 'node:http';

import { createApp, createRouter, toNodeListener } from 'h3';

type RouteMethod = 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put';

type RouteModule = {
  default?: EventHandler;
};

const apiModules = import.meta.glob<RouteModule>('./api/**/*.ts', { eager: true });
const middlewareModules = import.meta.glob<RouteModule>('./middleware/**/*.ts', {
  eager: true,
});
const routeModules = import.meta.glob<RouteModule>('./routes/**/*.ts', { eager: true });

function normalizeRouteSegment(segment: string) {
  if (/^\[\.\.\.(.*)\]$/.test(segment)) {
    return '**';
  }

  const matches = segment.match(/^\[(.+)\]$/);
  if (matches) {
    return `:${matches[1]}`;
  }

  return segment;
}

function parseRoute(relativeFilePath: string) {
  const normalizedFilePath = relativeFilePath.replace(/\\/g, '/');
  const withoutExtension = normalizedFilePath.replace(/\.[cm]?[jt]s$/, '');
  const segments = withoutExtension.split('/').filter(Boolean);
  const rawName = segments.pop() || '';
  const matches = rawName.match(/^(.*)\.(delete|get|head|options|patch|post|put)$/);
  const method = matches?.[2] as RouteMethod | undefined;
  const fileSegment = matches ? matches[1] : rawName;

  if (fileSegment && fileSegment !== 'index') {
    segments.push(fileSegment);
  }

  const routePath =
    '/' +
    segments
      .map((segment) => normalizeRouteSegment(segment))
      .filter(Boolean)
      .join('/');

  return {
    method,
    path: routePath === '/' ? routePath : routePath.replace(/\/$/, ''),
  };
}

function registerModules(
  router: ReturnType<typeof createRouter>,
  modules: Record<string, RouteModule>,
  rootDir?: string,
) {
  for (const [filePath, routeModule] of Object.entries(modules).sort((left, right) => {
    return left[0].localeCompare(right[0]);
  })) {
    if (!routeModule.default) {
      continue;
    }

    let relativeFilePath = filePath.replace(/^\.\//, '');
    if (rootDir && relativeFilePath.startsWith(`${rootDir}/`)) {
      relativeFilePath = relativeFilePath.slice(rootDir.length + 1);
    }
    const { method, path } = parseRoute(relativeFilePath);

    if (method) {
      router.add(path, routeModule.default, method);
      continue;
    }

    router.use(path, routeModule.default);
  }
}

async function startServer() {
  const app = createApp();
  const apiRouter = createRouter();
  const pageRouter = createRouter();

  for (const middlewareModule of Object.values(middlewareModules)) {
    if (middlewareModule.default) {
      app.use(middlewareModule.default);
    }
  }

  registerModules(apiRouter, apiModules, 'api');
  registerModules(pageRouter, routeModules, 'routes');

  app.use('/api', apiRouter.handler);
  app.use(pageRouter.handler);

  const port = Number(process.env.PORT || process.env.SERVER_PORT || 5320);
  const server = createServer(toNodeListener(app));

  server.listen(port, () => {
    console.log(`Mock server listening on http://localhost:${port}`);
  });
}

void startServer();
