# 页面性能监控

在 Web 应用中，准确地测量页面性能是非常重要的，本文就来探讨前端页面的性能测量方法。

## 最简单的方法

最简单的方法就是统计某个 HTML 标签执行的顺序，在下面代码中，由于 HTML 自上而下执行的特性，放在 head 内的 javascript 会首先被执行，此时，记录下 `startTime`; 随后，给页面绑定了 `load` 事件，该事件为当页面所有资源加载结束后执行的函数；最后，当页面渲染结束后，会执行 `load`, 统计出页面加载的时间。

```html
<!DOCTYPE html>
<head>
  <title>Document</title>
  <script>
  var startTime = new Date().getTime()
  /**
   * 页面加载完成后立即发生
   */ 
  window.addEventListener('load', function() {
    console.log(document.getElementById('root'));
    // 输出为 <div id="root">hello</div>, 仅代表页面已经加载完成
    var nowTime = new Date().getTime()
    var duration = nowTime - startTime
    console.log('duration:', duration, 'ms')
  }) 
  </script>
</head>
<body>
  <div id="root">hello</div>
</body>
```

将上述代码用浏览器打开，可以看到：

![页面加载时间](https://img-blog.csdnimg.cn/20210419233345977.png)

上述代码虽然统计了页面加载时间，但是并没有给出任何与页面相关的信息。

## Performance

前端页面加载过程是一个浩大的工程，从 DNS 解析，建立 TCP 链接到加载 HTML/CSS/JavaScript 并渲染, 除此之外还包括资源压缩合并，CDN 请求，静态资源请求等等。

为了统计上述过程的加载时间，浏览器提供了一系列的 API 来检测页面性能：

- [`Resource Timing API`](https://developer.mozilla.org/zh-CN/docs/Web/API/Resource_Timing_API): 用以获取和分析应用资源加载的详细网络计时数据，可以统计加载特定资源，如 XHR, image, script 等；
- [`Navigation Timing API`](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigation_timing_API): 提供一系列字段来记录从页面导航加载到页面被关闭的过程中的时间；
- [`Paint Timing`](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformancePaintTiming): 与浏览器绘制的相关信息。
- .....

上述对象均继承自 [`PerformanceEntry`](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceEntry).

在 `PerformanceEntry` 中只有四个属性：`name`, `entryType`, `startTime`, `duration`.

下面，来看示例：

```html
<!DOCTYPE html>
<head>
  <title>Document</title>
</head>
<body>
  <div id="root">hello</div>
  <script>
    /**
     * 在 caniuse 网站中可以查到，performance 存在一定的兼容问题
     * 所有要首先查看是否可以使用
     */ 
    function hasPerformanceAPI() {
      return typeof window !== 'undefined' && typeof window.performance !== 'undefined';
    }

    /**
     * 对于页面的所有 performance 属性
     */
    function printPerformanceEntries() {
      if (!hasPerformanceAPI()) {
        return ;
      }
      // getEntries 是 performance 中的方法，可以返回对象数组
      // 其数组数量与加载的资源的数量有关
      var p = performance.getEntries();
      for (var i = 0; i < p.length; i++) {
        printPerformanceEntry(p[i]);
      }
    }

    function printPerformanceEntry(perfEntry) {
      var properties = ["name",
                        "entryType",
                        "startTime",
                        "duration"];

      for (var i = 0; i < properties.length; i++) {
        var supported = properties[i] in perfEntry;
        if (supported) {
          var value = perfEntry[properties[i]];
          console.log("... " + properties[i] + " = " + value);
        } else {
          console.log("... " + properties[i] + " is NOT supported");
        }
      }
    }

    // 打印网页
    printPerformanceEntries()
  </script>
</body>
```

其结果如下，由于该页面只加载了一个本地的 `index.html`，资源本身非常小，所以其 `startTime` 和 `duration` 为 0.

![performanceEntry](https://img-blog.csdnimg.cn/20210419233459325.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NkNDU2Nzg1NQ==,size_16,color_FFFFFF,t_70)

## measure

除了统计资源加载速度外，performance 还可以测量某个区间的值，这里可以使用两个 API: `mark`, 与 `measure`:

```html
<!DOCTYPE html>
<head>
  <title>Document</title>
</head>
<body>
  <div id="root">hello</div>
  <script>
    /**
     * 在 caniuse 网站中可以查到，performance 存在一定的兼容问题
     * 所有要首先查看是否可以使用
     */ 
    function hasPerformanceAPI() {
      return typeof window !== 'undefined' && typeof window.performance !== 'undefined';
    }

    (function() {
      if (!hasPerformanceAPI()) {
        return ;
      }

      // mark begin
      performance.mark('begin');
      // 测试循环的耗时
      for(var i = 0; i < 1e7; i++) {
        ;
      }
      // mark end
      performance.mark('end');

      // 测量 从 begin 到 end 之间的值
      performance.measure('loop', 'begin', 'end');

      console.log('duration:', performance.getEntriesByName('loop').pop().duration, 'ms');

      // 清除标志位
      performance.clearMarks();
      performance.clearMeasures();
    })();
  </script>
</body>
```

效果为：

![使用 performance.measure 测量循环耗时](https://img-blog.csdnimg.cn/2021041923355393.png)

## Navigation Timing

下面，来看一个 `performanceEntry` 中的组成：在支持 `Performance API` 的任何一个页面的控制台，以百度首页为例，打开控制台，输入 `performance.getEntries().pop()` 来获取一个实例：

![performance](https://img-blog.csdnimg.cn/20210419233729293.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NkNDU2Nzg1NQ==,size_16,color_FFFFFF,t_70)

上述属性虽多，但是实际上是有一定关联的，下面给出一张 w3c 的图片, 可见其表现出页面加载的流程，并展示出其中的节点：

![Processing](https://img-blog.csdnimg.cn/2021041923415448.png)

## 更多参考

- <https://www.w3.org/TR/navigation-timing-2>
