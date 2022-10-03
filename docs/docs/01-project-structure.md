## 项目结构

一个典型的SvelteKit项目，看起来是下面这样的：

```bash
my-project/
├ src/
│ ├ lib/
│ │ ├ server/
│ │ │ └ [your server-only lib files]
│ │ └ [your lib files]
│ ├ params/
│ │ └ [your param matchers]
│ ├ routes/
│ │ └ [your routes]
│ ├ app.html
│ ├ error.html
│ └ hooks.js
├ static/
│ └ [your static assets]
├ tests/
│ └ [your tests]
├ package.json
├ svelte.config.js
├ tsconfig.json
└ vite.config.js
```

除了上面列出的，还有一些通用文件，比如`.gitignore` 和 `.npmrc`。
  (还有 `.prettierrc` 和 `.eslintrc.cjs` 等等, 如果你在运行 `npm create svelte@latest`的时候选择了他们的话).

### 项目文件

#### src

`src`目录是你项目的最主要部分：

- `lib` 库代码, 可通过[`$lib`](/docs/modules#$lib) 别名导入其文件, or packaged up for distribution using [`svelte-package`](/docs/packaging)
    - `server` 包含服务端库代码. 可使用[`$lib/server`](/docs/server-only-modules) 别名导入该目录下文件. 如果在客户端代码中导入这里的代码SvelteKit会阻止你。
- `params` 包含应用的高级路由 [param matchers](/docs/advanced-routing#matching)
- `routes` 包含应用的 [路由](/docs/routing)
- `app.html` 是你的应用模板 — 包含下面的占位符:
    - `%sveltekit.head%` — 应用需要的`<link>` 和 `<script>` 元素, 插入到html的head内。
    - `%sveltekit.body%` — 渲染页面的标签. 通常放下`<div>`内, 不是直接放在 `<body>`内, 可以避免不必要的bug。
    - `%sveltekit.assets%` — either [`paths.assets`](/docs/configuration#paths), if specified, or a relative path to [`paths.base`](/docs/configuration#paths)
    - `%sveltekit.nonce%` — a [CSP](/docs/configuration#csp) nonce for manually included links and scripts, if used
- `error.html` (可选) 当应用出错时渲染该页面. 包含俩占位符:
    - `%sveltekit.status%` — http状态码
    - `%sveltekit.error.message%` — 错误message
- `hooks.js` (可选) 包含应用的 [hooks](/docs/hooks)
- `service-worker.js` (可选) 包含你的 [service worker](/docs/service-workers)

如果你用的是TS，可以用`.ts`代替`.js`。

#### static

任何静态资源都可以放在这里，比如`robots.txt` 或者 `favicon.png`。

#### tests

如果你用`npm create svelte@latest`创建项目的时候选了要添加测试，就会有这个目录。

#### package.json

`package.json`文件必须把`@sveltejs/kit`, `svelte`和`vite`列为`devDependencies`

当你用`npm create svelte@latest`创建项目时，你可能注意到`package.json`包含`"type": "module"`。
这意味着js文件被解释为ESM。  
common js文件需要.cjs文件扩展名。

#### svelte.config.js

这个文件包含Svelte和SvelteKit的[配置](/docs/configuration)。

#### tsconfig.json
用来配置TS。

此外SvelteKit还会生成自己的.svelte-kit/tsconfig.json文件，你可以用这个文件配置一些extends。

#### vite.config.js

一个SvelteKit项目实际上也是一个Vite项目，它使用了[`@sveltejs/kit/vite`](/docs/modules#sveltejs-kit-vite)插件。
以及其他一些插件。

### 其他文件

#### .svelte-kit

当你开发或build项目时，SvelteKit会在`.svelte-kit`目录下生成很多文件（该目录名可通过outDir配置）。
你可以忽略这个目录下的内容，也可以随时删掉他们。（他们在你下次dev或build的时候重新生成）