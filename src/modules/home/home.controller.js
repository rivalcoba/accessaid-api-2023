// GET: /
export function renderHomePage(_, res) {
  res.render('home/homeView', { title: 'ITGAM REST-API' });
}

export function fake() {
  return 'test home';
}
