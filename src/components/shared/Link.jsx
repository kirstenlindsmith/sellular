import { useCallback } from 'react';

const Link = ({
  href,
  options = { replace: false, state: {} },
  children,
  ...props
}) => {
  const handleClick = useCallback(
    (e) => {
      e?.preventDefault();
      if (window.location.pathname !== href) {
        if (options.replace) {
          window.location.replace(href);
        } else {
          window.history.pushState(options.state, '', href);
        }
        //dispatch event that the usePath hook can catch and use to rerender react in response to route change
        const navEvent = new PopStateEvent('popstate');
        window.dispatchEvent(navEvent);
      }
    },
    [options.replace, options.state, href]
  );

  return (
    <a onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export default Link;
