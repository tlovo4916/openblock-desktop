#!/bin/bash

# 设置镜像源
export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
export ELECTRON_CACHE="$HOME/.cache/electron"
export npm_config_electron_mirror="https://npmmirror.com/mirrors/electron/"
export npm_config_cache="$HOME/.npm"

# 设置Node.js环境
export NODE_OPTIONS="--openssl-legacy-provider"

echo "使用国内镜像源构建Mac安装包..."

# 确保必要的目录存在
mkdir -p tools/Arduino
mkdir -p static
mkdir -p translations

# 复制已存在的Arduino CLI工具（如果有的话）
if [ -d "/usr/local/bin" ] && [ -f "/usr/local/bin/arduino-cli" ]; then
    echo "发现系统安装的Arduino CLI，复制到tools目录..."
    cp /usr/local/bin/arduino-cli tools/Arduino/arduino-cli
    chmod +x tools/Arduino/arduino-cli
fi

# 创建基本的translations目录结构
mkdir -p translations/core
echo '{}' > translations/core/en.json

# 运行构建
echo "开始构建..."
npm run doBuild -- --mode=dist

echo "构建完成！" 