#!/bin/bash
SRC=../src/icon/OpenBlockDesktop.png
OUT_ICONSET=OpenBlockDesktop.iconset
OUT_ICNS=OpenBlockDesktop.icns
OUT_ICO=OpenBlockDesktop.ico
TMP_ICO=tmp

ICO_BASIC_SIZES="16 24 32 48 256"
ICO_EXTRA_SIZES="20 30 36 40 60 64 72 80 96 512"

if command -v pngcrush >/dev/null 2>&1; then
    function optimize () {
        pngcrush -new -brute -ow "$@"
    }
else
    echo "pngcrush is not available - skipping PNG optimization"
    function optimize () {
        echo "Not optimizing:" "$@"
    }
fi

# usage: resize newWidth newHeight input output [otherOptions...]
function resize () {
    WIDTH=$1
    HEIGHT=$2
    SRC=$3
    DST=$4
    shift 4
    convert -background none -resize "${WIDTH}x${HEIGHT}" -extent "${WIDTH}x${HEIGHT}" -gravity center "$@" "${SRC}" "${DST}"
    optimize "${DST}"
}

if command -v convert >/dev/null 2>&1; then
    # Mac
    if command -v iconutil >/dev/null 2>&1; then
        mkdir -p "${OUT_ICONSET}"
        for SIZE in 16 32 128 256 512; do
            SIZE2=`expr "${SIZE}" '*' 2`
            resize "${SIZE}" "${SIZE}" "${SRC}" "${OUT_ICONSET}/icon_${SIZE}x${SIZE}.png" -density 72 -units PixelsPerInch
            resize "${SIZE2}" "${SIZE2}" "${SRC}" "${OUT_ICONSET}/icon_${SIZE}x${SIZE}@2x.png" -density 144 -units PixelsPerInch
        done
        iconutil -c icns --output "${OUT_ICNS}" "${OUT_ICONSET}"
        echo "✅ 生成Mac图标: ${OUT_ICNS}"
    else
        echo "iconutil is not available - skipping ICNS and ICONSET"
    fi

    # Windows ICO
    mkdir -p "${TMP_ICO}"
    for SIZE in ${ICO_BASIC_SIZES} ${ICO_EXTRA_SIZES}; do
        resize "${SIZE}" "${SIZE}" "${SRC}" "${TMP_ICO}/icon_${SIZE}x${SIZE}.png"
    done
    # Asking for "Zip" compression actually results in PNG compression
    convert "${TMP_ICO}"/icon_*.png -colorspace sRGB -compress Zip "${OUT_ICO}"
    echo "✅ 生成Windows图标: ${OUT_ICO}"

    # Windows AppX
    mkdir -p "appx"
    resize 44 44 "${SRC}" 'appx/Square44x44Logo.png'
    resize 50 50 "${SRC}" 'appx/StoreLogo.png'
    resize 150 150 "${SRC}" 'appx/Square150x150Logo.png'
    resize 310 150 "${SRC}" 'appx/Wide310x150Logo.png'
    echo "✅ 生成Windows AppX图标"

    # 清理临时文件
    rm -rf "${TMP_ICO}"
    rm -rf "${OUT_ICONSET}"
    
    echo ""
    echo "🎉 图标生成完成！"
    echo "📁 生成的文件："
    echo "  - Mac: ${OUT_ICNS}"
    echo "  - Windows: ${OUT_ICO}"
    echo "  - AppX: appx/ 目录"
else
    echo "ImageMagick is not available - cannot convert icons"
    echo "请安装 ImageMagick: brew install imagemagick"
fi
