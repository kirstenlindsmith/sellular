import { useCallback, useEffect } from 'react';

export const useTooltips = (watch = []) => {
  const showTooltip = useCallback((e) => {
    const trigger = e.target;
    const tooltip = trigger?.querySelector('[role=tooltip]') ?? {};
    const { x, y, width, height } = trigger?.getBoundingClientRect() ?? {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    tooltip.style.left = `${Math.floor(x + width / 2)}px`;
    tooltip.style.top = `${Math.floor(y + height)}px`;
  }, []);

  useEffect(() => {
    const tooltips = document.querySelectorAll('[data-tooltip]') ?? [];
    console.log('tooltips:', tooltips);
    tooltips.forEach((trigger) => {
      //populate tooltips
      const tooltipContent = document.createElement('div');
      tooltipContent.setAttribute('role', 'tooltip');
      tooltipContent.setAttribute('inert', true);
      tooltipContent.textContent = trigger?.dataset.tooltip;
      trigger?.appendChild(tooltipContent);

      //handle displaying tooltips on hover
      trigger?.addEventListener('mouseenter', showTooltip);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTooltip, ...watch]);
};

export default useTooltips;
