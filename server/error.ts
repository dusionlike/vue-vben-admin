const errorHandler = function (
  error: Error,
  event: { node: { res: { end: (body: string) => void } } },
) {
  event.node.res.end(`[Error Handler] ${error.stack}`);
};

export default errorHandler;
