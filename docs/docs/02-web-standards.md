## web标准

通过这篇文章，你会看到SvelteKit使用到的一些web标准[Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)。
没有重新发明轮子，意味着你可以使用现有的开发技能来开发SvelteKit应用。
而且你花在学习SvelteKit上的时间，可以帮助你成为一个更好的web开发者，将这些知识用在其他地方。

这些API在现代浏览器上和非浏览器环境比如Cloudflare Workers、Deno 和 Vercel Edge Functions都是可用的。


During development, and in [adapters](/docs/adapters) for Node-based environments (包括 AWS Lambda), 通过必要的polyfills这些API也是可用的(Node现在对这些web标准快速添加了支持).

尤其是下面这些：

### Fetch APIs

SvelteKit使用[`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch)从网络取数据。

它可用于 [hooks](/docs/hooks) 和 [server routes](/docs/routing#server) 以及浏览器.

> A special version of `fetch` is available in [`load`](/docs/load) functions for invoking endpoints directly during server-side rendering, without making an HTTP call, while preserving credentials. (To make credentialled fetches in server-side code outside `load`, you must explicitly pass `cookie` and/or `authorization` headers.) It also allows you to make relative requests, whereas server-side `fetch` normally requires a fully qualified URL.

除了 `fetch` 自身,  [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 还包括下面的接口:

#### Request

一个 [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) 的实例可以用在 [hooks](/docs/hooks) 和 [server routes](/docs/routing#server) （通过 `event.request`方式）。
它包含有用的方法，比如 `request.json()` 和 `request.formData()` 等 。

#### Response

一个 [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)实例是从 `await fetch(...)` 返回的，然后被`+server.js` 文件处理。 
从根本上说，一个SvelteKit应用就是一个机器，把`Request`转化为`Response`

#### Headers

 [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers) 接口
 让你读 `request.headers` 和设置 `response.headers`:

```js
// @errors: 2461
/// file: src/routes/what-is-my-user-agent/+server.js
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export function GET(event) {
	// log all headers
	console.log(...event.request.headers);

	return json({
		// retrieve a specific header
		userAgent: event.request.headers.get('user-agent')
	});
}
```

### Stream APIs

大多数时候，你会收到完整数据，比如上面的`userAgent`例子。
但有时候，接口返回数据可能太大，内存里一次放不下，或者本来就是分chunk传输的。
这时候可以用Stream APIs。

[streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) ，
[ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)，
[WritableStream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream)，
[TransformStream](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream)。

### URL APIs

主要指 [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) 接口, 
该接口有一些有用的属性包括 `origin` 和 `pathname` (以及浏览器里的 `hash`)。
这个接口会在很多地方出现 — 比如`event.url` 出现在 [hooks](/docs/hooks) 和 [server routes](/docs/routing#server), 
[`$page.url`](/docs/modules#$app-stores) 出现在 [pages](/docs/routing#page), `from` 和 `to` 出现在 [`beforeNavigate` 和 `afterNavigate`](/docs/modules#$app-navigation) 等等。

#### URLSearchParams类

无论何时你遇到一个URL，都可以用`url.searchParams`获取它的query参数。
searchParams方法是URLSearchParams类的一个实例。

```js
// @filename: ambient.d.ts
declare global {
	const url: URL;
}

export {};

// @filename: index.js
// ---cut---
const foo = url.searchParams.get('foo');
```

### Web Crypto

 [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) 可以通过全局变量`crypto` 使用。
 为了处理 [Content Security Policy](/docs/configuration#csp) headers它在sveltekit内部使用，
 但作为开发者，你可以用它干点别的，比如生成uuid。

```js
const uuid = crypto.randomUUID();
```
