import { EOL } from 'os';

export function formatError(error: any): string {
  if (typeof error === 'string') {
    return error;
  }

  let message = '';

  if (error.plugin) {
    message += `(${error.plugin}) `;
  }

  // if (error.name) {
  //   message += `${error.name}: `;
  // }

  message += `${error.message}${EOL}`;

  if (error.loc) {
    message += `at ${error.loc.file}:${error.loc.line}:${error.loc.column}${EOL}`;
  }

  if (error.frame) {
    message += `${error.frame}${EOL}`;
  } else if (error.stack) {
    message += `${error.stack}${EOL}`;
  }

  return message;
}
