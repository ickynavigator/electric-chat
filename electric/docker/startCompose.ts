import process from 'process';
import { dockerCompose, errorMsg } from '../utils';

dockerCompose('up', process.argv.slice(2), code => {
  if (code !== 0) {
    errorMsg(
      `Failed to start the Electric Service. Check the output from "docker compose" above.
If the error message mentions a port already being allocated or address being already in use,
execute "yarn ports:configure" to run Electric on another port.`,
    );
  }
});
