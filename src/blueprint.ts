import type {
  SchemaIs,
  BlueprintTransformCallback,
  BlueprintViewCallback,
  BlueprintSpecPlain,
  BlueprintSpecExternal,
  BlueprintSpec,
} from 'triex-types';

export type BlueprintDataBuilder = {
  (is: SchemaIs<object>): BlueprintBuilderPlain;
};

export type BlueprintTransformBuilder<D, T> = {
  (callback: BlueprintTransformCallback<D, T>): BlueprintBuilderExternal<D, T>;
};

export type BlueprintViewBuilder<D, T> = {
  (callback: BlueprintViewCallback<D>): BlueprintBuilderExternal<D, T>;
};

export type BlueprintBuilderPlain = {
  data: BlueprintDataBuilder;
  spec: () => BlueprintSpecPlain;
};

export type BlueprintBuilderExternal<D, T> = {
  transform: BlueprintTransformBuilder<D, T>;
  view: BlueprintViewBuilder<D, T>;
  spec: () => BlueprintSpecExternal;
};

export type BlueprintBuilder = {
  plain: () => BlueprintBuilderPlain;
  external: () => BlueprintBuilderExternal<object, object>;
};

export function blueprint(): BlueprintBuilder {
  const builder: BlueprintBuilder = {
    plain: () => {
      const spec: BlueprintSpecPlain = {
        type: 'plain',
        data: null,
      };
      
      const builderPlain: BlueprintBuilderPlain = {
        data: is => {
          spec.data = { is };
          return builderPlain;
        },
        spec: () => spec,
      };
      
      return builderPlain;
    },
    external: () => {
      const spec: BlueprintSpecExternal = {
        type: 'external',
        transform: null as any,
        view: null as any,
      };
      
      const builderExternal: BlueprintBuilderExternal<any, any> = {
        transform: callback => {
          spec.transform = callback;
          return builderExternal;
        },
        view: callback => {
          spec.view = callback;
          return builderExternal;
        },
        spec: () => spec,
      };
      
      return builderExternal;
    },
  };
  
  return builder;
}
