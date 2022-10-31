/* eslint-disable no-console */
interface ILogger {
  Info(message: string): void;
  Warn(message: string): void;
  Error(message: string): void;
}

function TestLogger(): ILogger {
  return {
    Info(): void {},
    Warn(): void {},
    Error(): void {},
  };
}

// DevelopmentLogger is strictly used for debugging
function DevelopmentLogger(): ILogger {
  return {
    Info(message: string): void {
      console.log(message);
    },

    Warn(message: string): void {
      console.log(message);
    },

    Error(message: string): void {
      console.log(message);
    },
  };
}

// ProductionLogger will pipe to a cloud reporting service
/* function ProductionLogger(): ILogger {
  return {
    Info(message: string): void {
    },

    Warn(message: string): void {
    },

    Error(message: string): void {
    },
  };
} */

// TODO: figure out what ProductionLogger should do
const Logger =
  process.env.JEST_WORKER_ID !== undefined ? TestLogger() : DevelopmentLogger();

export default Logger;
