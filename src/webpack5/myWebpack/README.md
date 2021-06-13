# myWebpack

## webpack 执行流程

1. 依据配置文件，初始化 Compiler 对象；
2. 执行 Compiler.run, 解析 entry, 找到所有入口文件；
3. 从 entry 为入口，调用 loader 对模块进行编译；
4. 编译完成后，确定最终输出内容以及它们之间的依赖关系；
5. 生成 chunk, 输出资源。

## 实现 myWebpack

<!-- ! 路漫漫其修远兮 -->
