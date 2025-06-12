#!/bin/bash

echo "=== 🍎 Supie-Demo Mac 打包脚本 ==="
echo

# 设置环境变量
export NODE_OPTIONS="--openssl-legacy-provider --max-old-space-size=8192"
export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
export ELECTRON_CACHE="$HOME/.cache/electron"

echo "📋 打包配置："
echo "  - 平台: macOS (ARM64)"
echo "  - 目标: Mac mini M4 (ARM架构)"
echo "  - 输出: DMG安装包"
echo "  - 镜像: 国内加速镜像"
echo "  - 自动清理: 只保留DMG文件"
echo

# 清理之前的构建
echo "🧹 清理之前的构建..."
rm -rf dist/
rm -f *.dmg

# 编译项目
echo "🔧 编译项目..."
npm run compile

if [ $? -ne 0 ]; then
    echo "❌ 编译失败"
    exit 1
fi

# 打包
echo "📦 开始打包 Mac 应用..."
echo "⏱️  预计需要3-8分钟..."

npm run doBuild -- --mode=dist --mac

if [ $? -eq 0 ]; then
    echo
    echo "✅ Mac 打包完成！"
    
    # 查找并移动主应用DMG文件到根目录（排除驱动程序文件）
    DMG_FILE=$(find dist/ -name "*.dmg" -not -path "*/Contents/drivers/*" | head -1)
    if [ -n "$DMG_FILE" ]; then
        DMG_NAME=$(basename "$DMG_FILE")
        echo "📦 保存最终文件: $DMG_NAME"
        cp "$DMG_FILE" "./$DMG_NAME"
        
        # 清理dist目录
        echo "🧹 清理中间文件..."
        rm -rf dist/
        
        # 显示最终结果
        echo
        echo "🎉 打包完成！最终文件："
        ls -lh *.dmg
        echo
        echo "📁 文件大小: $(du -h *.dmg | cut -f1)"
        echo
        echo "🎯 安装方法："
        echo "1. 双击打开 $DMG_NAME"
        echo "2. 拖拽应用到 Applications 文件夹"
        echo "3. 从启动台运行 Supie-Demo-Desktop"
        echo
        echo "✨ 所有中间文件已清理，只保留最终的DMG安装包"
    else
        echo "❌ 未找到主应用DMG文件"
        exit 1
    fi
else
    echo "❌ 打包失败"
    echo "💡 尝试运行: npm run build:dir (仅生成应用目录)"
    exit 1
fi 