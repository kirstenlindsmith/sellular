export const remToPixels = (remString = '1rem') => {
  const rem = parseFloat(remString.slice(0, remString.indexOf('rem')));
  if (Number.isNaN(rem)) {
    console.error('Invalid rem value: ', remString);
    return 0;
  }
  const localFontSize = parseFloat(
    getComputedStyle(document?.documentElement)?.fontSize
  );
  if (Number.isNaN(localFontSize)) {
    console.error('Error accessing browser font size');
    return 0;
  }
  return rem * localFontSize;
};

export const handleTooltips = () => {
  const showTooltip = (e) => {
    const trigger = e.target;
    const tooltip = trigger?.querySelector('[role=tooltip]') ?? {};
    const { width, height } = trigger?.getBoundingClientRect() ?? {
      width: 0,
      height: 0,
    };
    const tooltipWidth = tooltip?.getBoundingClientRect()?.width ?? 0;
    tooltip.style.left = `${Math.floor(width / 2) - tooltipWidth / 2}px`;
    // tooltip.style.top = `${-remToPixels('1rem')}px`;
    tooltip.style.top = `${Math.floor(height * 2 + remToPixels('1rem'))}px`;
    tooltip.classList.add('active');
  };

  const hideTooltip = (e) => {
    const tooltip = e.target.querySelector('[role=tooltip]');
    tooltip.classList.remove('active');
  };

  const tooltips = document.querySelectorAll('[data-tooltip]') ?? [];
  tooltips.forEach((trigger) => {
    if (!!trigger?.lastElementChild) return;
    //populate tooltips
    const tooltip = document.createElement('div');
    tooltip.setAttribute('role', 'tooltip');
    tooltip.classList.add('tooltip-content');
    tooltip.setAttribute('inert', true);
    tooltip.textContent = trigger?.dataset.tooltip;
    trigger?.appendChild(tooltip);

    //handle displaying tooltips on hover
    trigger?.addEventListener('mouseenter', showTooltip);
    //and hiding tooltip when hover stops
    trigger.addEventListener('mouseleave', hideTooltip);
  });
};
