import type {
  SchemaIs,
  BlockSpec,
} from 'triex-types';
import { block } from './block';

export type FuncExecCallback<A, R> = (args: A) => Promise<R | R[]>;

export type FuncArgsBuilder<A, R> = {
  (): FuncBuilder<A, R>;
  <T>(is: SchemaIs<T>): FuncBuilder<T, R>;
};

export type FuncResultBuilder<A, R> = {
  (): FuncBuilder<A, R>;
  <T>(is: SchemaIs<T>): FuncBuilder<A, T>;
};

export type FuncExecBuilder<A, R> = {
  (callback: FuncExecCallback<A, R>): FuncBuilder<A, R>;
};

export type FuncBuilder<A, R> = {
  args: FuncArgsBuilder<A, R>;
  result: FuncResultBuilder<A, R>;
  exec: FuncExecBuilder<A, R>;
  spec(): BlockSpec;
};

export function func(): FuncBuilder<void, void> {
  let blockBuilder = block()
    .params()
  ;
  
  const builder: FuncBuilder<any, any> = {
    args: (is?: SchemaIs<object>) => {
      if (is) {
        blockBuilder.input.one(is);
      } else {
        blockBuilder.input.one();
      }
      return builder;
    },
    result: (is?: SchemaIs<object>) => {
      if (is) {
        blockBuilder.output.one(is);
      } else {
        blockBuilder.output.one();
      }
      return builder;
    },
    exec: callback => {
      blockBuilder.process(async ctx => {
        const result = await callback(ctx.params);
        
        if (Array.isArray(result)) {
          ctx.output.push(result);
        } else {
          ctx.output.push([result]);
        }
      });
      return builder;
    },
    spec: () => blockBuilder.spec(),
  };
  
  return builder;
}
