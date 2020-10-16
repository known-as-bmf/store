export const sequence = async <TIn, TOut>(
  array: TIn[],
  factory: (input: TIn) => Promise<TOut>
): Promise<TOut[]> => {
  const results: TOut[] = [];

  for (const item of array) {
    results.push(await factory(item));
  }

  return results;
};
