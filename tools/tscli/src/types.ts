import {
  array,
  assert,
  enums,
  object,
  optional,
  partial,
  string,
  StructType,
} from 'superstruct';

// eslint-disable-next-line @rushstack/typedef-var
const BuildConfigurationStruct = object({
  entry: string(),
  format: array(enums(['cjs', 'esm'])),
  output: string(),
});

// eslint-disable-next-line @rushstack/typedef-var
const TscliConfigurationStruct = optional(
  object({
    build: optional(partial(BuildConfigurationStruct)),
  })
);

export type BuildConfiguration = StructType<typeof BuildConfigurationStruct>;
export type TscliConfiguration = StructType<typeof TscliConfigurationStruct>;

export function checkBuildConfiguration(
  input: unknown
): asserts input is BuildConfiguration {
  assert(input, BuildConfigurationStruct);
}

export function checkTscliConfiguration(
  input: unknown
): asserts input is TscliConfiguration {
  assert(input, TscliConfigurationStruct);
}
