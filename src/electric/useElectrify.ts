import { useEffect, useState } from 'react';

import { uniqueTabId } from 'electric-sql/util';
// @ts-ignore
import { LIB_VERSION } from 'electric-sql/version';
import { ElectricDatabase, electrify } from 'electric-sql/wa-sqlite';

import { Electric, schema } from '../generated/client';
import { authToken } from './auth';
import { DEBUG_MODE, ELECTRIC_URL } from './config';

const useElectrify = () => {
  const [electric, setElectric] = useState<Electric>();

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const config = {
        auth: {
          token: authToken(),
        },
        debug: DEBUG_MODE,
        url: ELECTRIC_URL,
      };

      const { tabId } = uniqueTabId();
      const scopedDbName = `basic-${LIB_VERSION}-${tabId}.db`;

      const conn = await ElectricDatabase.init(scopedDbName, '');
      const electric = await electrify(conn, schema, config);

      if (!isMounted) {
        return;
      }

      setElectric(electric);
    };

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  return electric;
};

export default useElectrify;
