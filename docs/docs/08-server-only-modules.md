# 仅服务端模块

SvelteKit像一位好朋友一样保守你的秘密。
当你在同一个目录既写前端代码又写后端代码的时候，很容易在前端代码里导入敏感数据（比如environment variables containing API keys）。
SvelteKit通过server-only modules的方式完全阻止这种事情发生。

## Private environment variables

 `$env/static/private` 和 `$env/dynamic/private` 两个模块 （文档在[modules](/docs/modules)）
只能被运行在服务端的模块导入，比如[`hooks.server.js`](/docs/hooks#server-hooks)或者[`+page.server.js`](/docs/routing#page-page-server-js)

## 自己的仅服务端模块

你有两种方式把自己的模块变成server-only模块：

- 文件名里添加 `.server` , 比如 `secrets.server.js`
- 把这些模块放在 `$lib/server`目录下, 比如`$lib/server/secrets.js`

## How it works

只要你在浏览器侧的模块里引入了server-only模块，都会发生下面的事：

```js
// @errors: 7005
/// file: $lib/server/secrets.js
export const atlantisCoordinates = [/* redacted */];
```

```js
// @errors: 2307 7006
/// file: src/routes/utils.js
export { atlantisCoordinates } from '$lib/server/secrets.js';

export const add = (a, b) => a + b;
```

```html
/// file: src/routes/+page.svelte
<script>
	import { add } from './utils.js';
</script>
```

...SvelteKit 会发生错误:

```
Cannot import $lib/server/secrets.js into public-facing code:
- src/routes/+page.svelte
	- src/routes/utils.js
		- $lib/server/secrets.js
```

即使浏览器侧代码`src/routes/+page.svelte`只使用了`add`方法，没使用`atlantisCoordinates`方法。

这个功能对dynamic imports也同样生效。
甚至连这样导入``await import(`./${foo}.js`)``，都会有一个小小的警告：
during development, 
if there are two or more dynamic imports between the public-facing code and the server-only module, 
the illegal import will not be detected the first time the code is loaded.