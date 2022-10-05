# Hooks

hooks是整个应用级别的函数， 让你对框架行为有细粒度的控制。

有两个用来放hooks的文件，都是可选的:

- `src/hooks.server.js` — your app's server hooks
- `src/hooks.client.js` — your app's client hooks

当应用启动时，这俩文件的代码会运行，他们在初始化数据库clients等方面很有用。

> 你可以使用[`config.kit.files.hooks`](/docs/configuration#files)配置这些文件的位置

## Server hooks

下面这些hooks可以添加到 `src/hooks.server.js`:

### handle

每当SvelteKit服务端收到一个[请求](/docs/web-standards#fetch-apis-request) ，这个函数都会运行，然后决定 [response](/docs/web-standards#fetch-apis-response). 
它收到两个参数，一个是`event`对象，该对象包裹了请求信息。
另一个是`resolve`，他可以渲染路由和生成响应。
这个hook让你修改响应头或响应体，or bypass SvelteKit entirely (for implementing routes programmatically, for example).

```js
/// file: src/hooks.server.js
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	if (event.url.pathname.startsWith('/custom')) {
		return new Response('custom response');
	}

	const response = await resolve(event);
	return response;
}
```

> 请求静态资源 — 包括已经prerendered的页面 — 是不会被SvelteKit处理的。

如果未实现该hook, 该hook默认等于 `({ event, resolve }) => resolve(event)`。
想要给请求添加自定义数据，使用`event.locals`对象。

```js
/// file: src/hooks.server.js
// @filename: ambient.d.ts
type User = {
	name: string;
}

declare namespace App {
	interface Locals {
		user: User;
	}
}

const getUserInformation: (cookie: string | void) => Promise<User>;

// @filename: index.js
// ---cut---
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	event.locals.user = await getUserInformation(event.cookies.get('sessionid'));

	const response = await resolve(event);
	response.headers.set('x-custom-header', 'potato');

	return response;
}
```

你可以通过使用 [the `sequence` helper function](/docs/modules#sveltejs-kit-hooks) 添加多个 `handle` 函数。

`resolve` 有两个参数，第二个参数是可选的。第二个参数让你对 怎么返回响应 有更多控制。
第二个参数是个对象，有俩字段：

- `transformPageChunk(opts: { html: string, done: boolean }): MaybePromise<string | undefined>` — applies custom transforms to HTML. If `done` is true, it's the final chunk. Chunks are not guaranteed to be well-formed HTML (they could include an element's opening tag but not its closing tag, for example) but they will always be split at sensible boundaries such as `%sveltekit.head%` or layout/page components.
- `filterSerializedResponseHeaders(name: string, value: string): boolean` — 决定响应里要包含哪些headers。 默认什么都没有。

```js
/// file: src/hooks.server.js
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('old', 'new'),
		filterSerializedResponseHeaders: (name) => name.startsWith('x-')
	});

	return response;
}
```

### handleFetch

你可以用这个函数修改或替换一个`load`函数里的`fetch`请求。

Or your `load` function might make a request to a public URL like `https://api.yourapp.com` when the user performs a client-side navigation to the respective page,
but during SSR it might make sense to hit the API directly (bypassing whatever proxies and load balancers sit between it and the public internet).

```js
/** @type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch({ request, fetch }) {
	if (request.url.startsWith('https://api.yourapp.com/')) {
		// clone the original request, but change the URL
		request = new Request(
			request.url.replace('https://api.yourapp.com/', 'http://localhost:9999/'),
			request
		);
	}

	return fetch(request);
}
```

**Credentials**

For same-origin requests, SvelteKit's `fetch` implementation will forward `cookie` and `authorization` headers unless the `credentials` option is set to `"omit"`.

For cross-origin requests, `cookie` will be included if the request URL belongs to a subdomain of the app — for example if your app is on `my-domain.com`, and your API is on `api.my-domain.com`, cookies will be included in the request.

If your app and your API are on sibling subdomains — `www.my-domain.com` and `api.my-domain.com` for example — then a cookie belonging to a common parent domain like `my-domain.com` will _not_ be included, because SvelteKit has no way to know which domain the cookie belongs to. In these cases you will need to manually include the cookie using `handleFetch`:

```js
// @errors: 2345
/** @type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch({ event, request, fetch }) {
	if (request.url.startsWith('https://api.my-domain.com/')) {
		request.headers.set('cookie', event.request.headers.get('cookie'));
	}

	return fetch(request);
}
```

## Shared hooks

The following can be added to `src/hooks.server.js` _and_ `src/hooks.client.js`:

### handleError

If an unexpected error is thrown during loading or rendering, this function will be called with the `error` and the `event`. This allows for two things:

- you can log the error
- you can generate a custom representation of the error that is safe to show to users, omitting sensitive details like messages and stack traces. The returned value becomes the value of `$page.error`. It defaults to `{ message: 'Not Found' }` in case of a 404 (you can detect them through `event.routeId` being `null`) and to `{ message: 'Internal Error' }` for everything else. To make this type-safe, you can customize the expected shape by declaring an `App.Error` interface (which must include `message: string`, to guarantee sensible fallback behavior).

The following code shows an example of typing the error shape as `{ message: string; code: string }` and returning it accordingly from the `handleError` functions:

```ts
/// file: src/app.d.ts
declare namespace App {
	interface Error {
		message: string;
		code: string;
	}
}
```

```js
/// file: src/hooks.server.js
// @errors: 2322 2571
// @filename: ambient.d.ts
const Sentry: any;

// @filename: index.js
// ---cut---
/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error, event }) {
	// example integration with https://sentry.io/
	Sentry.captureException(error, { event });

	return {
		message: 'Whoops!',
		code: error.code ?? 'UNKNOWN'
	};
}
```

```js
/// file: src/hooks.client.js
// @errors: 2322 2571
// @filename: ambient.d.ts
const Sentry: any;

// @filename: index.js
// ---cut---
/** @type {import('@sveltejs/kit').HandleClientError} */
export function handleError({ error, event }) {
	// example integration with https://sentry.io/
	Sentry.captureException(error, { event });

	return {
		message: 'Whoops!',
		code: error.code ?? 'UNKNOWN'
	};
}
```

> In `src/hooks.client.js`, the type of `handleError` is `HandleClientError` instead of `HandleServerError`, and `event` is a `NavigationEvent` rather than a `RequestEvent`.

This function is not called for _expected_ errors (those thrown with the [`error`](/docs/modules#sveltejs-kit-error) function imported from `@sveltejs/kit`).

During development, if an error occurs because of a syntax error in your Svelte code, the passed in error has a `frame` property appended highlighting the location of the error.
