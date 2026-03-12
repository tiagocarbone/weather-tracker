import { Request, Response, NextFunction } from 'express';

type ErrLike = { status?: number; message?: string; stack?: string };

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  // eslint-disable-next-line no-console
  const e = err as ErrLike;
  console.error(e && e.stack ? e.stack : err);
  const status = e && e.status ? e.status : 500;
  const message = e && e.message ? e.message : 'Internal Server Error';
  res.status(status).json({ error: message });
}
