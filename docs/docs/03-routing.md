# 路由

SvelteKit的核心是一个基于文件系统的路由器。
路由是通过目录来定义的。

- `src/routes` 根路由
- `src/routes/about` 创建一个 `/about` 路由
- `src/routes/blog/[slug]` 创建一个带`slug`参数的路由，用于动态加载数据，比如当用户请求`/blog/hello-world`这样的页面的时候。

> 你可以通过编辑[项目配置](/docs/configuration) 修改 `src/routes` 到一个不同的目录。

每个路由包含一个或多个 _路由文件_，路由文件是通过`+`前缀识别的。
## +page

### +page.svelte


一个`+page.svelte`组件定义了一个应用的页面。
默认下, 页面会在初始请求时进行服务端渲染([SSR](/docs/appendix#ssr)) ，
然后后续导航是使用客户端渲染 ([CSR](/docs/appendix#csr-and-spa)) 。

```svelte
/// file: src/routes/+page.svelte
<h1>Hello and welcome to my site!</h1>
<a href="/about">About my site</a>
```

```svelte
/// file: src/routes/about/+page.svelte
<h1>About this site</h1>
<p>TODO...</p>
<a href="/">Home</a>
```

```svelte
/// file: src/routes/blog/[slug]/+page.svelte
<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<h1>{data.title}</h1>
<div>{@html data.content}</div>
```

> 请注意 SvelteKit 使用 `<a>` 元素 在路由间导航, 而不是让框架造个新轮子，如 `<Link>` 组件。

### +page.js

通常来说，一个页面在渲染前需要加载一些数据，为此，我们可以添加`+page.js`或`+page.ts`，在其内部导出一个`load`函数

```js
/// file: src/routes/blog/[slug]/+page.js
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	if (params.slug === 'hello-world') {
		return {
			title: 'Hello world!',
			content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
		};
	}

	throw error(404, 'Not found');
}
```

load函数和 `+page.svelte`同时运行, 
意味着既在服务端渲染的时候在服务端运行，也在客户端导航时在浏览器侧运行. 
关于load函数更多细节请参考 [`load`](/docs/load)。

和`load`一样，`page.js`还可以导出一些值，用于配置该页面的行为：

- `export const prerender = true` or `false` or `'auto'`
- `export const ssr = true` or `false`
- `export const csr = true` or `false`

更多配置信息请参考 [page options](/docs/page-options).

### +page.server.js

如果你的`load`函数只能在服务端运行，比如，如果它需要从数据库取数据，或者访问私有[环境变量](/docs/modules#$env-static-private)，
你可以将`+page.js`改名为`+page.server.js`，然后修改`PageLoad` type为`PageServerLoad`。

```js
/// file: src/routes/blog/[slug]/+page.server.js

// @filename: ambient.d.ts
declare global {
	const getPostFromDatabase: (slug: string) => {
		title: string;
		content: string;
	}
}

export {};

// @filename: index.js
// ---cut---
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const post = await getPostFromDatabase(params.slug);

	if (post) {
		return post;
	}

	throw error(404, 'Not found');
}
```

客户端导航时, SvelteKit会从服务端加载数据, 
这意味返回值必须可被序列化的， 参考 [devalue](https://github.com/rich-harris/devalue)。

和 `+page.js`一样, `+page.server.js` 可以导出 [page options](/docs/page-options) — `prerender`, `ssr` 和 `csr`.

A `+page.server.js` 文件也能导出 _actions_. 
`load` 让你从服务端取数据, `actions` 让你向服务端写数据，通过使用 `<form>` 元素。
看 [form actions](/docs/form-actions) 部分，学习怎么用.

## +error

如果 `load`时错误发生, SvelteKit 会渲染一个默认的错误页。 
你可以通过每个路由下的`+error.svelte`文件，自定义错误页：

```svelte
/// file: src/routes/blog/[slug]/+error.svelte
<script>
	import { page } from '$app/stores';
</script>

<h1>{$page.status}: {$page.error.message}</h1>
```
SvelteKit会逐层向上遍历目录树，寻找`+error.svelte`文件。比如，
如果上面这个文件不存在， 它会试着找 `src/routes/blog/+error.svelte` 和 `src/routes/+error.svelte` 来渲染错误页。
如果这种向上查找也失败了 (或者错误是root`+layout`下的`load`函数抛出的，, root`+layout` 是位于root `+error` 之上的，"之上"指的是上一层), 
SvelteKit会渲染一个静态的错误页，静态错误页你也可以自定义，需要定义为`src/error.html` 文件。

## +layout

目前为了，我们把pages看成一个完整的组件。
当需要导航的时候，当前的`+page.svelte`组件会被销毁，一个新的`+page.svelte`会取代它。

但有许多应用是这样的，有一些页面元素会出现在每一个页面，比如顶部导航菜单或者页面底部元素。
这时候应该使用_layouts_，而不是重复地在每个`+page.svelte`里都加上这些元素。

### +layout.svelte

为了创建一个可以应用到每一个页面的layout，需要新建一个文件叫做`src/routes/+layout.svelte`。
默认的layout（SvelteKit默认）基本上长这样：

```html
<slot></slot>
```

我们可以添加任何我们需要的标签、样式、行为。
唯一的必要条件是，这个组件要有一个`<slot>`，用来填充页面内容。
比如，如果我们有下面的`/`, `/about` 和 `/settings`三个页面的话，我们可以添加下面的全局顶部导航条:

```html
/// file: src/routes/+layout.svelte
<nav>
	<a href="/">Home</a>
	<a href="/about">About</a>
	<a href="/settings">Settings</a>
</nav>

<slot></slot>
```

```html
/// file: src/routes/+page.svelte
<h1>Home</h1>
```

```html
/// file: src/routes/about/+page.svelte
<h1>About</h1>
```

```html
/// file: src/routes/settings/+page.svelte
<h1>Settings</h1>
```

这个导航条是始终可见的。每次切换菜单项，`<h1>`会被替换掉。

Layouts可以嵌套。
假如我们并没有一个`/settings`页面，而是有俩嵌套页面叫`/settings/profile`和`/settings/notifications`，
这俩嵌套页面有一个共同的子菜单(举个真实的例子，请看 [github.com/settings](https://github.com/settings))。

这时候我们可以创建一个layout，放在`/settings`目录下，

```svelte
/// file: src/routes/settings/+layout.svelte
<script>
	/** @type {import('./$types').LayoutData} */
	export let data;
</script>

<h1>Settings</h1>

<div class="submenu">
	{#each data.sections as section}
		<a href="/settings/{section.slug}">{section.title}</a>
	{/each}
</div>

<slot></slot>
```

### +layout.js

就像`+page.svelte`可以从`+page.js`的load函数加载数据，`+layout.svelte`也可以从`+layout.js`的load函数加载数据。

```js
/// file: src/routes/settings/+layout.js
/** @type {import('./$types').LayoutLoad} */
export function load() {
	return {
		sections: [
			{ slug: 'profile', title: 'Profile' },
			{ slug: 'notifications', title: 'Notifications' }
		]
	};
}
```

如果 `+layout.js` 导出 [page options](/docs/page-options) — `prerender`, `ssr` 和 `csr` — 所有子页面都可用。

所有子页面都可以使用从layout's `load` 函数返回的数据:

```svelte
/// file: src/routes/settings/profile/+page.svelte
<script>
	/** @type {import('./$types').PageData} */
	export let data;

	console.log(data.sections); // [{ slug: 'profile', title: 'Profile' }, ...]
</script>
```

> Often, layout data is unchanged when navigating between pages. 
> SvelteKit will intelligently re-run [`load`](/docs/load) functions when necessary.

### +layout.server.js

为了运行`load`函数在服务器端，将其移动到`+layout.server.js`文件，并修改`LayoutLoad` type 为 `LayoutServerLoad`。

类似于 `+layout.js`, `+layout.server.js` 也可以导出 [page options](/docs/page-options) — `prerender`, `ssr` 和 `csr`。

## +server

除了pages可以定义路由, 
我们也可以用一个 `+server.js` 文件定义路由 (叫做'API route' 或者 'endpoint')， 
这种路由使用可以全面控制Response。
 `+server.js` 文件 (或`+server.ts`) 会导出一个函数，
函数名使用HTTP 动词 比如 `GET`, `POST`, `PATCH`, `PUT` 和 `DELETE` ，
函数接受一个 `RequestEvent` 参数 ， 返回 一个 [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) 对象。

比如我们用`GET` 处理器 创建一个`/api/random-number`路由。

```js
/// file: src/routes/api/random-number/+server.js
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export function GET({ url }) {
	const min = Number(url.searchParams.get('min') ?? '0');
	const max = Number(url.searchParams.get('max') ?? '1');

	const d = max - min;

	if (isNaN(d) || d < 0) {
		throw error(400, 'min and max must be numbers, and min must be less than max');
	}

	const random = min + Math.random() * d;

	return new Response(String(random));
}
```

 `Response` 第一个参数可以是 [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream), 
making it possible to stream large amounts of data or create server-sent events
(unless deploying to platforms that buffer responses, like AWS Lambda).

可以使用 `@sveltejs/kit` 的 `error`, `redirect` 和 `json`  (不一定非要用)。 
请注意 `throw error(..)` 只返回一个纯文本响应。

### 取数据

通过导出 `POST`/`PUT`/`PATCH`/`DELETE` 处理器, `+server.js` 文件可以用于创建一个完整的API:

```svelte
/// file: src/routes/add/+page.svelte
<script>
	let a = 0;
	let b = 0;
	let total = 0;

	async function add() {
		const response = await fetch('/api/add', {
			method: 'POST',
			body: JSON.stringify({ a, b }),
			headers: {
				'content-type': 'application/json'
			}
		});

		total = await response.json();
	}
</script>

<input type="number" bind:value={a}> +
<input type="number" bind:value={b}> =
{total}

<button on:click={add}>Calculate</button>
```

```js
/// file: src/routes/api/add/+server.js
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { a, b } = await request.json();
	return json(a + b);
}
```

> 通常来说, [form actions](/docs/form-actions) 是一个从浏览器到服务器提交数据的更好的方式。

### 内容协商

`+server.js` 文件可以和 `+page` 文件放在同一目录下, 
即允许同一个路由 或使用page路由 或使用api路由。
SvelteKit定了一些规则，用以决定用哪个路由。

- `PUT`/`PATCH`/`DELETE` 请求 总会被 `+server.js` 处理。
- `GET`/`POST` 如果请求头有`accept` ：`text/html`则被视为页面请求，(换句话说, 这是个浏览器页面请求), 否则会被 `+server.js`处理。

## $types

通过上面例子可以看到，我们从一个`$types.d.ts`文件导入了types。
当你使用TS时，这个文件是SvelteKit帮我们创建的，放在在隐藏目录.
（如果用js, 会用JSDoc type annotations)

比如, 用 `PageData`注解 `export let data`  。
(或者 `LayoutData`, 注解 `+layout.svelte` 文件) 会告诉TS `data`的类型是 来自于`load` 返回的类型:

```svelte
/// file: src/routes/blog/[slug]/+page.svelte
<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>
```

同时, 用 `PageLoad`, `PageServerLoad`, `LayoutLoad` or `LayoutServerLoad` 注解`load`函数
(分别在 `+page.js`, `+page.server.js`, `+layout.js` 和 `+layout.server.js`文件)
对 `params` and 返回值进行类型定义。

## Other files

一个路由目录下的任何其他文件会被SvelteKit忽略。
这意味着你可以把组件和工具模块放到需要的路由目录下。

如果是一些通用的（被多个路由使用的）组件和模块，更好的建议是把它们放到[`$lib`](/docs/modules#$lib)目录。
