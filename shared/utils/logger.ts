import consola from 'consola'

export const logger = consola.create({
  level: 3
  /**
   * Consola Logging Levels:
   * - -999: Silent (No logs)
   * - 0: Fatal & Error (Only critical errors)
   * - 1: Warnings (Warnings and above)
   * - 2: Normal Logs (Standard logs, including warnings & errors)
   * - 3: Informational Logs (Info, success, fail, ready, start, ...)
   * - 4: Debug Logs (Debugging details)
   * - 5: Trace Logs (Detailed stack traces)
   * - +999: Verbose Logs (All logs)
   */
})
