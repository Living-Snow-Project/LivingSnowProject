function TestLogger() {
    return {
        Info() { },
        Warn() { },
        Error() { },
    };
}
// DevelopmentLogger is strictly used for debugging
function DevelopmentLogger() {
    return {
        Info(message) {
            console.log(message);
        },
        Warn(message) {
            console.log(message);
        },
        Error(message) {
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
const Logger = DevelopmentLogger();
export default Logger;
