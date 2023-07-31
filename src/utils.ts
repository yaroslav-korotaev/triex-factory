import type { SchemaIs } from 'triex-types';

export function isAndDefaults(
  is?: SchemaIs<object>,
  defaults?: object,
): { is: SchemaIs<object> | null, defaults: object | null } {
  if (is == undefined) {
    return { is: null, defaults: null };
  } else {
    return { is, defaults: defaults ?? null };
  }
}
