import createError from 'http-errors';

export function error404(req, res, next) {
  next(createError(404));
}

// eslint-disable-next-line
export function generalError(err, req, res, next){
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}
