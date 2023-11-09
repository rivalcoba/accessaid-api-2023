import httpStatus from 'http-status';

// GET /api/v1/users
export function aiRoot(_, res) {
  res.status(httpStatus.OK).json({
    result: 'ok',
    message: 'AI Test Passed!!',
  });
}

export function test() {}
