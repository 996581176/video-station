## 增加功能介绍

1. 播放界面解除右键限制。

   ![image-20240802233711376](README/image-20240802233711376.png)

2. 增加跳转到某个时间点、跳转指定时长功能，会自动保存本次输入的内容。

   跳转：跳转到输入的时间点

   前进：向前快进输入的时长

   ![image-20240802233323099](README/image-20240802233323099.png)

3. WIP：历史记录

   ![image-20240802233641951](README/image-20240802233641951.png)

## 安装依赖

```bash
yarn
```

## 配置文件

`meta.json`文件配置脚本注释头的方式，字段值可以是字符串或字符串类型数组。

```json
{
  "@name": "screeps-chinese-pack",
  "@namespace": "http://tampermonkey.net/",
  "@version": "1.3",
  "@description": "用于汉化 screeps.com 网站的油猴脚本",
  "@author": "NorthEgg",
  "@match": "https://screeps.com/*",
  "@grant": "none",
  "@license": "MIT"
}
```

## 目录结构

### plugin 

plugin 目录为插件目录，src为插件源码，lib为编译后的插件

### src

src目录为脚本目录，入口文件为`main.ts`

### npm脚本

`start`：parcel 开发服务

`build`：parcel 构建

`watch`：parcel文件监听

`buildPlugin`：编译插件目录下所有插件
