const docsPath = '/docs';

export default [
    {
        text: '文档',
        collapsible: true,
        collapsed: false,
        items: [
            // This shows `/guide/index.md` page.
            { text: '介绍', link: `${docsPath}/00-introduction.md` },
            { text: '项目结构', link: `${docsPath}/01-project-structure.md` },
            { text: 'web标准', link: `${docsPath}/02-web-standards.md` },
            { text: '路由', link: `${docsPath}/03-routing.md` },
            { text: '高级路由', link: `${docsPath}/04-advanced-routing.md` },
            // { text: '加载', link: `${docsPath}/load.md` },
            // { text: '路由', link: `${docsPath}/form-actions.md` },
            // { text: 'hooks', link: `${docsPath}/hooks.md` },
            // { text: '服务端模块', link: `${docsPath}/server-only-modules.md` },
            // { text: '模块', link: `${docsPath}/modules.md` },
            // { text: 'service-workers', link: `${docsPath}/service-workers.md` },
            // { text: '路由', link: `${docsPath}/link-options.md` },
            // { text: '适配器', link: `${docsPath}/adapters.md` },
            // { text: '页面配置', link: `${docsPath}/page-options.md` },
            // { text: '打包', link: `${docsPath}/packaging.md` },
            // { text: 'cli', link: `${docsPath}/cli.md` },
            // { text: '配置', link: `${docsPath}/configuration.md` },
            // { text: '路由', link: `${docsPath}/types.md` },
            // { text: 'seo', link: `${docsPath}/seo.md` },
            // { text: '静态资源', link: `${docsPath}/assets.md` },
            // { text: '迁移', link: `${docsPath}/migrating.md` },
            // { text: '附加资源', link: `${docsPath}/additional-resources.md` },
            // { text: '附录', link: `${docsPath}/appendix.md` },
            // { text: '安全', link: `${docsPath}/security.md` },
        ]
    },
]