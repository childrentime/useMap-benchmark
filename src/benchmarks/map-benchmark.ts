import Benchmark, { Target } from 'benchmark';
import Table from 'cli-table3';
import colors from 'colors';
import { AHooksMap } from '../map-implementations/ahooks-map';
import { NativeMap } from '../map-implementations/native-map';

const results: Target[] = [];

function runBenchmark(dataSize: number, operationCount: number) {
  console.log(colors.cyan(`\nRunning benchmark with ${dataSize} items and ${operationCount} operations\n`));

  const suite = new Benchmark.Suite;

  const initialData = Array.from({ length: dataSize }, (_, i) => [i, `value-${i}`] as [number, string]);
  const ahooksMap = new AHooksMap(initialData);
  const nativeMap = new NativeMap(initialData);

  const randomKeys = Array.from({ length: operationCount }, () => 
    Math.floor(Math.random() * dataSize)
  );

  suite
    .add('AHooksMap.set', () => {
      for (let i = 0; i < operationCount; i++) {
        ahooksMap.set(randomKeys[i], `new-value-${i}`);
      }
    })
    .add('NativeMap.set', () => {
      for (let i = 0; i < operationCount; i++) {
        nativeMap.set(randomKeys[i], `new-value-${i}`);
      }
    })
    .on('cycle', (event: Benchmark.Event) => {
      const benchmark = event.target;
      results.push({
        ...benchmark,
      });
      console.log(String(benchmark));
    })
    .on('complete', () => {
      displayResults();
    })
    .run({ 'async': true });
}

function displayResults() {
  const table = new Table({
    head: [
      '实现方式',
      '每秒可执行set操作次数',
      '统计误差范围',
      '采样次数'
    ].map(h => colors.cyan(h)),
    colAligns: ['left', 'right', 'right', 'right'],
  });

  results.forEach(result => {
    // 因为我们在一次测试中执行了operationCount次set，所以要乘以operationCount
    const actualOpsPerSec = (result?.hz ?? 0) * 100; // 乘以operationCount
    table.push([
      colors.white(result?.name ?? ''),
      colors.green(actualOpsPerSec.toFixed(2)),
      colors.yellow(`±${(result?.stats?.rme ?? 0).toFixed(2)}%`),
      colors.white((result?.stats?.sample.length ?? '').toString()),
    ]);
  });

  console.log('\nResults:');
  console.log(table.toString());
}

// 运行不同数据规模的测试
const testCases = [
  { dataSize: 100000, operationCount: 100 },
  // { dataSize: 10000, operationCount: 100 },
];

testCases.forEach(({ dataSize, operationCount }) => {
  runBenchmark(dataSize, operationCount);
});