# 介绍

## 开始前

> SvelteKit目前处于1.0版本的rc阶段，我们还在打磨和解决一些bug。
> 如果你遇到困难需要帮助，可以discard讨论[Discord chatroom](https://svelte.dev/chat)。
> 
> 如果你要从Sapper迁移到SvelteKit，请看 [迁移指导](/docs/migrating)。

## 什么是SvelteKit?

SvelteKit是一个用于构建超高性能web应用的框架。

构建一个拥有现代最佳实践的web应用是极其复杂的。
这些最佳实践包括：
* [build optimizations](https://vitejs.dev/guide/features.html#build-optimizations), 
让你加载最少需要的代码; 

* [离线支持](/docs/service-workers); 

* 在用户开始导航之前[预取](/docs/link-options#data-sveltekit-prefetch) 页面; 

* 提供配置 [configurable rendering](/docs/page-options) 让你[在build时](/docs/appendix#prerendering)决定怎么渲染应用：[on the server](/docs/appendix#ssr) 还是 [in the browser](/docs/appendix#csr-and-spa) 。 

SvelteKit做了所有这些最繁琐的事情，让开发者集中精力在创造力的部分（写业务，😿）。

它使用[Vite](https://vitejs.dev/)和[Svelte plugin](https://github.com/sveltejs/vite-plugin-svelte)
提供闪电般快的和功能丰富的开发体验（DX）。

为了能够理解接下来的文档，你不需要去看Svelte。简单来说，Svelte就是一个UI框架，编译组件到原生JS。
如果你想先去学学Svelte，可以看这两个链接：

[introduction to Svelte blog post](https://svelte.dev/blog/svelte-3-rethinking-reactivity) ，
[Svelte tutorial](https://svelte.dev/tutorial)。

## 开始

最简单的方式开始构建SvelteKit应用是运行`npm create`；

```bash
npm create svelte@latest my-app
cd my-app
npm install
npm run dev
```
第一个命令会用脚手架创建一个新项目my-app，同时你可以选择是否需要一些基本功能，比如TS。

可以看这一篇FAQ[指导自己怎么设置额外工具](/faq#integrations). 

接下来的命令是安装依赖和运行server在[localhost:5173](http://localhost:5173)

一些基本概念:

- 你应用的每一个page是一个组件。
- 想创建page就在src/routes目录添加文件。这些页面是服务端渲染的，为了使用户首次访问页面足够快，接下来客户端应用会接管工作。

可以试试编辑这些文件，来找找感觉，看看整个应用是怎么工作起来的。

### 编辑器安装

我们推荐使用 [Visual Studio Code (aka VS Code)](https://code.visualstudio.com/download) ，
使用这个扩展[the Svelte extension](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)。

 [不过也支持其他编辑器](https://sveltesociety.dev/tools#editor-support).
