import{_ as e,c as s,o as a,a as o}from"./app.62ad7953.js";const D=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[{"level":2,"title":"web\u6807\u51C6","slug":"web\u6807\u51C6","link":"#web\u6807\u51C6","children":[{"level":3,"title":"Fetch APIs","slug":"fetch-apis","link":"#fetch-apis","children":[]},{"level":3,"title":"Stream APIs","slug":"stream-apis","link":"#stream-apis","children":[]},{"level":3,"title":"URL APIs","slug":"url-apis","link":"#url-apis","children":[]},{"level":3,"title":"Web Crypto","slug":"web-crypto","link":"#web-crypto","children":[]}]}],"relativePath":"docs/02-web-standards.md"}'),n={name:"docs/02-web-standards.md"},l=o(`<h2 id="web\u6807\u51C6" tabindex="-1">web\u6807\u51C6 <a class="header-anchor" href="#web\u6807\u51C6" aria-hidden="true">#</a></h2><p>\u901A\u8FC7\u8FD9\u7BC7\u6587\u7AE0\uFF0C\u4F60\u4F1A\u770B\u5230SvelteKit\u4F7F\u7528\u5230\u7684\u4E00\u4E9Bweb\u6807\u51C6<a href="https://developer.mozilla.org/en-US/docs/Web/API" target="_blank" rel="noreferrer">Web APIs</a>\u3002 \u6CA1\u6709\u91CD\u65B0\u53D1\u660E\u8F6E\u5B50\uFF0C\u610F\u5473\u7740\u4F60\u53EF\u4EE5\u4F7F\u7528\u73B0\u6709\u7684\u5F00\u53D1\u6280\u80FD\u6765\u5F00\u53D1SvelteKit\u5E94\u7528\u3002 \u800C\u4E14\u4F60\u82B1\u5728\u5B66\u4E60SvelteKit\u4E0A\u7684\u65F6\u95F4\uFF0C\u53EF\u4EE5\u5E2E\u52A9\u4F60\u6210\u4E3A\u4E00\u4E2A\u66F4\u597D\u7684web\u5F00\u53D1\u8005\uFF0C\u5C06\u8FD9\u4E9B\u77E5\u8BC6\u7528\u5728\u5176\u4ED6\u5730\u65B9\u3002</p><p>\u8FD9\u4E9BAPI\u5728\u73B0\u4EE3\u6D4F\u89C8\u5668\u4E0A\u548C\u975E\u6D4F\u89C8\u5668\u73AF\u5883\u6BD4\u5982Cloudflare Workers\u3001Deno \u548C Vercel Edge Functions\u90FD\u662F\u53EF\u7528\u7684\u3002</p><p>During development, and in <a href="/docs/adapters.html">adapters</a> for Node-based environments (\u5305\u62EC AWS Lambda), \u901A\u8FC7\u5FC5\u8981\u7684polyfills\u8FD9\u4E9BAPI\u4E5F\u662F\u53EF\u7528\u7684(Node\u73B0\u5728\u5BF9\u8FD9\u4E9Bweb\u6807\u51C6\u5FEB\u901F\u6DFB\u52A0\u4E86\u652F\u6301).</p><p>\u5C24\u5176\u662F\u4E0B\u9762\u8FD9\u4E9B\uFF1A</p><h3 id="fetch-apis" tabindex="-1">Fetch APIs <a class="header-anchor" href="#fetch-apis" aria-hidden="true">#</a></h3><p>SvelteKit\u4F7F\u7528<a href="https://developer.mozilla.org/en-US/docs/Web/API/fetch" target="_blank" rel="noreferrer"><code>fetch</code></a>\u4ECE\u7F51\u7EDC\u53D6\u6570\u636E\u3002</p><p>\u5B83\u53EF\u7528\u4E8E <a href="/docs/hooks.html">hooks</a> \u548C <a href="/docs/routing.html#server">server routes</a> \u4EE5\u53CA\u6D4F\u89C8\u5668.</p><blockquote><p>A special version of <code>fetch</code> is available in <a href="/docs/load.html"><code>load</code></a> functions for invoking endpoints directly during server-side rendering, without making an HTTP call, while preserving credentials. (To make credentialled fetches in server-side code outside <code>load</code>, you must explicitly pass <code>cookie</code> and/or <code>authorization</code> headers.) It also allows you to make relative requests, whereas server-side <code>fetch</code> normally requires a fully qualified URL.</p></blockquote><p>\u9664\u4E86 <code>fetch</code> \u81EA\u8EAB, <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" target="_blank" rel="noreferrer">Fetch API</a> \u8FD8\u5305\u62EC\u4E0B\u9762\u7684\u63A5\u53E3:</p><h4 id="request" tabindex="-1">Request <a class="header-anchor" href="#request" aria-hidden="true">#</a></h4><p>\u4E00\u4E2A <a href="https://developer.mozilla.org/en-US/docs/Web/API/Request" target="_blank" rel="noreferrer"><code>Request</code></a> \u7684\u5B9E\u4F8B\u53EF\u4EE5\u7528\u5728 <a href="/docs/hooks.html">hooks</a> \u548C <a href="/docs/routing.html#server">server routes</a> \uFF08\u901A\u8FC7 <code>event.request</code>\u65B9\u5F0F\uFF09\u3002 \u5B83\u5305\u542B\u6709\u7528\u7684\u65B9\u6CD5\uFF0C\u6BD4\u5982 <code>request.json()</code> \u548C <code>request.formData()</code> \u7B49 \u3002</p><h4 id="response" tabindex="-1">Response <a class="header-anchor" href="#response" aria-hidden="true">#</a></h4><p>\u4E00\u4E2A <a href="https://developer.mozilla.org/en-US/docs/Web/API/Response" target="_blank" rel="noreferrer"><code>Response</code></a>\u5B9E\u4F8B\u662F\u4ECE <code>await fetch(...)</code> \u8FD4\u56DE\u7684\uFF0C\u7136\u540E\u88AB<code>+server.js</code> \u6587\u4EF6\u5904\u7406\u3002 \u4ECE\u6839\u672C\u4E0A\u8BF4\uFF0C\u4E00\u4E2ASvelteKit\u5E94\u7528\u5C31\u662F\u4E00\u4E2A\u673A\u5668\uFF0C\u628A<code>Request</code>\u8F6C\u5316\u4E3A<code>Response</code></p><h4 id="headers" tabindex="-1">Headers <a class="header-anchor" href="#headers" aria-hidden="true">#</a></h4><p><a href="https://developer.mozilla.org/en-US/docs/Web/API/Headers" target="_blank" rel="noreferrer"><code>Headers</code></a> \u63A5\u53E3 \u8BA9\u4F60\u8BFB <code>request.headers</code> \u548C\u8BBE\u7F6E <code>response.headers</code>:</p><div class="language-js"><button class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#676E95;">// @errors: 2461</span></span>
<span class="line"><span style="color:#676E95;">/// file: src/routes/what-is-my-user-agent/+server.js</span></span>
<span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">json</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">@sveltejs/kit</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;">/** </span><span style="color:#89DDFF;">@</span><span style="color:#C792EA;">type</span><span style="color:#676E95;"> </span><span style="color:#89DDFF;">{</span><span style="color:#FFCB6B;">import(&#39;./$types&#39;).RequestHandler</span><span style="color:#89DDFF;">}</span><span style="color:#676E95;"> */</span></span>
<span class="line"><span style="color:#89DDFF;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">GET</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">event</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">	</span><span style="color:#676E95;">// log all headers</span></span>
<span class="line"><span style="color:#F07178;">	</span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">...</span><span style="color:#A6ACCD;">event</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">request</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">headers</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">	</span><span style="color:#89DDFF;">return</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">json</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">		</span><span style="color:#676E95;">// retrieve a specific header</span></span>
<span class="line"><span style="color:#F07178;">		userAgent</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">event</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">request</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">headers</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">user-agent</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">	</span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><h3 id="stream-apis" tabindex="-1">Stream APIs <a class="header-anchor" href="#stream-apis" aria-hidden="true">#</a></h3><p>\u5927\u591A\u6570\u65F6\u5019\uFF0C\u4F60\u4F1A\u6536\u5230\u5B8C\u6574\u6570\u636E\uFF0C\u6BD4\u5982\u4E0A\u9762\u7684<code>userAgent</code>\u4F8B\u5B50\u3002 \u4F46\u6709\u65F6\u5019\uFF0C\u63A5\u53E3\u8FD4\u56DE\u6570\u636E\u53EF\u80FD\u592A\u5927\uFF0C\u5185\u5B58\u91CC\u4E00\u6B21\u653E\u4E0D\u4E0B\uFF0C\u6216\u8005\u672C\u6765\u5C31\u662F\u5206chunk\u4F20\u8F93\u7684\u3002 \u8FD9\u65F6\u5019\u53EF\u4EE5\u7528Stream APIs\u3002</p><p><a href="https://developer.mozilla.org/en-US/docs/Web/API/Streams_API" target="_blank" rel="noreferrer">streams</a> \uFF0C <a href="https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream" target="_blank" rel="noreferrer">ReadableStream</a>\uFF0C <a href="https://developer.mozilla.org/en-US/docs/Web/API/WritableStream" target="_blank" rel="noreferrer">WritableStream</a>\uFF0C <a href="https://developer.mozilla.org/en-US/docs/Web/API/TransformStream" target="_blank" rel="noreferrer">TransformStream</a>\u3002</p><h3 id="url-apis" tabindex="-1">URL APIs <a class="header-anchor" href="#url-apis" aria-hidden="true">#</a></h3><p>\u4E3B\u8981\u6307 <a href="https://developer.mozilla.org/en-US/docs/Web/API/URL" target="_blank" rel="noreferrer"><code>URL</code></a> \u63A5\u53E3, \u8BE5\u63A5\u53E3\u6709\u4E00\u4E9B\u6709\u7528\u7684\u5C5E\u6027\u5305\u62EC <code>origin</code> \u548C <code>pathname</code> (\u4EE5\u53CA\u6D4F\u89C8\u5668\u91CC\u7684 <code>hash</code>)\u3002 \u8FD9\u4E2A\u63A5\u53E3\u4F1A\u5728\u5F88\u591A\u5730\u65B9\u51FA\u73B0 \u2014 \u6BD4\u5982<code>event.url</code> \u51FA\u73B0\u5728 <a href="/docs/hooks.html">hooks</a> \u548C <a href="/docs/routing.html#server">server routes</a>, <a href="/docs/modules.html#$app-stores"><code>$page.url</code></a> \u51FA\u73B0\u5728 <a href="/docs/routing.html#page">pages</a>, <code>from</code> \u548C <code>to</code> \u51FA\u73B0\u5728 <a href="/docs/modules.html#$app-navigation"><code>beforeNavigate</code> \u548C <code>afterNavigate</code></a> \u7B49\u7B49\u3002</p><h4 id="urlsearchparams\u7C7B" tabindex="-1">URLSearchParams\u7C7B <a class="header-anchor" href="#urlsearchparams\u7C7B" aria-hidden="true">#</a></h4><p>\u65E0\u8BBA\u4F55\u65F6\u4F60\u9047\u5230\u4E00\u4E2AURL\uFF0C\u90FD\u53EF\u4EE5\u7528<code>url.searchParams</code>\u83B7\u53D6\u5B83\u7684query\u53C2\u6570\u3002 searchParams\u65B9\u6CD5\u662FURLSearchParams\u7C7B\u7684\u4E00\u4E2A\u5B9E\u4F8B\u3002</p><div class="language-js"><button class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#676E95;">// @filename: ambient.d.ts</span></span>
<span class="line"><span style="color:#C792EA;">declare</span><span style="color:#A6ACCD;"> global </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">	</span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">url</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">URL</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;">// @filename: index.js</span></span>
<span class="line"><span style="color:#676E95;">// ---cut---</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> foo </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> url</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">searchParams</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">get</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">foo</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><h3 id="web-crypto" tabindex="-1">Web Crypto <a class="header-anchor" href="#web-crypto" aria-hidden="true">#</a></h3><p><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API" target="_blank" rel="noreferrer">Web Crypto API</a> \u53EF\u4EE5\u901A\u8FC7\u5168\u5C40\u53D8\u91CF<code>crypto</code> \u4F7F\u7528\u3002 \u4E3A\u4E86\u5904\u7406 <a href="/docs/configuration.html#csp">Content Security Policy</a> headers\u5B83\u5728sveltekit\u5185\u90E8\u4F7F\u7528\uFF0C \u4F46\u4F5C\u4E3A\u5F00\u53D1\u8005\uFF0C\u4F60\u53EF\u4EE5\u7528\u5B83\u5E72\u70B9\u522B\u7684\uFF0C\u6BD4\u5982\u751F\u6210uuid\u3002</p><div class="language-js"><button class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> uuid </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> crypto</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">randomUUID</span><span style="color:#A6ACCD;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div>`,28),r=[l];function p(t,c,d,i,h,y){return a(),s("div",null,r)}const A=e(n,[["render",p]]);export{D as __pageData,A as default};