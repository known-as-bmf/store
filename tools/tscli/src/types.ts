export interface BuildConfiguration {
  readonly entry: string;
  readonly format: ('cjs' | 'esm')[];
  readonly output: string;
}

export interface TscliConfig {
  build?: Partial<BuildConfiguration>;
}
