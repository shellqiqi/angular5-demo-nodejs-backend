# angular5-demo-nodejs-backend

这是给[angular5-demo](https://github.com/shellqiqi/angular5-demo)提供的一个静态数据的简单后端。

## 架构流程

安装需要的模块

```
$ npm init -y
$ npm install @types/node --save
$ npm install express --save
$ npm install @types/express --save
```

可安装nodemon来检测代码更改，重启服务器

```
$ npm install -g nodemon
```

在`tsconfig.json`中配置typescript编译器

```
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es6",
    "noImplicitAny": true,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "sourceMap": true,
    "outDir": "build",
    "baseUrl": ".",
    "paths": {
      "*": [
        "node_modules/*"
      ]
    },
    "lib": ["es6"]
  },
  "exclude": [
    "node_modules"
  ]
}
```

## 部署

在Angular项目中执行`ng build`发布的内容作为`./dist`放入项目根目录。
