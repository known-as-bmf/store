import createLogger, { ProgressEstimator } from 'progress-estimator';
import { ensureDirSync } from 'fs-extra';

import { ProjectContext } from './project';

export const createProgressEstimator = (
  project: ProjectContext
): ProgressEstimator => {
  const storagePath = project.resolve.fromRoot(
    'node_modules/.cache/.progress-estimator'
  );

  ensureDirSync(storagePath);

  return createLogger({ storagePath });
};
