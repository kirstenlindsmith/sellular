import { tooltipDelayMs } from '../constants';

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

export const makeRowGroups = (allItems, count = 3) => {
  if (!allItems) return [];
  const roundedItems = [...allItems];
  //if the total items count isn't evenly divisible by the count...
  while (roundedItems.length % count !== 0) {
    //..fill empty row slots with placeholders, to make sure spacing for rows stays consistent despite flex grow styling
    roundedItems.push('placeholder');
  }
  const result = [];
  roundedItems.forEach((item, index) => {
    //prepare a row for every group of {count} items
    if (index % count === 0) {
      result.push([]);
    }
    //directly access each row to establish its members, for time efficiency
    result[result.length - 1].push(item);
  });
  return result;
};

//NOTE: ended up not using tooltip due to a very strange DOM bug I can elaborate on if asked
export const handleTooltips = () => {
  let showTooltipTimer = null;

  const showTooltip = (e) => {
    !!showTooltipTimer && clearTimeout(showTooltipTimer);
    showTooltipTimer = setTimeout(() => {
      const trigger = e.target;
      const tooltip = trigger?.querySelector('[role=tooltip]') ?? {};
      const { width, height } = trigger?.getBoundingClientRect() ?? {
        width: 0,
        height: 0,
      };
      tooltip.style.left = `${Math.floor(width / 2)}px`;
      tooltip.style.top = `${Math.floor(height + remToPixels('0.875rem'))}px`;
      tooltip.classList.add('active');
    }, tooltipDelayMs);
  };

  const hideTooltip = (e) => {
    !!showTooltipTimer && clearTimeout(showTooltipTimer);
    const tooltip = e.target.querySelector('[role=tooltip]');
    tooltip.classList.remove('active');
  };

  const tooltips = document.querySelectorAll('[data-tooltip]') ?? [];
  tooltips.forEach((trigger) => {
    if (
      //if a tooltip has already been created, do nothing
      [...(trigger?.children ?? [])].some((child) => {
        return child.classList?.contains('tooltip-content');
      })
    ) {
      return;
    }

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
