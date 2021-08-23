import * as core from '@actions/core';

export interface Logger {
  info(message: string): void;
  error(message: string): void;
}

export class NullLogger implements Logger {
  public info(): void {}
  public error(): void {}
}

export class ActionLogger implements Logger {
  public info(message: string): void {
    core.info(message);
  }

  public error(message: string): void {
    core.error(message);
  }
}

/**
 * Default global ActionLogger.
 */
const logger = new ActionLogger();

export { logger };
