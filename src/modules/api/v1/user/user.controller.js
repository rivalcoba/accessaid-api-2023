import httpStatus from 'http-status';

// GET /api/v1/users
export function getUser(_, res) {
  res.status(httpStatus.OK).json({
    result: 'ok',
    message: 'Test Passed!!',
  });
}

export function test() {}
