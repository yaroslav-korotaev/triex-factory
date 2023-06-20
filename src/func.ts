import type {
  SchemaIs,
  FuncExecCallback,
  FuncSpec,
} from 'triex-types';

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
  spec(): FuncSpec;
};

export function func(): FuncBuilder<void, void> {
  const spec: FuncSpec = {
    args: null,
    result: null,
    exec: null!,
  };
  const builder: FuncBuilder<any, any> = {
    args: (is?: SchemaIs<object>) => {
      if (is) {
        spec.args = { is };
      } else {
        spec.args = { is: null };
      }
      return builder;
    },
    result: (is?: SchemaIs<object>) => {
      if (is) {
        spec.result = { is };
      } else {
        spec.result = { is: null };
      }
      return builder;
    },
    exec: callback => {
      spec.exec = callback;
      return builder;
    },
    spec: () => spec,
  };
  
  return builder;
}
