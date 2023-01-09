'use strict';
/**
 * New Relic agent configuration.
 *
 * See lib/config/default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */

let appName = '';
if (process.env.NODE_ENV === "development") {
  appName = 'development';
} else if (process.env.COPYMOD == 'tmg') {
  appName = 'tmg';
} else if (process.env.COPYMOD == 'tmgdns-qa') {
  appName = 'tmgdns-qa';
} else if (process.env.COPYMOD * 1 == 2) {
  appName = 'production2';
} else if (typeof process.env.COPYMOD != 'undefined') {
  appName = process.env.COPYMOD;
} else {
  appName = 'production';
}

exports.config = {
  /**
   * Array of application names.
   */
  app_name: [appName],
  /**
   * Your New Relic license key.
   */
  license_key: '18b962d388ad7784713bc30395071b16FFFFNRAL',
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info'
  },
  /**
   * When true, all request headers except for those listed in attributes.exclude
   * will be captured for all traces, unless otherwise specified in a destination's
   * attributes include/exclude lists.
   */
  allow_all_headers: true,
  attributes: {
    /**
     * Prefix of attributes to exclude from all destinations. Allows * as wildcard
     * at end.
     *
     * NOTE: If excluding headers, they must be in camelCase form to be filtered.
     *
     * @env NEW_RELIC_ATTRIBUTES_EXCLUDE
     */
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*'
    ]
  }
}