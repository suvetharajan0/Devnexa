export function sendSuccess(res, statusCode, data, meta = undefined) {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}
