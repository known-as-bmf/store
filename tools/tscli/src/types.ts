import {
  array,
  assert,
  enums,
  object,
  string,
  StructType,
  union,
  func,
  type,
  dynamic,
  Struct,
  intersection,
  record,
  any,
  defaulted,
  coerce,
} from 'superstruct';

import { identity } from './utils/function';

// eslint-disable-next-line @rushstack/typedef-var
const outputKind = enums(['cjs', 'es']);
export type OutputKind = StructType<typeof outputKind>;

// eslint-disable-next-line @rushstack/typedef-var
const outputDefinition = intersection([
  type({ format: outputKind }),
  record(string(), any()),
]);
export type OutputDefinition = StructType<typeof outputDefinition>;

// eslint-disable-next-line @rushstack/typedef-var
const format = dynamic<
  StructType<typeof outputKind> | StructType<typeof outputDefinition>
>(
  (value, ctx): Struct<any> => {
    if (typeof value === 'string') {
      return outputKind;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      return outputDefinition;
    } else {
      ctx.fail();
      return union([outputKind, outputDefinition]);
    }
  }
);

// eslint-disable-next-line @rushstack/typedef-var
const BuildConfigurationStruct = object({
  entry: union([string(), array(string())]),
  format: array(outputDefinition),
  output: string(),
  rollup: func(),
});

// eslint-disable-next-line @rushstack/typedef-var
const TscliConfigurationStruct = defaulted(
  object({
    build: defaulted(
      object({
        entry: defaulted(union([string(), array(string())]), 'src/index.ts'),
        format: defaulted(array(format), [
          { format: 'es', entryFileNames: '[name].[format].js' },
          { format: 'cjs', entryFileNames: '[name].[format].js' },
          {
            format: 'cjs',
            minify: true,
            entryFileNames: '[name].[format].min.js',
          },
        ]),
        output: defaulted(string(), 'dist'),
        rollup: defaulted(func(), () => identity),
      }),
      {}
    ),
  }),
  {}
);

export type BuildConfiguration = StructType<typeof BuildConfigurationStruct>;
export type TscliConfiguration = StructType<typeof TscliConfigurationStruct>;

export function checkBuildConfiguration(
  input: unknown
): asserts input is BuildConfiguration {
  //coerce(input, BuildConfigurationStruct);
  assert(input, BuildConfigurationStruct);
}

export function coerceTscliConfiguration(input: unknown): TscliConfiguration {
  return coerce(input, TscliConfigurationStruct);
}
