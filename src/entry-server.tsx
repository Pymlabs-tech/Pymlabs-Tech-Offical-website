import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { buildHead } from './lib/head';
import { findRoute, notFoundMeta, routes } from './data/routes';
import { site } from './config/site';

export { routes, notFoundMeta, site };

export function render(url: string) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  const meta = url === notFoundMeta.path ? notFoundMeta : findRoute(url);
  return { html, head: buildHead(meta) };
}
