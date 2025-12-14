# rmmdimg

一个用于清理Markdown文档中未引用图片的工具，自动删除图片文件夹中未被任何Markdown文件引用的图片。

## 功能特点

- 🔍 自动扫描当前目录下的所有Markdown文件
- 🖼️ 支持多种图片文件夹名称（assets、medias）
- 🗑️ 安全删除未被引用的图片文件，支持用户确认
- ⚡ 快速清理，节省存储空间
- 📝 详细的操作日志输出
- 🎯 支持自定义图片目录路径
- 🛡️ 删除前用户确认，防止误操作

## 使用场景

当你的项目目录中存在多个Markdown文件（如 `index1.md` 和 `index2.md`）和一个共享的图片文件夹时，经常会出现以下情况：

- 图片文件夹中存放了100张图片
- Markdown文件中实际只引用了其中的50张
- 剩余的50张图片是反复修改后不再使用的冗余文件

此时可以使用 `rmmdimg` 工具一键清理这些未使用的图片。

## 安装

```bash
npm install -g rmmdimg
```

## 使用方法

### 基本用法

在包含Markdown文件和图片文件夹的目录中运行：

```bash
rmimg
```

### 命令行选项

```bash
rmimg [选项]
```

#### 可用选项

- `-d, --dir <目录>` - 指定图片文件夹路径（默认自动查找 assets 或 medias）
- `-y, --yes` - 自动确认删除，跳过用户确认提示
- `-h, --help` - 显示帮助信息

### 使用示例

#### 1. 自动查找并清理
```bash
# 自动查找 assets 或 medias 文件夹并清理
rmimg
```

#### 2. 指定目录清理
```bash
# 清理指定目录中的图片
rmimg -d images

# 清理相对路径目录
rmimg -d ./static/assets

# 清理绝对路径目录
rmimg -d /path/to/image/folder
```

#### 3. 自动确认删除
```bash
# 跳过确认提示，直接删除
rmimg -y

# 结合自定义目录使用
rmimg -d images -y
```

#### 4. 查看帮助
```bash
rmimg --help
```

### 目录结构示例

#### 默认目录结构
```
your-project/
├── index1.md
├── index2.md
├── other.md
├── assets/          # 或 medias/
│   ├── image1.png
│   ├── image2.jpg
│   ├── unused-image.png
│   └── ...
```

#### 自定义目录结构
```
your-project/
├── docs/
│   ├── guide.md
│   └── tutorial.md
├── static/
│   └── images/      # 自定义图片目录
│       ├── fig1.png
│       ├── fig2.jpg
│       └── old-image.png
```

## 工作原理

1. **目录发现**：自动查找 `assets` 或 `medias` 文件夹，或使用用户指定的目录
2. **文件扫描**：扫描当前目录下的所有 `.md` 文件和图片文件
3. **引用分析**：分析每个Markdown文件的内容，检查图片引用情况
4. **识别冗余**：识别未被任何Markdown文件引用的图片
5. **用户确认**：显示待删除图片列表，等待用户确认
6. **安全删除**：删除未使用的图片文件并显示结果

## 支持的图片格式

- PNG (.png)
- JPEG (.jpg, .jpeg)
- GIF (.gif)
- BMP (.bmp)
- SVG (.svg)
- WebP (.webp)

## 注意事项

- ⚠️ **删除操作不可逆**，请确保重要图片已备份
- 📁 支持多种图片文件夹名称：`assets`、`medias` 或自定义目录
- 🔍 工具会显示详细的删除日志和确认提示
- 📝 使用 `-y` 参数可跳过确认提示（请谨慎使用）
- 🛡️ 默认情况下会提示用户确认，防止误删除

## 作者

**万少** (itcastWsy)

- 📧 邮箱：yeah126139163@163.com
- 💬 微信：w846903522
- 📱 公众号：HarmonyOS 万少

## 许可证

MIT License









