import type {
  SchemaIs,
  BlueprintExecuteCallback,
  BlueprintSpec,
} from 'triex-types';

export type BlueprintResourceBuilder<R, C> = {
  <T extends object>(is: SchemaIs<T>): BlueprintBuilder<T, C>;
};

export type BlueprintCommandBuilder<R, C> = {
  <T extends object>(is: SchemaIs<T>): BlueprintBuilder<R, T>;
};

export type BlueprintExecuteBuilder<R, C> = {
  (callback: BlueprintExecuteCallback<R, C>): BlueprintBuilder<R, C>;
};

export type BlueprintBuilder<R, C> = {
  resource: BlueprintResourceBuilder<R, C>;
  command: BlueprintCommandBuilder<R, C>;
  execute: BlueprintExecuteBuilder<R, C>;
  spec: () => BlueprintSpec;
};

export function blueprint(): BlueprintBuilder<object, object> {
  const spec: BlueprintSpec = {
    resource: null,
    command: null,
    execute: async (resource, command) => resource ?? command,
  };
  
  const builder: BlueprintBuilder<any, any> = {
    resource: (is: SchemaIs<object>) => {
      spec.resource = is;
      return builder;
    },
    command: (is: SchemaIs<object>) => {
      spec.command = is;
      return builder;
    },
    execute: callback => {
      spec.execute = callback;
      return builder;
    },
    spec: () => spec,
  };
  
  return builder;
}
