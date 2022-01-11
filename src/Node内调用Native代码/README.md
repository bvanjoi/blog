# Node 内调用 Native 代码

我们知道，JavaScript 是一门解释性语言，例如在 V8 引擎中，JS 会被转换为字节码后执行。而所谓 Native 代码，是指 Cpp, Rust 等编译成二进制，被机器直接执行的代码。

本文将介绍在 Node 环境下调用 Cpp 代码的两种方式：N-API 和 Wasm.

## N-API

首先介绍 addons（即 Node 的 Cpp 扩展）, addons 是由 Cpp 实现的动态链接库，它提供了一套连接 C/Cpp 与 JavaScript 的接口。在 JS 文件中，可以直接使用 `require` 来引入来引入 addons.

实现 addons 有三种方式：N-API, nan，或直接使用内部的 V8, libuv 以及 Node 库。

本节将介绍如何使用 N-API 来实现 addons.

N-API 即 Node API, 对于使用 N-API 编写 addons 的开发者而言，N-API 抹平了不同 V8 版本接口的差异，进而保证编译产物可以运行在不同的 node 版本上。

首先需要执行 `npm install node-gyp node-addon-api` 来安装必要的库，其中 `node-gyp` 是编译 addon 的工具链；2. `node-addon-api` 是指 `napi` 库。

之后来看下面声明代码 `add.h` ：

```cpp
// napi 的声明文件
#include <napi.h>
namespace add {
    // 声明 cpp 代码内的加法实现
    int add(int a, int b);
    // 暴露给 JS 代码的实现
    // Napi::Number 是指 JS 的 number 类型
    // Napi::CallbackInfo 中包含了 JS 函数调用的参数
    Napi::Number AddWrapped(const Napi::CallbackInfo& info);
    // 模块处理
    Napi::Object Init(Napi::Env env, Napi::Object exports);
}
```

其相应的实现 `add.cpp` 为：

```cpp
#include "add.h"

int add::add(int a, int b) {
  return a + b;
}

Napi::Number add::AddWrapped(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    Napi::Number first = info[0].As<Napi::Number>();
    Napi::Number second = info[1].As<Napi::Number>();
    int returnValue = add::add(first.Int32Value(), second.Int32Value())
    return Napi::Number::New(env, returnValue);
}

Napi::Object add::Init(Napi::Env env, Napi::Object exports) {
    exports.Set("add", Napi::Function::New(env, add::AddWrapped));
    return exports;
}
```

最后创建入口 `main.cpp`：

```cpp
#include <napi.h>
#include "add.h"

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  return add::Init(env, exports);
}

NODE_API_MODULE(add, InitAll)
```

随后编写编译配置项文件：

```json
{
    "targets": [{
        "target_name": "add",
        "cflags!": [ "-fno-exceptions" ],
        "cflags_cc!": [ "-fno-exceptions" ],
        "sources": [
            "main.cpp",
            "add.cpp",
        ],
        'include_dirs': [
            "<!@(node -p \"require('node-addon-api').include\")"
        ],
        'libraries': [],
        'dependencies': [
            "<!(node -p \"require('node-addon-api').gyp\")"
        ],
        'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ]
    }]
}
```

再执行 `npx node-gyp rebuild` 即可生成产物。

尝试在 JS 文件中引入该函数，其结果为：

![N-API 产物目录结构与 JS 引入 N-API](https://img-blog.csdnimg.cn/d23c9ddcb5f34ddaa166e74ebd55ed52.png)

## Wasm

Wasm, 即 WebAssembly, 是一种已经被 W3C 发布的被允许在浏览器内执行的新语言，它可以由多种语言编译而来。相比于原始的 JavaScript 代码，由 Native 代码生成的 wasm 代码执行速度更快。

> 每一次编译前端项目都可能用到 Wasm，因为 Mozilla 的 [source-map](https://github.com/mozilla/source-map/blob/master/lib/source-map-consumer.js#L224) 中已使用 wasm 来提速。

首先需要下载 [emsdk](https://emscripten.org/docs/getting_started/downloads.html), 按照官网教程进行安装，随后通过 `emcc -v` 来验证安装成功。

随后创建文件 `sub.c`, 其内容如下（注意是 C 文件）：

```c
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE int sub(int a, int b){
  return a - b;
}
```

执行 `emcc sub.c -o sub.js -s MODULARIZE` 命令。

再创建 JavaScript 文件，引入生成的 `sub.js`, 随后执行结果可见下图：

![Wasm 产物与 JS 执行 Wasm](https://img-blog.csdnimg.cn/cac60744a62c4f59b54886ce70df53da.png)

---

本文简单介绍了两种调用 Native 代码的方式，还有很多诸如原理、性能比较等内容会在后面的文章中讲述。
