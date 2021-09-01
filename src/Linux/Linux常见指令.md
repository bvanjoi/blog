# Linux 常见指令

本文用于梳理记录 Linux 中常见指令。

## 文档命令

|指令名|全称|用途|示例|
|-|-|-|-|
|`man` |`manual`        |指令的参考手册 |`man ls`|
|`info`|`information`   |查看指令的帮助 |`info ls`|

## 目录相关命令

|指令名  |全称                   |用途|示例|
|-      |-                     | -|-|
|`pwd`  |`print work directory`|打印当前工作目录||
|`cd`   |`change directory`    |修改当前目录    |`cd -`|
|`ls`   |`list`                |列出目录中内容  ||
|`mkdir`|`make directory`      |新建文件夹||
|`rmdir`|`remove directory`    |删除空白文件夹||

## 文本查看命令

|指令名  |全称                   |用途|
|-      |-                     | -|
|`cat`  |`concatenate`         |在终端上显示文件内容|
|`head` |                      |在终端上显示文件*头部*内容|
|`tail` |                      |在终端上显示文件*尾部*内容|
|`wc`   |`word count`          |查看文件的行数|
|`more` |                      |查看文本，可分页显示|
|`less` |                      |查看文本，可分页显示|

## 搜索命令

## 打包与压缩

|指令名     |全称  |用途|
|-         |-    | -|
|`tar cf`  |     |打包文件|
|`tar czf` |     |打包压缩文件|
|`tar zxf` |     |解压|
