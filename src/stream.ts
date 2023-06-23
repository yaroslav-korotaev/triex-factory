import type {
  SchemaIs,
  BlueprintRef,
  BlockEnumerateCallback,
  StreamProcessCallback,
  StreamSpec,
} from 'triex-types';

export type StreamResourceBuilder<R, S, P> = {
  one<T>(ref: BlueprintRef<T>): StreamBuilder<T, S, P>;
};

export type StreamStateBuilder<R, S, P> = {
  (): StreamBuilder<R, object, P>;
  <T>(is: SchemaIs<T>): StreamBuilder<R, T, P>;
};

export type StreamParamsBuilder<R, S, P> = {
  (): StreamBuilder<R, S, object>;
  <T>(is: SchemaIs<T>): StreamBuilder<R, S, T>;
};

export type StreamEnumerateBuilder<R, S, P> = {
  (callback: BlockEnumerateCallback<R, P>): StreamBuilder<R, S, P>;
};

export type StreamProcessBuilder<R, S, P> = {
  (callback: StreamProcessCallback<R, S, P>): StreamBuilder<R, S, P>;
};

export type StreamBuilder<R, S, P> = {
  resource: StreamResourceBuilder<R, S, P>;
  state: StreamStateBuilder<R, S, P>;
  params: StreamParamsBuilder<R, S, P>;
  enumerate: StreamEnumerateBuilder<R, S, P>;
  process: StreamProcessBuilder<R, S, P>;
  spec(): StreamSpec;
};

export function stream(): StreamBuilder<object, void, void> {
  const spec: StreamSpec = {
    resource: null,
    state: null,
    params: null,
    enumerate: null,
    process: null!,
  };
  const builder: StreamBuilder<any, any, any> = {
    resource: {
      one: ref => {
        spec.resource = { type: 'one', ref };
        return builder;
      },
    },
    state: (is?: SchemaIs<object>) => {
      if (is) {
        spec.state = { is };
      } else {
        spec.state = { is: null };
      }
      return builder;
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
