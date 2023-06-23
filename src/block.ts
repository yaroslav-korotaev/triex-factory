import type {
  SchemaIs,
  ShapeIs,
  BlueprintRef,
  BlockEnumerateCallback,
  BlockMethodCallback,
  BlockSpec,
} from 'triex-types';

export type BlockInputBuilder<I, O, R, S, P> = {
  none(): BlockBuilder<void, O, R, S, P>;
  
  one(): BlockBuilder<object, O, R, S, P>;
  one<T>(is: SchemaIs<T>): BlockBuilder<T, O, R, S, P>;
  
  many(): BlockBuilder<object, O, R, S, P>;
  many<T>(is: ShapeIs<T>): BlockBuilder<T, O, R, S, P>;
};

export type BlockOutputBuilder<I, O, R, S, P> = {
  none(): BlockBuilder<I, void, R, S, P>;
  
  one(): BlockBuilder<I, object, R, S, P>;
  one<T>(is: SchemaIs<T>): BlockBuilder<I, T, R, S, P>;
  
  many(): BlockBuilder<I, object, R, S, P>;
  many<T>(is: ShapeIs<T>): BlockBuilder<I, T, R, S, P>;
};

export type BlockResourceBuilder<I, O, R, S, P> = {
  one<T>(ref: BlueprintRef<T>): BlockBuilder<I, O, T, S, P>;
};

export type BlockStateBuilder<I, O, R, S, P> = {
  (): BlockBuilder<I, O, R, object, P>;
  <T>(is: SchemaIs<T>): BlockBuilder<I, O, R, T, P>;
};

export type BlockParamsBuilder<I, O, R, S, P> = {
  (): BlockBuilder<I, O, R, S, object>;
  <T>(is: SchemaIs<T>): BlockBuilder<I, O, R, S, T>;
};

export type BlockEnumerateBuilder<I, O, R, S, P> = {
  (callback: BlockEnumerateCallback<R, P>): BlockBuilder<I, O, R, S, P>;
};

export type BlockMethodBuilder<I, O, R, S, P> = {
  (callback: BlockMethodCallback<I, O, R, S, P>): BlockBuilder<I, O, R, S, P>;
};

export type BlockBuilder<I, O, R, S, P> = {
  input: BlockInputBuilder<I, O, R, S, P>;
  output: BlockOutputBuilder<I, O, R, S, P>;
  resource: BlockResourceBuilder<I, O, R, S, P>;
  state: BlockStateBuilder<I, O, R, S, P>;
  params: BlockParamsBuilder<I, O, R, S, P>;
  enumerate: BlockEnumerateBuilder<I, O, R, S, P>;
  init: BlockMethodBuilder<I, O, R, S, P>;
  trigger: BlockMethodBuilder<I, O, R, S, P>;
  process: BlockMethodBuilder<I, O, R, S, P>;
  spec: () => BlockSpec;
};

export function block(): BlockBuilder<void, void, void, void, void> {
  const spec: BlockSpec = {
    input: null,
    output: null,
    resource: null,
    state: null,
    params: null,
    enumerate: null,
    init: null,
    trigger: null,
    process: null,
  };
  
  const builder: BlockBuilder<any, any, any, any, any> = {
    input: {
      none: () => {
        spec.input = null;
        return builder;
      },
      one: (is?: SchemaIs<object>) => {
        if (is) {
          spec.input = { type: 'one', is };
        } else {
          spec.input = { type: 'one', is: null };
        }
        return builder;
      },
      many: (is?: ShapeIs<object>) => {
        if (is) {
          spec.input = { type: 'many', is };
        } else {
          spec.input = { type: 'many', is: null };
        }
        return builder;
      },
    },
    output: {
      none: () => {
        spec.output = null;
        return builder;
      },
      one: (is?: SchemaIs<object>) => {
        if (is) {
          spec.output = { type: 'one', is };
        } else {
          spec.output = { type: 'one', is: null };
        }
        return builder;
      },
      many: (is?: ShapeIs<object>) => {
        if (is) {
          spec.output = { type: 'many', is };
        } else {
          spec.output = { type: 'many', is: null };
        }
        return builder;
      },
    },
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
    init: callback => {
      spec.init = callback;
      return builder;
    },
    trigger: callback => {
      spec.trigger = callback;
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
