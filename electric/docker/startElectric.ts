import shell from 'shelljs';
import { portSchema } from '../../env/schema';
import { env } from '../../env/server';

let db = env.DATABASE_URL;
let electricPort = env.ELECTRIC_PORT ?? 5133;
let electricProxyPort = env.ELECTRIC_PROXY_PORT ?? 65432;

let args = process.argv.slice(2);

// There are arguments to parse
while (args.length > 0) {
  const [flag, value] = args;
  args = args.slice(2);

  if (!value) {
    error(`Missing value for option '${flag}'.`);
    process.exit(1);
  }

  switch (flag) {
    case '-db':
      db = value;
      break;
    case '--electric-port':
      electricPort = portSchema.parse(value);
      break;
    case '--electric-proxy-port':
      electricProxyPort = portSchema.parse(value);
      break;
    default:
      error(`Unrecognized option: '${flag}'.`);
      process.exit(1);
  }
}

// 5433 is the logical publisher port
// it is exposed because PG must be able to connect to Electric
const res = shell.exec(
  `docker run \
      -e "DATABASE_URL=${db}" \
      -e "LOGICAL_PUBLISHER_HOST=localhost" \
      -e "AUTH_MODE=insecure" \
      -p ${electricPort}:5133 \
      -p ${electricProxyPort}:65432 \
      -p 5433:5433 ${env.ELECTRIC_IMAGE}`,
);

if (res.code !== 0 && res.stderr.includes('port is already allocated')) {
  // inform the user that they should change ports
  console.error(
    `\x1b[31m
Could not start Electric because the port seems to be taken.
\x1b[0m`,
  );
}

function error(err: Error | string) {
  console.error(
    `\x1b[31m
${err}
yarn electric:start [-db <Postgres connection url>] [--electric-port <port>] [--electric-proxy-port <port>]'
\x1b[0m`,
  );
}
