import { forwardRef, useCallback } from 'react';

const Link = forwardRef(
  (
    { href, options = { replace: false, state: {} }, children, ...props },
    ref
  ) => {
    const handleClick = useCallback(
      (e) => {
        e?.preventDefault();
        if (window.location.pathname !== href) {
          if (options.replace) {
            window.location.replace(href);
          } else {
            window.history.pushState(options.state, '', href);
          }
          const navEvent = new PopStateEvent('popstate');
          window.dispatchEvent(navEvent);
        }
      },
      [options.replace, options.state, href]
    );

    return (
      <a
        ref={ref}
        //href={href}
        onClick={handleClick}
        {...props}
      >
        {children}
      </a>
    );
  }
);

Link.displayName = 'Link';

export default Link;
