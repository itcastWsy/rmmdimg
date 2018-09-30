#!/usr/bin/env node


// process.argv
const path = require("path");
const fs = require("fs");

dImgs();
/* 
默认是当前路径的 meidas文件夹
默认是当前路径的所有的md 文件
 */
function dImgs() {
  /* 
  1 获取medias里面所有的图片 =>[]
  2 将图片数组和md中的图片引用对比，发现循环后不存在的数组，再开始循环删除
   */

  let dirName =path.join(process.cwd(),"medias");

  //  图片文件名称数组 =  要删除的图片的数组
  let imgArrNames = fs.readdirSync(dirName);
  // console.log(imgArrNames22);
  // 获取目录下的所有md文件名称
  let mdNames = fs.readdirSync("./").filter(v => {
    return v.includes(".md")
  });


  console.log("源图片的长度：" + imgArrNames.length);
  mdNames.forEach(v => {
    // v 是每一个md文件的名称  
    // 获取md文件字符串
    let mdContent = fs.readFileSync(v).toString("utf8");
    // 循环里面不要修改源数组的长度
    // 要保留的图片名数组
    let saveImgs = [];
    imgArrNames.forEach((vImg, iImg) => {
      if (mdContent.includes(vImg)) {
        // vImg 为不需要删除的文件
        saveImgs.push(vImg);
      }
    });
    saveImgs.forEach((v) => {
      // 修改上一个要循环的图片
      let deI = imgArrNames.indexOf(v);
      if (deI != -1) {
        imgArrNames.splice(deI, 1);
      }
    });

  });

  // 循环删除
  let deIndex = 0;
  imgArrNames.forEach(v => {
    fs.unlinkSync(path.join(dirName, v));
    console.log("删除的图片的名称" + v);
    deIndex++;
  });
  console.log("删除成功" + deIndex);
}