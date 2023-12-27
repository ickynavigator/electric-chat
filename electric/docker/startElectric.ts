import shell from 'shelljs';
import { env } from '../../env/server';
import { errorMsg } from '../utils';

// 5433 is the logical publisher port
// it is exposed because PG must be able to connect to Electric
const res = shell.exec(
  `docker run \
      -e "DATABASE_URL=${env.DATABASE_URL}" \
      -e "LOGICAL_PUBLISHER_HOST=${env.LOGICAL_PUBLISHER_HOST}" \
      -e "AUTH_MODE=insecure" \
      -e "PG_PROXY_PASSWORD=${env.PG_PROXY_PASSWORD}" \
      -p ${env.ELECTRIC_PORT}:5133 \
      -p ${env.ELECTRIC_PROXY_PORT}:65432 \
      -p 5433:5433 ${env.ELECTRIC_IMAGE}`,
);

if (res.code !== 0 && res.stderr.includes('port is already allocated')) {
  // inform the user that they should change ports
  errorMsg('Could not start Electric because the port seems to be taken.');
}
