import type {
  SchemaIs,
  BlockEnumerateCallback,
  StreamProcessCallback,
  StreamSpec,
} from 'triex-types';

export type StreamStateBuilder<S, C, P> = {
  (): StreamBuilder<object, C, P>;
  <T>(is: SchemaIs<T>): StreamBuilder<T, C, P>;
};

export type StreamConfigBuilder<S, C, P> = {
  one<T>(configurator: string): StreamBuilder<S, T, P>;
};

export type StreamParamsBuilder<S, C, P> = {
  (): StreamBuilder<S, C, object>;
  <T>(is: SchemaIs<T>): StreamBuilder<S, C, T>;
};

export type StreamEnumerateBuilder<S, C, P> = {
  (callback: BlockEnumerateCallback<C, P>): StreamBuilder<S, C, P>;
};

export type StreamProcessBuilder<S, C, P> = {
  (callback: StreamProcessCallback<S, C, P>): StreamBuilder<S, C, P>;
};

export type StreamBuilder<S, C, P> = {
  state: StreamStateBuilder<S, C, P>;
  config: StreamConfigBuilder<S, C, P>;
  params: StreamParamsBuilder<S, C, P>;
  enumerate: StreamEnumerateBuilder<S, C, P>;
  process: StreamProcessBuilder<S, C, P>;
  spec(): StreamSpec;
};

export function stream(): StreamBuilder<object, void, void> {
  const spec: StreamSpec = {
    state: null,
    config: null,
    params: null,
    enumerate: null,
    process: null!,
  };
  const builder: StreamBuilder<any, any, any> = {
    state: (is?: SchemaIs<object>) => {
      if (is) {
        spec.state = { is };
      } else {
        spec.state = { is: null };
      }
      return builder;
    },
    config: {
      one: configurator => {
        spec.config = { type: 'one', configurator };
        return builder;
      },
    },
    params: (is?: SchemaIs<object>) => {
      if (is) {
        spec.params = { is };
      } else {
        spec.params = { is: null };
      }
      return builder;
    },
    enumerate: callback => {
      spec.enumerate = callback;
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
