import httpStatus from 'http-status';

// GET /api/v1/users
export function aiRoot(req, res) {
  res.status(httpStatus.OK).json({
    result: 'ok',
    message: 'AI Test Passed!!',
    body: req.body,
  });
}

export function test() {}
