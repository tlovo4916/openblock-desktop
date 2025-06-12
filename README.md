# Supie-Demo

## 原项目地址

https://github.com/openblockcc/openblock-desktop

## 待修改项
Web模式启动时有部分编译错误
完整适配各环境的打包图标

## 🚀 快速开始

### Mac 打包
```bash
./build-mac.sh
```
- 输出：DMG 安装包
- 支持：macOS ARM64 + x64
- 时间：3-8分钟

### Windows 打包
```bash
./build-windows.sh
```
- 输出：EXE 安装包
- 支持：Windows x64
- 时间：5-15分钟

## 📋 系统要求

### 开发环境
- Node.js 16+
- npm 8+
- macOS (推荐) 或 Windows

### 运行环境
- **Mac用户**：macOS 10.14+
- **Windows用户**：Windows 10+ (无需额外安装)

## 🛠️ 其他命令

### 开发模式
```bash
npm start
```

### 仅编译（不打包）
```bash
npm run compile
```

### 生成应用目录（快速测试）
```bash
npm run build:dir
```

## 📁 输出文件

### Mac
- `dist/Supie-Demo-Desktop_v0.0.1_mac_arm64.dmg`
- `dist/Supie-Demo-Desktop_v0.0.1_mac_x64.dmg`

### Windows
- `dist/Supie-Demo-Desktop_v0.0.1_win_x64.exe`

## ⚠️ 注意事项

1. **网络问题**：使用国内镜像加速下载
2. **交叉编译**：在 macOS 上编译 Windows 版本可能有限制
3. **内存使用**：打包过程需要较大内存，建议 8GB+

## 🔧 故障排除

### 编译失败
```bash
rm -rf node_modules dist
npm install
npm run compile
```

### 网络超时
- 检查网络连接
- 使用科学上网工具
- 稍后重试

### 内存不足
```bash
export NODE_OPTIONS="--openssl-legacy-provider --max-old-space-size=16384"
``` 