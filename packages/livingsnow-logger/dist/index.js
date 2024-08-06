var _a;
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
const Logger = ((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.JEST_WORKER_ID) !== undefined
    ? TestLogger()
    : DevelopmentLogger();
export default Logger;
