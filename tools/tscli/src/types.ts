import {
  array,
  assert,
  enums,
  object,
  optional,
  partial,
  string,
  StructType,
  union,
  func,
  type,
  dynamic,
  boolean,
} from 'superstruct';

// eslint-disable-next-line @rushstack/typedef-var
const outputKind = enums(['cjs', 'esm']);

// eslint-disable-next-line @rushstack/typedef-var
const outputDefinition = type({
  format: outputKind,
  minify: optional(boolean()),
});

// eslint-disable-next-line @rushstack/typedef-var
const test = dynamic<
  StructType<typeof outputKind> | StructType<typeof outputDefinition>
>((value, ctx): any => {
  if (typeof value === 'string') {
    return outputKind;
  } else if (typeof value === 'object' && !Array.isArray(value)) {
    return outputDefinition;
  } else {
    ctx.fail();
    return union([outputKind, outputDefinition]);
  }
});

// eslint-disable-next-line @rushstack/typedef-var
const BuildConfigurationStruct = object({
  entry: union([string(), array(string())]),
  format: array(outputKind),
  output: string(),
  rollup: optional(func()),
  test: array(test),
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
  try {
    assert(input, BuildConfigurationStruct);
  } catch (e) {
    console.table(e);
    throw e;
  }
}

export function checkTscliConfiguration(
  input: unknown
): asserts input is TscliConfiguration {
  try {
    assert(input, TscliConfigurationStruct);
  } catch (e) {
    console.table(e);
    for (const f of e.failures()) {
      console.table(f);
    }
    throw e;
  }
}
