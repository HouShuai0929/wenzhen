
# patients-h5-151

该模板旨在帮助你快速上手基于 Vue 3 和 Vite 的项目开发。

## 推荐的 IDE 配置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（需禁用 Vetur） + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)。

## 为 TS 中 `.vue` 文件导入提供类型支持

TypeScript 默认无法处理 `.vue` 文件导入的类型信息，因此我们使用 `vue-tsc` 替代 `tsc` 命令行工具来进行类型检查。在编辑器中，你需要安装 [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)，让 TypeScript 语言服务能够识别 `.vue` 文件的类型。

如果你觉得独立的 TypeScript 插件运行速度不够快，Volar 还实现了[接管模式（Take Over Mode）](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669)，性能表现更优。你可以通过以下步骤启用该模式：

1. 禁用内置的 TypeScript 扩展
    1) 从 VSCode 的命令面板中执行 `扩展: 显示内置扩展`（Extensions: Show Built-in Extensions）
    2) 找到「TypeScript 和 JavaScript 语言功能（TypeScript and JavaScript Language Features）」，右键选择「禁用 (工作区)（Disable (Workspace)）」
2. 从命令面板执行「开发人员: 重新加载窗口（Developer: Reload Window）」，重启 VSCode 窗口。

## 自定义配置

详见 [Vite 配置参考文档](https://vitejs.dev/config/)。

## 项目搭建

```sh
pnpm install
```

### 开发环境编译及热重载

```sh
pnpm dev
```

### 生产环境类型检查、编译及代码压缩

```sh
pnpm build
```

### 使用 [ESLint](https://eslint.org/) 进行代码检查

```sh
pnpm lint
```

---

### 翻译说明 & 关键点回顾
1. **术语统一**：
   - Hot-Reload → 热重载（前端通用译法）
   - Type-Check → 类型检查（TS 核心术语）
   - Take Over Mode → 接管模式（Volar 官方中文译法）
   - Lint → 代码检查（而非字面译「校验」，符合前端习惯）
2. **操作指令本地化**：VSCode 命令面板的英文指令补充了中文对应项，降低新手操作成本；
3. **核心逻辑保留**：
   - 明确了 `vue-tsc` 替代 `tsc` 的核心原因（处理 `.vue` 类型）；
   - 清晰区分「开发环境」和「生产环境」的脚本用途，符合中文项目文档的表达习惯。
