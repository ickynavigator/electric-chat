import z from 'zod';

export const portRegex =
  /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;
export const portSchema = z
  .union([z.string(), z.number()])
  .refine(
    data => portRegex.test(`${data}`),
    data => ({
      message: `Invalid port '${data}'. Port should be between 0 and 65535.`,
    }),
  )
  .transform((data: string | number) => {
    return Number(data);
  });
