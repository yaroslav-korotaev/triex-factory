import type {
  SchemaIs,
  ShapeIs,
  BlockEnumerateCallback,
  BlockMethodCallback,
  BlockSpec,
} from 'triex-types';

export type BlockInputBuilder<I, O, S, C, P> = {
  none(): BlockBuilder<void, O, S, C, P>;
  
  one(): BlockBuilder<object, O, S, C, P>;
  one<T>(is: SchemaIs<T>): BlockBuilder<T, O, S, C, P>;
  
  many(): BlockBuilder<object, O, S, C, P>;
  many<T>(is: ShapeIs<T>): BlockBuilder<T, O, S, C, P>;
};

export type BlockOutputBuilder<I, O, S, C, P> = {
  none(): BlockBuilder<I, void, S, C, P>;
  
  one(): BlockBuilder<I, object, S, C, P>;
  one<T>(is: SchemaIs<T>): BlockBuilder<I, T, S, C, P>;
  
  many(): BlockBuilder<I, object, S, C, P>;
  many<T>(is: ShapeIs<T>): BlockBuilder<I, T, S, C, P>;
};

export type BlockStateBuilder<I, O, S, C, P> = {
  (): BlockBuilder<I, O, object, C, P>;
  <T>(is: SchemaIs<T>): BlockBuilder<I, O, T, C, P>;
};

export type BlockConfigBuilder<I, O, S, C, P> = {
  one<T>(configurator: string): BlockBuilder<I, O, S, T, P>;
};

export type BlockParamsBuilder<I, O, S, C, P> = {
  (): BlockBuilder<I, O, S, C, object>;
  <T>(is: SchemaIs<T>): BlockBuilder<I, O, S, C, T>;
};

export type BlockEnumerateBuilder<I, O, S, C, P> = {
  (callback: BlockEnumerateCallback<C, P>): BlockBuilder<I, O, S, C, P>;
};

export type BlockMethodBuilder<I, O, S, C, P> = {
  (callback: BlockMethodCallback<I, O, S, C, P>): BlockBuilder<I, O, S, C, P>;
};

export type BlockBuilder<I, O, S, C, P> = {
  input: BlockInputBuilder<I, O, S, C, P>;
  output: BlockOutputBuilder<I, O, S, C, P>;
  state: BlockStateBuilder<I, O, S, C, P>;
  config: BlockConfigBuilder<I, O, S, C, P>;
  params: BlockParamsBuilder<I, O, S, C, P>;
  enumerate: BlockEnumerateBuilder<I, O, S, C, P>;
  init: BlockMethodBuilder<I, O, S, C, P>;
  trigger: BlockMethodBuilder<I, O, S, C, P>;
  process: BlockMethodBuilder<I, O, S, C, P>;
  spec: () => BlockSpec;
};

export function block(): BlockBuilder<void, void, void, void, void> {
  const spec: BlockSpec = {
    input: null,
    output: null,
    state: null,
    config: null,
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
