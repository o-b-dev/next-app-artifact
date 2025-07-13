# 搜索工具配置指南

本项目集成了多种搜索工具，从免费到付费，满足不同需求。

## 🆓 免费方案

### DuckDuckGo (默认)
- **价格**: 完全免费
- **配置**: 无需配置，开箱即用
- **特点**: 
  - 隐私友好
  - 无使用限制
  - 提供即时答案
- **限制**: 功能相对简单

## 💰 付费方案

### 1. SerpAPI (推荐)
- **价格**: $50/月 = 5000次搜索 (约 $0.01/次)
- **免费额度**: 100次/月
- **配置**: 在 `.env.local` 中添加 `SERP_API_KEY=your_key`
- **特点**: 
  - 支持 Google、Bing、Yahoo 等
  - 结构化数据
  - 高质量结果

### 2. Brave Search API
- **价格**: $3/月 = 1000次搜索 (约 $0.003/次)
- **配置**: 在 `.env.local` 中添加 `BRAVE_API_KEY=your_key`
- **特点**: 
  - 隐私保护
  - 高质量结果
  - 支持多种搜索类型

### 3. 自托管 SearxNG
- **价格**: 完全免费 (自托管)
- **配置**: 需要自己部署 SearxNG 实例
- **特点**: 
  - 聚合多个搜索引擎
  - 完全控制
  - 无使用限制

## 🔧 配置步骤

1. **创建环境变量文件**:
   ```bash
   # 在 apps/web/ 目录下创建 .env.local
   touch apps/web/.env.local
   ```

2. **添加API密钥**:
   ```env
   # 选择其中一个或多个
   SERP_API_KEY=your_serp_api_key_here
   BRAVE_API_KEY=your_brave_api_key_here
   ```

3. **重启开发服务器**:
   ```bash
   pnpm dev
   ```

## 🚀 使用方式

搜索工具会自动按以下优先级使用：
1. DuckDuckGo (免费，默认)
2. SerpAPI (如果配置了API key)
3. Brave Search (如果配置了API key)

## 📊 成本对比

| 服务 | 价格 | 每次搜索成本 | 推荐指数 |
|------|------|-------------|----------|
| DuckDuckGo | 免费 | $0 | ⭐⭐⭐⭐ |
| SerpAPI | $50/月 | $0.01 | ⭐⭐⭐⭐⭐ |
| Brave Search | $3/月 | $0.003 | ⭐⭐⭐⭐ |
| Exa | $100+/月 | $0.02+ | ⭐⭐ |

## 💡 建议

- **开发阶段**: 使用 DuckDuckGo (免费)
- **小规模生产**: 使用 SerpAPI (性价比高)
- **大规模生产**: 考虑自托管 SearxNG
- **企业级**: 考虑 Exa 或 SerpAPI 企业版 