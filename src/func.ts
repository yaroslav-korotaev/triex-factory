import type {
  SchemaIs,
  BlueprintRef,
  BlockSpec,
} from 'triex-types';
import { block } from './block';

export type FuncResourceBuilder<RS, A, R> = {
  one<T>(ref: BlueprintRef<T>): FuncBuilder<T, A, R>;
};

export type FuncExecContext<RS, A> = {
  resource: RS;
  args: A;
};

export type FuncExecCallback<RS, A, R> = (ctx: FuncExecContext<RS, A>) => Promise<R | R[]>;

export type FuncArgsBuilder<RS, A, R> = {
  (): FuncBuilder<RS, A, R>;
  <T>(is: SchemaIs<T>): FuncBuilder<RS, T, R>;
};

export type FuncResultBuilder<RS, A, R> = {
  (): FuncBuilder<RS, A, R>;
  <T>(is: SchemaIs<T>): FuncBuilder<RS, A, T>;
};

export type FuncExecBuilder<RS, A, R> = {
  (callback: FuncExecCallback<RS, A, R>): FuncBuilder<RS, A, R>;
};

export type FuncBuilder<RS, A, R> = {
  resource: FuncResourceBuilder<RS, A, R>;
  args: FuncArgsBuilder<RS, A, R>;
  result: FuncResultBuilder<RS, A, R>;
  exec: FuncExecBuilder<RS, A, R>;
  spec(): BlockSpec;
};

export function func(): FuncBuilder<void, void, void> {
  let blockBuilder = block()
    .params()
  ;
  
  const builder: FuncBuilder<any, any, any> = {
    resource: {
      one: ref => {
        blockBuilder.resource.one(ref);
        return builder;
      },
    },
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
        const result = await callback({
          resource: ctx.resource,
          args: ctx.params,
        });
        
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
