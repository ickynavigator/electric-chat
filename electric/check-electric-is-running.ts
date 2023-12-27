import { env } from '../env/server';
import { fetchHostPortElectric, fetchHostProxyPortElectric } from './db/utils';
import { errorMsg } from './utils';

function checkElectricIsRunning() {
  // will raise an error if Electric is not running
  const port = fetchHostPortElectric();

  // Check that the port on which Electric is running
  // is the same as the port to which the app will connect
  const configuredPort = env.ELECTRIC_PORT;

  if (configuredPort !== port) {
    errorMsg(
      `Your application is configured to connect to Electric on port ${configuredPort} but your instance of Electric is running on port ${port}`,
    );
    process.exit(1);
  }

  // Also check that the proxy port is configured correctly
  const proxyPort = fetchHostProxyPortElectric();
  const configuredProxyPort = env.ELECTRIC_PROXY_PORT;

  if (configuredProxyPort !== proxyPort) {
    errorMsg(
      `Your application is configured to connect to Electric's DB proxy on port ${configuredProxyPort} but your instance of Electric is running the DB proxy on port ${proxyPort}`,
    );
  }
}

checkElectricIsRunning();
