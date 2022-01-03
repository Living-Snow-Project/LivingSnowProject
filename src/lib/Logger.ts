/* eslint-disable no-console */
interface ILogger {
  Info(message: string): void;
  Warn(message: string): void;
  Error(message: string): void;
}

// ConsoleLogger is strictly used for debugging
function ConsoleLogger(): ILogger {
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

// ie. const Logger = Environment === Development ? ConsoleLogger() : ProductionLogger();
const Logger = ConsoleLogger();
export default Logger;
