import type {
  SchemaIs,
  BlueprintRef,
  BlockEnumerateCallback,
  BlockSpec,
} from 'triex-types';
import { block } from './block';

export type StreamInputBuilder<I, R, S, P> = {
  <T>(is: SchemaIs<T>): StreamBuilder<T, R, S, P>;
};

export type StreamResourceBuilder<I, R, S, P> = {
  one<T>(ref: BlueprintRef<T>): StreamBuilder<I, T, S, P>;
};

export type StreamStateBuilder<I, R, S, P> = {
  (): StreamBuilder<I, R, object, P>;
  <T>(is: SchemaIs<T>): StreamBuilder<I, R, T, P>;
};

export type StreamParamsBuilder<I, R, S, P> = {
  (): StreamBuilder<I, R, S, object>;
  <T>(is: SchemaIs<T>): StreamBuilder<I, R, S, T>;
};

export type StreamEnumerateBuilder<I, R, S, P> = {
  (callback: BlockEnumerateCallback<R, P>): StreamBuilder<I, R, S, P>;
};

export type StreamPullArgs<R, S> = {
  resource: R;
  state: S;
};

export type StreamPullResult<I, S> = {
  next?: Date | undefined;
  state?: S | undefined;
  objects?: I[];
};

export type StreamPullCallback<I, R, S> = (
  args: StreamPullArgs<R, S>,
) => Promise<StreamPullResult<I, S>>;

export type StreamPullBuilder<I, R, S, P> = {
  (callback: StreamPullCallback<I, R, S>): StreamBuilder<I, R, S, P>;
};

export type StreamProcessArgs<I, R, P> = {
  input: I;
  resource: R;
  params: P;
};

export type StreamProcessResult = {
  output?: object[];
};

export type StreamProcessCallback<I, R, P> = (
  args: StreamProcessArgs<I, R, P>,
) => Promise<StreamProcessResult>;

export type StreamProcessBuilder<I, R, S, P> = {
  (callback: StreamProcessCallback<I, R, P>): StreamBuilder<I, R, S, P>;
};

export type StreamBuilder<I, R, S, P> = {
  input: StreamInputBuilder<I, R, S, P>;
  resource: StreamResourceBuilder<I, R, S, P>;
  state: StreamStateBuilder<I, R, S, P>;
  params: StreamParamsBuilder<I, R, S, P>;
  enumerate: StreamEnumerateBuilder<I, R, S, P>;
  pull: StreamPullBuilder<I, R, S, P>;
  process: StreamProcessBuilder<I, R, S, P>;
  spec: () => BlockSpec;
};

export function stream(): StreamBuilder<object, void, void, void> {
  let blockBuilder = block()
    .input.none()
    .output.one()
  ;
  
  const builder: StreamBuilder<any, any, any, any> = {
    input: is => {
      blockBuilder.queue(is);
      return builder;
    },
    resource: {
      one: ref => {
        blockBuilder.resource.one(ref);
        return builder;
      },
    },
    state: (is?: SchemaIs<object>) => {
      if (is) {
        blockBuilder.state(is);
      } else {
        blockBuilder.state();
      }
      return builder;
    },
    params: (is?: SchemaIs<object>) => {
      if (is) {
        blockBuilder.params(is);
      } else {
        blockBuilder.params();
      }
      return builder;
    },
    enumerate: callback => {
      blockBuilder.enumerate(callback);
      return builder;
    },
    pull: callback => {
      blockBuilder.pull(async ctx => {
        const result = await callback({
          resource: ctx.resource,
          state: ctx.state.get(),
        });
        
        if (result.next != undefined) {
          ctx.timer.at(result.next);
        }
        if (result.state != undefined) {
          ctx.state.set(result.state);
        }
        if (result.objects != undefined) {
          ctx.queue.push(result.objects);
        }
      });
      return builder;
    },
    process: callback => {
      blockBuilder.process(async ctx => {
        const result = await callback({
          input: ctx.input,
          resource: ctx.resource,
          params: ctx.params,
        });
        
        if (result.output != undefined) {
          ctx.output.push(result.output);
        }
      });
      return builder;
    },
    spec: () => blockBuilder.spec(),
  };
  
  return builder;
}
