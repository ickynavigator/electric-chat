import { makeElectricContext } from 'electric-sql/react';
import { Electric } from '../generated/client';
import useElectrify from './useElectrify';

const { ElectricProvider, useElectric: useElectricUnsafe } =
  makeElectricContext<Electric>();

const useElectric = () => {
  const electric = useElectricUnsafe();

  if (electric === undefined) {
    throw new Error('Electric context is undefined');
  }

  return electric;
};

type Props = {
  children: React.ReactNode;
};
const ElectricWrapper = (props: Props) => {
  const { children } = props;
  const electric = useElectrify();

  if (electric === undefined) {
    return null;
  }

  return <ElectricProvider db={electric}>{children}</ElectricProvider>;
};

export { useElectric };
export default ElectricWrapper;
