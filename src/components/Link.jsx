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
      if (options.replace) {
        window.location.replace(href);
      } else {
        window.history.pushState(options.state, '', href);
      }
      const navEvent = new PopStateEvent('popstate');
      window.dispatchEvent(navEvent);
    },
    [options.replace, options.state, href]
  );

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export default Link;
