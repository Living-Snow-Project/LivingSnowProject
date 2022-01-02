/* eslint-disable no-console */
interface ILogger {
  Info(message: string): void;
  Warning(message: string): void;
  Error(message: string): void;
}

function ConsoleLogger(): ILogger {
  return {
    Info(message: string): void {
      console.log(message);
    },

    Warning(message: string): void {
      console.warn(message);
    },

    Error(message: string): void {
      console.error(message);
    },
  };
}

const Logger = ConsoleLogger();
export default Logger;
