# 高级路由

## Rest parameters

如果你不知道路由分段有多少，可以使用rest语法，比如你可以像下面这样实现GitHub's的文件浏览器。

```bash
/[org]/[repo]/tree/[branch]/[...file]
```

假如有这样一个请求 `/sveltejs/kit/tree/master/documentation/docs/04-advanced-routing.md`，
那页面能取的参数是这样的:

```js
// @noErrors
{
	org: 'sveltejs',
	repo: 'kit',
	branch: 'master',
	file: 'documentation/docs/04-advanced-routing.md'
}
```

> `src/routes/a/[...rest]/z/+page.svelte` 会匹配 `/a/z` (完全没参数) as well as `/a/b/z` 和 `/a/b/c/z` 等。 请确保你检查了rest parameter的有效性。可以用 [matcher](#matching)检查。

### 404 pages

Rest parameters 也允许你自定义404页面。假如有下面路由：

```
src/routes/
├ marx-brothers/
│ ├ chico/
│ ├ harpo/
│ ├ groucho/
│ └ +error.svelte
└ +error.svelte
```

如果你访问`/marx-brothers/karl`，`marx-brothers/+error.svelte` 文件不会渲染，因为没有路由匹配到。
如果你想渲染一个错误页面，就要创建一个能够匹配所有`/marx-brothers/*`请求的路由。

```diff
src/routes/
├ marx-brothers/
+| ├ [...path]/
│ ├ chico/
│ ├ harpo/
│ ├ groucho/
│ └ +error.svelte
└ +error.svelte
```

```js
/// file: src/routes/marx-brothers/[...path]/+page.js
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load(event) {
	throw error(404, 'Not Found');
}
```

> If you don't handle 404 cases, they will appear in [`handleError`](/docs/hooks#shared-hooks-handleerror)

## Matching

 `src/routes/archive/[page]`路由 既可以匹配 `/archive/3`, 也可以匹配 `/archive/potato`。
如果我们不想这样，可以在 [`params`](/docs/configuration#files)目录添加一个_matcher_，
 _matcher_接收路由参数（`"3"` or `"potato"`）为参数，如果有效就返回true。

```js
/// file: src/params/integer.js
/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
	return /^\d+$/.test(param);
}
```

然后给路由加参数:

```diff
-src/routes/archive/[page]
+src/routes/archive/[page=integer]
```

如果pathname不匹配, SvelteKit 会尝试匹配其他路由 (使用下面的排序规则)。

> Matchers 在客户端和服务端都能运行。

## Sorting

可能有多条路由匹配到指定的path。
比如下面的例子，那么多路由都能匹配到`/foo-abc`：

```bash
src/routes/[...catchall]/+page.svelte
src/routes/[a]/+server.js
src/routes/[b]/+page.svelte
src/routes/foo-[c]/+page.svelte
src/routes/foo-abc/+page.svelte
```

SvelteKit 需要知道到底请求的哪条路由， 所以它制定了下面的排序规则：

- 越具体(精确)的路由优先级越高 (比如一条没有参数的路由 就比 有动态参数的路由 更具体)
- `+server` 文件比`+page` 文件有更高的优先级 
- 有 [matchers](#matching) (`[name=type]`) 比没有matchers的 (`[name]`)有更高优先级
- Rest parameters 有最低优先级
- Ties are resolved alphabetically

按照这个排序规则, 意味着 `/foo-abc` 会匹配到 `src/routes/foo-abc/+page.svelte`, 
而 `/foo-def` 会匹配到 `src/routes/foo-[c]/+page.svelte`:

```bash
src/routes/foo-abc/+page.svelte
src/routes/foo-[c]/+page.svelte
src/routes/[a]/+server.js
src/routes/[b]/+page.svelte
src/routes/[...catchall]/+page.svelte
```

## Encoding

目录名是会 URI-decoded的, 
比如有一个目录 `%40[username]` 会匹配 `@`字符开头的请求:

```js
// @filename: ambient.d.ts
declare global {
	const assert: {
		equal: (a: any, b: any) => boolean;
	};
}

export {};

// @filename: index.js
// ---cut---
assert.equal(
	decodeURIComponent('%40[username]'),
	'@[username]'
);
```

To express a `%` character, use `%25`, otherwise the result will be malformed.

## Advanced layouts

默认下，_layout_ 目录结构和 _route_ 目录结构是一致的。
但有时，可能跟你想的不一样。

### (group)

Perhaps you have some routes that are 'app' routes that should have one layout (如`/dashboard` 或 `/item`), 
and others that are 'marketing' routes that should have a different layout (`/about` 或 `/testimonials`). 
We can group these routes with a directory whose name is wrapped in parentheses 
— unlike normal directories, `(app)` and `(marketing)` do not affect the URL pathname of the routes inside them:

```diff
src/routes/
+│ (app)/
│ ├ dashboard/
│ ├ item/
│ └ +layout.svelte
+│ (marketing)/
│ ├ about/
│ ├ testimonials/
│ └ +layout.svelte
├ admin/
└ +layout.svelte
```

You can also put a `+page` directly inside a `(group)`, for example if `/` should be an `(app)` or a `(marketing)` page.

Pages and layouts inside groups — as in any other directory — will inherit layouts above them, unless they _break out_ of the layout hierarchy as shown in the next section. In the above example, `(app)/+layout.svelte` and `(marketing)/+layout.svelte` both inherit `+layout.svelte`.

### +page@

Conversely, some routes of your app might need to break out of the layout hierarchy. Let's add an `/item/[id]/embed` route inside the `(app)` group from the previous example:

```diff
src/routes/
├ (app)/
│ ├ item/
│ │ ├ [id]/
│ │ │ ├ embed/
+│ │ │ │ └ +page.svelte
│ │ │ └ +layout.svelte
│ │ └ +layout.svelte
│ └ +layout.svelte
└ +layout.svelte
```

Ordinarily, this would inherit the root layout, the `(app)` layout, the `item` layout and the `[id]` layout. We can reset to one of those layouts by appending `@` followed by the segment name — or, for the root layout, the empty string. In this example, we can choose from the following options:
- `+page@[id].svelte` - inherits from `src/routes/(app)/item/[id]/+layout.svelte`
- `+page@item.svelte` - inherits from `src/routes/(app)/item/+layout.svelte`
- `+page@(app).svelte` - inherits from `src/routes/(app)/+layout.svelte`
- `+page@.svelte` - inherits from `src/routes/+layout.svelte`

```diff
src/routes/
├ (app)/
│ ├ item/
│ │ ├ [id]/
│ │ │ ├ embed/
+│ │ │ │ └ +page@(app).svelte
│ │ │ └ +layout.svelte
│ │ └ +layout.svelte
│ └ +layout.svelte
└ +layout.svelte
```

There is no way to break out of the root layout. You can be sure that it's always present in your app and for example put app-wide UI or behavior in it.

### +layout@

Like pages, layouts can _themselves_ break out of their parent layout hierarchy, using the same technique. For example, a `+layout@.svelte` component would reset the hierarchy for all its child routes.

```
src/routes/
├ (app)/
│ ├ item/
│ │ ├ [id]/
│ │ │ ├ embed/
│ │ │ │ └ +page.svelte  // uses (app)/item/[id]/+layout.svelte
│ │ │ └ +layout.svelte  // inherits from (app)/item/+layout@.svelte
│ │ │ └ +page.svelte    // uses (app)/item/+layout@.svelte
│ │ └ +layout@.svelte   // inherits from root layout, skipping (app)/+layout.svelte
│ └ +layout.svelte
└ +layout.svelte
```

### When to use layout groups

Not all use cases are suited for layout grouping, nor should you feel compelled to use them. It might be that your use case would result in complex `(group)` nesting, or that you don't want to introduce a `(group)` for a single outlier. It's perfectly fine to use other means such as composition (reusable `load` functions or Svelte components) or if-statements to achieve what you want. The following example shows a layout that rewinds to the root layout and reuses components and functions that other layouts can also use:

```svelte
/// file: src/routes/nested/route/+layout@.svelte
<script>
	import ReusableLayout from '$lib/ReusableLayout.svelte';
	export let data;
</script>

<ReusableLayout {data}>
	<slot />
</ReusableLayout>
```

```js
/// file: src/routes/nested/route/+layout.js
// @filename: ambient.d.ts
declare module "$lib/reusable-load-function" {
	export function reusableLoad(event: import('@sveltejs/kit').LoadEvent): Promise<Record<string, any>>;
}
// @filename: index.js
// ---cut---
import { reusableLoad } from '$lib/reusable-load-function';

/** @type {import('./$types').PageLoad} */
export function load(event) {
	// Add additional logic here, if needed
	return reusableLoad(event);
}
```
