# Vue Vben Admin 简化版

这是一个从原始 vue-vben-admin 单独抽离并扁平化后的单包项目。当前仓库只保留一个前端应用和一个本地 mock 服务，目标是降低理解成本、减少工程脚手架噪音，并保留可直接运行的后台管理界面。

## 当前结构

- `src`: 前端主项目源码
- `server`: H3 mock 服务源码
- `public`: 静态资源
- `dist/app`: 前端构建产物
- `dist/server`: mock 服务构建产物

## 已做的简化

- 移除 monorepo 组织方式，不再以 `apps/*`、`packages/*`、`internal/*` 作为运行主路径
- 前端主项目提升到根目录，mock 服务固定为根目录下的 `server`
- 构建输出统一为 `dist/app` 和 `dist/server`
- 去掉 Turbo、version catalog、commit message 校验等复杂工程约束
- lint 范围收窄到当前扁平化后的源码和必要配置文件
- 保留 JSON 文案，但运行时不再做多语言切换，固定使用中文
- 顶部语言切换按钮、偏好设置里的语言选项，以及相关 locale 持久化逻辑已移除

## 环境要求

- Node.js 22+
- pnpm 11+

## 安装

```bash
pnpm install
```

## 开发

前端开发：

```bash
pnpm run dev
```

启动 mock 服务：

```bash
pnpm run server
```

默认情况下，前端开发服务器会把 `/api` 代理到 `http://localhost:5320/api`。

测试账号：`vben / 123456`

## 构建

构建前端与 mock 服务：

```bash
pnpm run build
```

仅构建前端：

```bash
pnpm run build:app
```

仅构建服务：

```bash
pnpm run build:server
```

## 常用命令

```bash
pnpm run typecheck
pnpm run lint
pnpm run test
pnpm run format
```

## 类型检查说明

当前仓库已经恢复为：

```bash
vue-tsc --build
```

## 验证状态

当前简化版本已验证通过：

- `pnpm run typecheck`
- `pnpm run build:app`
- `pnpm run build:server`
- `pnpm run test`
- `pnpm run lint`

## License

[MIT](./LICENSE)
