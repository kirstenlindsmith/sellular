export const navigate = (url, options = { replace: false, state: {} }) => {
  if (options.replace) {
    window.location.replace(url);
  } else {
    window.history.pushState(options.state, '', url);
  }
  const navEvent = new PopStateEvent('popstate');
  window.dispatchEvent(navEvent);
};
