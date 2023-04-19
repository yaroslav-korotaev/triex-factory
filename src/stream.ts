import type {
  SchemaIs,
  StreamHintsCallback,
  StreamOutputCallback,
  StreamProcessCallback,
  StreamSpec,
} from 'triex-types';

export type ParamsBuilderOptions<P extends object> = {
  mandatory?: string[];
  hints?: StreamHintsCallback<P>;
  output?: StreamOutputCallback<P>;
};

export type StreamStateBuilder<S, P> = {
  <T extends object>(is: SchemaIs<T>): StreamBuilder<T, P>;
};

export type StreamParamsBuilder<S, P> = {
  <T extends object>(is: SchemaIs<T>, options?: ParamsBuilderOptions<T>): StreamBuilder<S, T>;
};

export type StreamProcessBuilder<S, P> = {
  (callback: StreamProcessCallback<S, P>): StreamBuilder<S, P>;
};

export type StreamBuilder<S, P> = {
  state: StreamStateBuilder<S, P>;
  params: StreamParamsBuilder<S, P>;
  process: StreamProcessBuilder<S, P>;
  spec(): StreamSpec;
};

export function stream(): StreamBuilder<object, void> {
  const spec: StreamSpec = {
    params: null,
    process: null!,
  };
  const builder: StreamBuilder<any, any> = {
    state: () => {
      return builder;
    },
    params: (is, options) => {
      spec.params = {
        is,
        mandatory: options?.mandatory ?? [],
        hints: options?.hints ?? null,
        output: options?.output as StreamOutputCallback<object> ?? null,
      };
      return builder;
    },
    process: callback => {
      spec.process = callback;
      return builder;
    },
    spec: () => spec,
  };
  
  return builder;
}
