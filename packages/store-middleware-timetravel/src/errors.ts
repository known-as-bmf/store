export const errors = {
  invalidStore:
    'Provided value is not a valid store instance or has not been initialized with timetravel middleware.',
  historyDepthValue: (depth: number): string =>
    `historyDepth must be greater than 0, got ${depth}`,
  negativeStep: (steps: number): string =>
    `steps must be greater than or equal to 0, got ${steps}`,
  outOfBoundsBackward: 'Not enough states in history stack to go backward.',
  outOfBoundsForward: 'Not enough states in history stack to go forward.',
};
