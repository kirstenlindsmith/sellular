//NOTE: programmatic navigation a la react router dom
export const navigate = (url, options = { replace: false, state: {} }) => {
  if (options.replace) {
    window.location.replace(url);
  } else {
    window.history.pushState(options.state, '', url);
  }
  //dispatch event that the usePath hook can catch and use to rerender react in response to route change
  const navEvent = new PopStateEvent('popstate');
  window.dispatchEvent(navEvent);
};
