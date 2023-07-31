import type {
  SchemaIs,
  ShapeIs,
  BlueprintRef,
  BlockEnumerateCallback,
  BlockPullCallback,
  BlockProcessCallback,
  BlockSpec,
} from 'triex-types';
import { isAndDefaults } from './utils';

export type BlockQueueBuilder<I, O, R, S, N, P> = {
  (): BlockBuilder<object, O, R, S, N, P>;
  <T>(is: SchemaIs<T>): BlockBuilder<T, O, R, S, N, P>;
};

export type BlockInputBuilder<I, O, R, S, N, P> = {
  none(): BlockBuilder<I, O, R, S, N, P>;
  
  one(): BlockBuilder<object, O, R, S, N, P>;
  one<T>(is: SchemaIs<T>): BlockBuilder<T, O, R, S, N, P>;
  
  many(): BlockBuilder<object, O, R, S, N, P>;
  many<T>(is: ShapeIs<T>): BlockBuilder<T, O, R, S, N, P>;
};

export type BlockOutputBuilder<I, O, R, S, N, P> = {
  none(): BlockBuilder<I, void, R, S, N, P>;
  
  one(): BlockBuilder<I, object, R, S, N, P>;
  one<T>(is: SchemaIs<T>): BlockBuilder<I, T, R, S, N, P>;
  
  many(): BlockBuilder<I, object, R, S, N, P>;
  many<T>(is: ShapeIs<T>): BlockBuilder<I, T, R, S, N, P>;
};

export type BlockResourceBuilder<I, O, R, S, N, P> = {
  one<T>(ref: BlueprintRef<T>): BlockBuilder<I, O, T, S, N, P>;
};

export type BlockStateBuilder<I, O, R, S, N, P> = {
  (): BlockBuilder<I, O, R, object, N, P>;
  <T>(is: SchemaIs<T>): BlockBuilder<I, O, R, T, N, P>;
};

export type BlockOptionsBuilder<I, O, R, S, N, P> = {
  (): BlockBuilder<I, O, R, S, object, P>;
  <T>(is: SchemaIs<T>): BlockBuilder<I, O, R, S, T, P>;
};

export type BlockParamsBuilder<I, O, R, S, N, P> = {
  (): BlockBuilder<I, O, R, S, N, object>;
  <T>(is: SchemaIs<T>): BlockBuilder<I, O, R, S, N, T>;
};

export type BlockEnumerateBuilder<I, O, R, S, N, P> = {
  (callback: BlockEnumerateCallback<R, P>): BlockBuilder<I, O, R, S, N, P>;
};

export type BlockPullBuilder<I, O, R, S, N, P> = {
  (callback: BlockPullCallback<I, R, S, N>): BlockBuilder<I, O, R, S, N, P>;
};

export type BlockProcessBuilder<I, O, R, S, N, P> = {
  (callback: BlockProcessCallback<I, O, R, S, P>): BlockBuilder<I, O, R, S, N, P>;
};

export type BlockBuilder<I, O, R, S, N, P> = {
  queue: BlockQueueBuilder<I, O, R, S, N, P>;
  input: BlockInputBuilder<I, O, R, S, N, P>;
  output: BlockOutputBuilder<I, O, R, S, N, P>;
  resource: BlockResourceBuilder<I, O, R, S, N, P>;
  state: BlockStateBuilder<I, O, R, S, N, P>;
  options: BlockOptionsBuilder<I, O, R, S, N, P>;
  params: BlockParamsBuilder<I, O, R, S, N, P>;
  enumerate: BlockEnumerateBuilder<I, O, R, S, N, P>;
  pull: BlockPullBuilder<I, O, R, S, N, P>;
  process: BlockProcessBuilder<I, O, R, S, N, P>;
  spec: () => BlockSpec;
};

export function block(): BlockBuilder<void, void, void, void, void, void> {
  const spec: BlockSpec = {
    queue: null,
    input: null,
    output: null,
    resource: null,
    state: null,
    options: null,
    params: null,
    enumerate: null,
    pull: null,
    process: null,
  };
  
  const builder: BlockBuilder<any, any, any, any, any, any> = {
    queue: (is?: SchemaIs<object>) => {
      if (is) {
        spec.queue = { is };
      } else {
        spec.queue = { is: null };
      }
      return builder;
    },
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
    options: (is?: SchemaIs<object>) => {
      spec.options = isAndDefaults(is, undefined);
      return builder;
    },
    params: (is?: SchemaIs<object>) => {
      spec.params = isAndDefaults(is, undefined);
      return builder;
    },
    enumerate: callback => {
      spec.enumerate = callback;
      return builder;
    },
    pull: callback => {
      spec.pull = callback;
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
