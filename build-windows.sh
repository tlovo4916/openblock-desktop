#!/bin/bash

echo "=== 🪟 Supie-Demo Windows 打包脚本 ==="
echo

# 设置环境变量
export NODE_OPTIONS="--openssl-legacy-provider --max-old-space-size=8192"
export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
export ELECTRON_CACHE="$HOME/.cache/electron"

echo "📋 打包配置："
echo "  - 平台: Windows (x64 64位)"
echo "  - 目标: Windows 11 64位电脑"
echo "  - 输出: EXE安装包"
echo "  - 镜像: 国内加速镜像"
echo "  - 自动清理: 只保留EXE文件"
echo

# 检查是否在macOS上交叉编译
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "⚠️  注意: 在 macOS 上交叉编译 Windows 应用"
    echo "  - 某些原生模块可能无法正确编译"
    echo "  - 建议在 Windows 系统上进行最终打包"
    echo
fi

# 清理之前的构建
echo "🧹 清理之前的构建..."
rm -rf dist/
rm -f *.exe

# 编译项目
echo "🔧 编译项目..."
npm run compile

if [ $? -ne 0 ]; then
    echo "❌ 编译失败"
    exit 1
fi

# 打包
echo "📦 开始打包 Windows 应用..."
echo "⏱️  预计需要5-15分钟..."

npm run doBuild -- --mode=dist --win

if [ $? -eq 0 ]; then
    echo
    echo "✅ Windows 打包完成！"
    
    # 查找并移动所有架构的EXE文件到根目录
    EXE_FILES=$(find dist/ -name "Supie-Desktop-Demo_v*.exe")
    if [ -n "$EXE_FILES" ]; then
        echo "📦 保存最终文件："
        for EXE_FILE in $EXE_FILES; do
            EXE_NAME=$(basename "$EXE_FILE")
            cp "$EXE_FILE" "./$EXE_NAME"
            echo "  - $EXE_NAME"
        done
        
        # 清理中间文件
        echo "🧹 清理中间文件..."
        rm -rf dist/
        
        echo
        echo "🎉 打包完成！最终文件："
        ls -la *.exe
        
        echo
        echo "📁 文件大小："
        for exe in *.exe; do
            if [ -f "$exe" ]; then
                echo "  - $exe: $(du -h "$exe" | cut -f1)"
            fi
        done
        
        echo
        echo "🎯 安装方法："
        echo "1. 将EXE文件传输到Windows 11 64位系统"
        echo "2. 双击运行安装程序"
        echo "3. 按照向导完成安装"
        echo
        echo "📋 Windows 用户无需额外安装："
        echo "  - Node.js (已内置)"
        echo "  - Arduino IDE (已内置 Arduino CLI)"
        echo "  - Python 或其他开发工具"
        echo
        echo "✨ 所有中间文件已清理，只保留最终的EXE安装包"
    else
        echo "❌ 未找到主安装包EXE文件"
        echo "📁 可用文件："
        find dist/ -name "*.exe" | head -5
        exit 1
    fi
else
    echo "❌ 打包失败"
    echo
    echo "💡 可能的解决方案："
    echo "1. 在 Windows 系统上运行此脚本"
    echo "2. 或使用 Docker 容器进行交叉编译"
    echo "3. 检查网络连接和镜像设置"
    exit 1
fi 