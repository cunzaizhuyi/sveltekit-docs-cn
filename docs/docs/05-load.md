# 加载数据

 [`+page.svelte`](/docs/routing#page-page-svelte) 或者 [`+layout.svelte`](/docs/routing#layout-layout-svelte) 从 `load`函数 取数据。

如果 `load` 函数 是定义在 `+page.js` 或 `+layout.js`里面， 它可以在浏览器和服务端两端运行。  
如果`load` 函数 是定义在 `+page.server.js` 或 `+layout.server.js`里面， 它只会在服务端运行，
这种情况下load函数可以直接进行数据库调用 和 访问私有 [环境变量](/docs/modules#$env-static-private)，
但只能返回可以被序列化的数据，参考 [devalue](https://github.com/rich-harris/devalue)。  
不管 `load` 函数写在哪里，返回值必须是个对象。

```js
/// file: src/routes/+page.js
/** @type {import('./$types').PageLoad} */
export function load(event) {
	return {
		some: 'data'
	};
}
```

## Input properties

 `load` 函数的参数 是 `LoadEvent` 类型（如果是只能在服务端运行的 `load` 函数, 
类型是`ServerLoadEvent`， which inherits `clientAddress`, `cookies`, `locals`, `platform` and `request` from `RequestEvent`)。
所有 events 都有下面的属性:

### data

很少的情况下，你既需要`+page.js`也需要`+page.server.js`。
这种情况下，`+page.svelte`的`data`来自于`+page.js`，而`+page.js`里data是来自于`+page.server.js`的。

```js
/// file: src/routes/my-route/+page.server.js
/** @type {import('./$types').PageServerLoad} */
export function load() {
	return {
		a: 1
	};
}
```

```js
/// file: src/routes/my-route/+page.js
// @filename: $types.d.ts
export type PageLoad = import('@sveltejs/kit').Load<{}, { a: number }>;

// @filename: index.js
// ---cut---
/** @type {import('./$types').PageLoad} */
export function load({ data }) {
	return {
		b: data.a * 2
	};
}
```

```svelte
/// file: src/routes/my-route/+page.svelte
<script>
	/** @type {import('./$types').PageData} */
	export let data;

	console.log(data.a); // `undefined`, it wasn't passed through in +page.js
	console.log(data.b); // `2`
</script>
```
换句话说，`+page.server.js`把data传给`+page.js`，`+page.js`再传给`+page.svelte`。

### params对象

`params` 来自于 `url.pathname` 和 路由。
路由path是key, url.pathname是value。

比如有个路由 `src/routes/a/[b]/[...c]` 和 一个URL请求 `url.pathname` = `/a/x/y/z`, 
 `params` 对象 就会是下面这样:

```json
{
	"b": "x",
	"c": "y/z"
}
```

### routeId

当前路由的名字, 相对于 `src/routes`目录:

```js
/// file: src/routes/blog/[slug]/+page.js
/** @type {import('./$types').PageLoad} */
export function load({ routeId }) {
	console.log(routeId); // 'blog/[slug]'
}
```

### url

[`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL)的实例, 
包含 `origin`, `hostname`, `pathname` 和 `searchParams` 等属性，
(searchParams是个[`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) 对象，包含已解析了的query参数). 
`load`函数不能获取`url.hash`, 因为该属性在服务端不可用。

> In some environments this is derived from request headers during server-side rendering. 
> If you're using [adapter-node](/docs/adapters#supported-environments-node-js), 
> for example, you may need to configure the adapter in order for the URL to be correct.

## Input methods

`LoadEvent`也有下面的方法:

### depends

该函数声明了`load` 函数有一些依赖，依赖有两种格式，一种是URL形式，一种是custom identifiers。
custom identifiers形式的依赖，随后可以作为[`invalidate()`](/docs/modules#$app-navigation-invalidate)的参数传进去，invalidate函数会使load函数重新运行。，

大多数情况下你不需要使用这个方法，因为`fetch`会替你调用它。
除非你使用了自定义API client，绕过了`fetch`。

url可以是绝对或相对路径，但必须经过编码[encoded](https://developer.mozilla.org/en-US/docs/Glossary/percent-encoding).

Custom identifiers 必须小写字母开头，然后跟一个冒号，这一点和规范一致[URI specification](https://www.rfc-editor.org/rfc/rfc3986.html).

下面例子展示了怎么用`depends`方法注册 URL形式依赖 和 注册custom identifier形式依赖，
点击按钮时，会使`load`函数重新运行。

```js
/// file: src/routes/+page.js
// @filename: ambient.d.ts
declare module '$lib/api' {
	interface Data{}
	export const base: string;
	export const client: {
		get: (resource:string) => Promise<Data>
	}
}

// @filename: index.js
// ---cut---
import * as api from '$lib/api';

/** @type {import('./$types').PageLoad} */
export async function load({ depends }) {
	depends(
		`${api.base}/foo`,
		`${api.base}/bar`,
		'my-stuff:foo'
	);

	return {
		foo: api.client.get('/foo'),
		bar: api.client.get('/bar')
	};
}
```

```svelte
/// file: src/routes/+page.svelte
<script>
	import { invalidate } from '$app/navigation';

	/** @type {import('./$types').PageData} */
	export let data;

	const pageRefresh = async () => {
		await invalidate('my-stuff:foo');
	}
</script>

<p>{data.foo}<p>
<p>{data.bar}</p>
<button on:click={pageRefresh}>Refresh my stuff</button>
```

### fetch

`fetch` 约等于原生的 [fetch api](https://developer.mozilla.org/en-US/docs/Web/API/fetch), 但加了一些功能:

- 可用于创建服务端的credentialed请求，因为它从页面请求继承了`cookie` and `authorization`等headers。
- 可以创建服务端的相对路径请求（在服务端环境用原生fetch api时是需要域名的）。
- 内部请求可以直接走到服务端的处理函数，不需要发起http调用。
- 服务端渲染期间，响应会被内联到HTML里。如果不在[`filterSerializedResponseHeaders`](/docs/hooks#server-hooks-handle)指明的话，headers默认是不会序列化的。
- hydration时，HTML会读内联响应，确保一致性和阻止发起额外的网络请求。

> Cookies will only be passed through if the target host is the same as the SvelteKit application or a more specific subdomain of it.

### parent

`await parent()` 从父layout 的`load`函数获取数据。
类似的， `+page.server.js` 或 `+layout.server.js` 会从父`+layout.server.js`文件的`load`函数取到数据。

```js
/// file: src/routes/+layout.server.js
/** @type {import('./$types').LayoutServerLoad} */
export function load() {
	return { a: 1 };
}
```

```js
/// file: src/routes/foo/+layout.server.js
// @filename: $types.d.ts
export type LayoutServerLoad = import('@sveltejs/kit').Load<{}, null, { a: number }>;

// @filename: index.js
// ---cut---
/** @type {import('./$types').LayoutServerLoad} */
export async function load({ parent }) {
	const { a } = await parent();
	console.log(a); // `1`

	return { b: 2 };
}
```

```js
/// file: src/routes/foo/+page.server.js
// @filename: $types.d.ts
export type PageServerLoad = import('@sveltejs/kit').Load<{}, null, { a: number, b: number }>;

// @filename: index.js
// ---cut---
/** @type {import('./$types').PageServerLoad} */
export async function load({ parent }) {
	const { a, b } = await parent();
	console.log(a, b); // `1`, `2`

	return { c: 3 };
}
```

`+page.js` 或 `+layout.js` 会从父`+layout.js`文件的`load`函数取到数据。
缺失的`+layout.js`，默认被当做`({ data }) => data`函数，这意味着它也可以从父`+layout.server.js`文件取到数据。

使用`await parent()`注意事项：如果你只是想合并父数据到output，请在取到自己的数据之后再调用它。

```diff
/// file: src/routes/foo/+page.server.js
// @filename: $types.d.ts
export type PageServerLoad = import('@sveltejs/kit').Load<{}, null, { a: number, b: number }>;

// @filename: index.js
// ---cut---
/** @type {import('./$types').PageServerLoad} */
export async function load({ parent, fetch }) {
-	const parentData = await parent();
	const data = await fetch('./some-api');
+	const parentData = await parent();

	return {
		...data
		meta: { ...parentData.meta, ...data.meta }
	};
}
```

### setHeaders

如果你想设置响应的headers，可以用`setHeaders`方法。
举例：如果你想页面被缓存，就很需要这个方法了。

```js
// @errors: 2322
/// file: src/routes/blog/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, setHeaders }) {
	const url = `https://cms.example.com/articles.json`;
	const response = await fetch(url);

	setHeaders({
		age: response.headers.get('age'),
		'cache-control': response.headers.get('cache-control')
	});

	return response.json();
}
```

> 当`setHeaders` 运行在浏览器的 `load` function时，是没有效果的。 

多次设置同一个header是错误的（即使在不同的load函数里），你只能设置一次。

你不能用`setHeaders`添加`set-cookie` header；
解决方案是：可以在server-only `load`函数里使用[`cookies`](/docs/types#sveltejs-kit-cookies) API。

## Output

返回的data，必须是个key-value对象，如果server-only `load`函数，这些value还必须是可被序列化的[devalue](https://github.com/rich-harris/devalue)。

每个promise都会被等待，因此很容易创建返回多个promise的对象，而不需要创建waterfall。（waterfall可以参考这个https://caolan.github.io/async/v3/docs.html#waterfall）
Top-level promises will be awaited, which makes it easy to return multiple promises without creating a waterfall:

```js
// @filename: $types.d.ts
export type PageLoad = import('@sveltejs/kit').Load<{}>;

// @filename: index.js
// ---cut---
/** @type {import('./$types').PageLoad} */
export function load() {
	return {
		a: Promise.resolve('a'),
		b: Promise.resolve('b'),
		c: {
			value: Promise.resolve('c')
		}
	};
}
```

```svelte
<script>
	/** @type {import('./$types').PageData} */
	export let data;

	console.log(data.a); // 'a'
	console.log(data.b); // 'b'
	console.log(data.c.value); // `Promise {...}`
</script>
```

## Errors

如果有错误抛出，最近的 [`+error.svelte`]会被渲染。
对于可预期的错误，建议使用`@sveltejs/kit`的 `error`函数，指定HTTP状态码和错误massage。

```js
/// file: src/routes/admin/+layout.server.js
// @filename: ambient.d.ts
declare namespace App {
	interface Locals {
		user: {
			name: string;
			isAdmin: boolean;
		}
	}
}

// @filename: index.js
// ---cut---
import { error } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
	if (!locals.user) {
		throw error(401, 'not logged in');
	}

	if (!locals.user.isAdmin) {
		throw error(403, 'not an admin');
	}
}
```

对于未预期的错误，SvelteKit会调用[`handleError`](/docs/hooks#shared-hooks-handleerror)，并将其当成500内部错误处理。

## Redirects

`@sveltejs/kit`提供了`redirect`函数，可以指定重定向的地址和3xx状态码。

```diff
/// file: src/routes/admin/+layout.server.js
-import { error } from '@sveltejs/kit';
+import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
	if (!locals.user) {
-		throw error(401, 'not logged in');
+		throw redirect(307, '/login');
	}

	if (!locals.user.isAdmin) {
		throw error(403, 'not an admin');
	}
}
```

## Invalidation

SvelteKit会跟踪每个`load`函数的依赖，以防止页面导航时不必要的re-running。
比如正常情况下，当你从一个页面导航到另一个页面时，根`+layout.js`下的`load`函数是不需要re-run的。
除非它依赖的参数或URL更改了。

下面几种情况， `load` 函数会re-run:

- 它引用了一个`params`对象的属性，这个属性值变了。
- 它引用了`url`的一个属性，比如 `url.pathname` 或 `url.search`，这个属性值变了。
- 调用了`await parent()`，父`load` 函数会re-run。
- 它使用[`fetch`](#input-methods-fetch)或[`depends`](#input-methods-depends)声明了一个对特定URL的依赖，当开发者使用[`invalidate(url)`](/docs/modules#$app-navigation-invalidate)使URL被标记为无效时，会re-run。
- 所有active `load`函数会强制re-run。参考[`invalidateAll()`](/docs/modules#$app-navigation-invalidateall)

当`load`函数re-run后，页面不会remount。而是update为新数据。这意味着组件的内部状态是保留的。
如果这不是你想要的，你可以在[`afterNavigate`](/docs/modules#$app-navigation-afternavigate)的回调函数里，将组件重置为你需要的状态，
或者你也可以用一个 [`{#key ...}`](https://svelte.dev/docs#template-syntax-key) 块包裹你的组件。

## Shared state

In many server environments, a single instance of your app will serve multiple users. 
For that reason, per-request state must not be stored in shared variables outside your `load` functions, 
but should instead be stored in `event.locals`. 
Similarly, per-user state must not be stored in global variables, 
but should instead make use of `$page.data` (which contains the combined data of all `load` functions) or use Svelte's [context feature](https://svelte.dev/docs#run-time-svelte-setcontext) to create scoped state.
