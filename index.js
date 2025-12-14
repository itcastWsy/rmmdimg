#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const readline = require("readline");

// 创建命令行接口用于用户输入
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * 获取命令行参数
 */
function getArguments() {
  const args = process.argv.slice(2);
  const config = {
    customDir: null,
    autoConfirm: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '-d':
      case '--dir':
        config.customDir = args[i + 1];
        i++;
        break;
      case '-y':
      case '--yes':
        config.autoConfirm = true;
        break;
      case '-h':
      case '--help':
        showHelp();
        process.exit(0);
        break;
    }
  }

  return config;
}

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(`
rmmdimg - 清理Markdown文档中未引用的图片工具

使用方法:
  rmimg [选项]

选项:
  -d, --dir <目录>    指定图片文件夹路径 (默认: 自动查找 assets 或 medias)
  -y, --yes           自动确认删除，跳过用户确认
  -h, --help          显示帮助信息

示例:
  rmimg                          # 自动查找并清理
  rmimg -d images                # 清理指定目录
  rmimg -d ./static/assets       # 清理指定路径
  rmimg -y                       # 自动确认删除
`);
}

/**
 * 查找图片文件夹
 * @param {string|null} customDir - 用户指定的目录
 * @returns {string|null} 找到的目录路径
 */
function findImageDirectory(customDir) {
  // 如果用户指定了目录，直接使用
  if (customDir) {
    const dirPath = path.isAbsolute(customDir) ? customDir : path.join(process.cwd(), customDir);
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      return dirPath;
    }
    console.error(`错误: 指定的目录不存在或不是文件夹: ${customDir}`);
    return null;
  }

  // 默认查找顺序: assets -> medias
  const defaultDirs = ['assets', 'medias'];
  
  for (const dirName of defaultDirs) {
    const dirPath = path.join(process.cwd(), dirName);
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      return dirPath;
    }
  }

  console.error("错误: 未找到图片文件夹，请确保存在 'assets' 或 'medias' 文件夹，或使用 -d 参数指定目录");
  return null;
}

/**
 * 删除未在Markdown文件中引用的图片
 */
function deleteUnusedImages() {
  const config = getArguments();
  const mediaDir = findImageDirectory(config.customDir);

  if (!mediaDir) {
    process.exit(1);
  }

  try {
    console.log(`正在扫描目录: ${mediaDir}`);

    // 获取图片文件夹中的所有文件
    let allFiles = fs.readdirSync(mediaDir);
    // 过滤出图片文件（常见图片格式）
    let unusedImages = allFiles.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'].includes(ext);
    });

    console.log("发现图片数量:", unusedImages.length);

    // 获取当前目录下的所有Markdown文件
    const mdFiles = fs.readdirSync("./").filter(file => 
      path.extname(file).toLowerCase() === ".md"
    );

    if (mdFiles.length === 0) {
      console.log("警告: 未找到Markdown文件");
      rl.close();
      return;
    }

    console.log("发现Markdown文件数量:", mdFiles.length);

    // 扫描每个Markdown文件，标记被引用的图片
    mdFiles.forEach(mdFile => {
      try {
        const mdContent = fs.readFileSync(mdFile, "utf8");
        const referencedImages = [];

        unusedImages.forEach(imageName => {
          if (mdContent.includes(imageName)) {
            referencedImages.push(imageName);
          }
        });

        // 从待删除列表中移除被引用的图片
        referencedImages.forEach(imageName => {
          const index = unusedImages.indexOf(imageName);
          if (index !== -1) {
            unusedImages.splice(index, 1);
          }
        });
      } catch (error) {
        console.error(`读取文件 ${mdFile} 时出错:`, error.message);
      }
    });

    if (unusedImages.length === 0) {
      console.log("没有发现未使用的图片，所有图片都被引用了。");
      rl.close();
      return;
    }

    console.log(`\n发现 ${unusedImages.length} 张未使用的图片:`);
    unusedImages.forEach(imageName => {
      console.log(`  - ${imageName}`);
    });

    // 用户确认删除
    if (config.autoConfirm) {
      performDeletion(mediaDir, unusedImages);
    } else {
      rl.question('\n确定要删除这些图片吗？(y/N): ', (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          performDeletion(mediaDir, unusedImages);
        } else {
          console.log("操作已取消。");
        }
        rl.close();
      });
    }
  } catch (error) {
    console.error("执行过程中发生错误:", error.message);
    rl.close();
    process.exit(1);
  }
}

/**
 * 执行删除操作
 * @param {string} mediaDir - 图片目录路径
 * @param {string[]} unusedImages - 未使用的图片列表
 */
function performDeletion(mediaDir, unusedImages) {
  let deletedCount = 0;
  let errorCount = 0;

  unusedImages.forEach(imageName => {
    try {
      const imagePath = path.join(mediaDir, imageName);
      fs.unlinkSync(imagePath);
      console.log("已删除:", imageName);
      deletedCount++;
    } catch (error) {
      console.error(`删除图片 ${imageName} 时出错:`, error.message);
      errorCount++;
    }
  });

  console.log(`\n清理完成，共删除 ${deletedCount} 张未使用的图片`);
  if (errorCount > 0) {
    console.log(`删除失败 ${errorCount} 张图片`);
  }
}

// 执行主函数
deleteUnusedImages();