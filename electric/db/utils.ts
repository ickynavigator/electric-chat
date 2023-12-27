import shell from 'shelljs';
import { env } from '../../env/server';
import { errorMsg } from '../utils';
shell.config.silent = true; // don't log output of child processes

// If we are running the docker compose file,
// the container running `electric` service will be exposing
// the proxy port which should be used for all DB connections
// that intend to use the DDLX syntax extension of SQL.
const proxyPort = fetchHostProxyPortElectric() ?? 65432;

// URL to use when connecting to the proxy from the host OS
const DATABASE_URL = buildDatabaseURL(
  env.POSTGRES_USER,
  env.PG_PROXY_PASSWORD,
  'localhost',
  proxyPort,
  env.APP_NAME,
);

// URL to use when connecting to the proxy from a Docker container. This is used when `psql` is exec'd inside the
// `postgres` service's container to connect to the poxy running in the `electric` service's container.
const CONTAINER_DATABASE_URL = buildDatabaseURL(
  env.POSTGRES_USER,
  env.PG_PROXY_PASSWORD,
  'electric',
  65432,
  env.APP_NAME,
);

// URL to display in the terminal for informational purposes. It omits the password but is still a valid URL that can be
// passed to `psql` running on the host OS.
const PUBLIC_DATABASE_URL = buildDatabaseURL(
  env.POSTGRES_USER,
  null,
  'localhost',
  proxyPort,
  env.APP_NAME,
);

function buildDatabaseURL(
  user: string,
  password: string | null,
  host: string,
  port: string | number,
  dbName: string,
) {
  return `postgresql://${user}${
    password ? `:${password}` : ''
  }@${host}:${port}/${dbName}`;
}

function error(err: string) {
  errorMsg(err);
  process.exit(1);
}

function fetchHostPortElectric() {
  return (
    env.ELECTRIC_HOST_PORT ??
    fetchHostPort(`${env.APP_NAME}-electric-1`, 5133, 'Electric')
  );
}

function fetchHostProxyPortElectric() {
  return (
    env.ELECTRIC_HOST_PROXY_PORT ??
    fetchHostPort(`${env.APP_NAME}-electric-1`, 65432, 'Electric')
  );
}

// Returns the host port to which the `containerPort` of the `container` is bound.
// Returns undefined if the port is not bound or container does not exist.
function fetchHostPort(
  container: string,
  containerPort: number,
  service: string,
) {
  const output = shell.exec(
    `docker inspect --format="{{(index (index .NetworkSettings.Ports \\"${containerPort}/tcp\\") 0).HostPort}}" ${container}`,
  );
  if (output.code !== 0) {
    // Electric is not running for this app
    error(
      `${service} appears not to be running for this app.\nDocker container ${container} not running.`,
    );
  }
  const port = parseInt(output);
  if (!isNaN(port)) {
    return port;
  }
}

export {
  CONTAINER_DATABASE_URL,
  DATABASE_URL,
  PUBLIC_DATABASE_URL,
  fetchHostPortElectric,
  fetchHostProxyPortElectric,
};
