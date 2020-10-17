# k-近邻算法

## 介绍

k-近邻算法，kNN: 采用测量不同特征值之间的距离方法进行分类。

## 过程

训练集中的数据存在标签，即我们知道训练集中每一个数据与所属分类的对应关系。

当输入没有标签的数据时，将新数据中的每个特征与样本集中的数据对应的特征进行比较，然后使用算法提取样本集中特征最相似的分类标签。

## 特点

- 优点：精度高、对异常值不敏感、无数据输入假定。
- 缺点：计算复杂度高、空间复杂度高。
- 适用数据范围：数值型和标称型。

## 最简单的示例

首先贴上代码：

```typescript
import * as tf from "@tensorflow/tfjs-node";

interface DataType {
  dataGroup: tf.Tensor<tf.Rank.R2>;
  dataLabel: string[];
}

/**
 * create training data set
 */
const createTrainData: () => DataType
 = () => {
  const dataGroup = tf.tensor2d([
    [1.0, 1.1],
    [1.0, 1.0],
    [0,   0  ],
    [0,   0.1]
  ]);
  const dataLabel = ['A', 'A', 'B', 'B'];
  return {
    dataGroup,
    dataLabel
  }
}

/**
 * k-NN classify
 */
const KNNClassify:(input: number[]) => Promise<string>
 = (input) => {
  /**
   * Euclidean distance
   */
  const calculateDis:(value: number[]) => number
    = (value) => {
      const distance = Math.sqrt(value.reduce( (prev, cur, index) => {
        return prev + (cur - input[index]) ** 2;
      }, 0))
      return distance;
    }

  const trainData = createTrainData();
  const { dataGroup: trainDataGroup, dataLabel } = trainData;

  let minDis = Number.MAX_VALUE;
  let minIndex = -1;

  return trainDataGroup.array().then( (res: number[][]) => {
    for( let i = 0; i < res.length; i++) {
      const dis = calculateDis(res[i]);
      if( dis < minDis) {
        minDis = dis;
        minIndex = i;
      }
    }
    return dataLabel[minIndex];
  });
}

const input = [0,0];
KNNClassify(input).then(res => {
  console.log(res);
});
```

函数 `createTrainData` 中，在平面直角坐标上，我们定义四个点，以及在该点上的标签，当作训练数据。

随后，使用欧几里得距离作为度量两点距离的方式，即对于两个点 (x1, y1), (x2, y2)而言，其距离为 $d = \sqrt{(x1 - x2)^2 + (y1 - y2)^2}$. 可见函数 `calculateDis`.

之后，输入一个坐标，逐个计算该坐标与训练集中点的距离，选择最小值（即 k = 1 下的情况）对应的标签。函数 `KNNClassify`.

例如，输入 [0,0], 很明显，该点距离 [0,0] 坐标最近（其距离为 0），所以应该返回标签 'B'.
