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
