import type {
  BlockPullContextAny,
  BlockProcessContextAny,
} from 'triex-types';

export type ContextPullData = {
  resource: object | undefined;
  state: object | undefined;
  options: object | undefined;
};

export type ContextPullSnapshot = {
  state: object | undefined;
  options: object | undefined;
};

export type ContextPullResult = {
  next: Date | undefined;
  state: object | undefined;
  objects: object[];
  metrics?: Record<string, number>;
};

export type ContextPull = BlockPullContextAny & {
  snapshot(): ContextPullSnapshot;
  result(): ContextPullResult;
};

export function createPullContext(
  signal: AbortSignal,
  data: ContextPullData,
): ContextPull {
  let next: Date | undefined = undefined;
  let objects: object[] = [];
  let resource = data.resource;
  let state = data.state;
  let options = data.options;
  let snapshot = {
    state,
    options,
  };
  let metrics: Record<string, number> | undefined = undefined;
  
  return {
    signal,
    timer: {
      at: when => {
        next = when;
      },
    },
    queue: {
      push: objs => {
        objects = objects.concat(objs);
      },
    },
    resource,
    state: {
      get: () => state,
      set: (value: object | undefined) => {
        state = value;
      },
    },
    options,
    metrics: {
      set: (key, value) => {
        if (!metrics) {
          metrics = {};
        }
        
        metrics[key] = value;
      },
    },
    snapshot: () => {
      return snapshot;
    },
    result: () => {
      return { next, state, objects, metrics };
    },
  };
}

export type ContextProcessData = {
  input: object;
  resource: object | undefined;
  state: object | undefined;
  params: object | undefined;
};

export type ContextProcessSnapshot = {
  input: object;
  state: object | undefined;
  params: object | undefined;
};

export type ContextProcessResult = {
  state: object | undefined;
  output: object[];
  metrics?: Record<string, number>;
};

export type ContextProcess = BlockProcessContextAny & {
  snapshot(): ContextProcessSnapshot;
  result(): ContextProcessResult;
};

export function createProcessContext(
  signal: AbortSignal,
  data: ContextProcessData,
): ContextProcess {
  let input = data.input;
  let resource = data.resource;
  let state = data.state;
  let params = data.params;
  let output: object[] = [];
  let snapshot = {
    input,
    state,
    params,
  };
  let metrics: Record<string, number> | undefined = undefined;
  
  return {
    signal,
    input,
    output: {
      push: objs => {
        output = output.concat(objs);
      },
    },
    resource,
    state: {
      get: () => state,
      set: (value: object | undefined) => {
        state = value;
      },
    },
    params,
    metrics: {
      set: (key, value) => {
        if (!metrics) {
          metrics = {};
        }
        
        metrics[key] = value;
      },
    },
    snapshot: () => {
      return snapshot;
    },
    result: () => {
      return { state, output, metrics };
    },
  };
}
