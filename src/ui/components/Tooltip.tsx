import * as React from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';

export type TooltipProps = {
  content: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  arrowPadding?: number;
  collisionPadding?: number;
  disableHoverablePopup?: boolean;
  disabled?: boolean;
  delay?: number;
  closeDelay?: number;
  children: React.ReactNode;
};

export function Tooltip({
  content,
  side = 'top',
  align = 'center',
  sideOffset = 8,
  arrowPadding = 4,
  collisionPadding = 8,
  disableHoverablePopup = false,
  disabled = false,
  delay,
  closeDelay,
  children,
}: TooltipProps) {
  return (
    <BaseTooltip.Provider delay={delay} closeDelay={closeDelay}>
      <BaseTooltip.Root disableHoverablePopup={disableHoverablePopup} disabled={disabled}>
        <BaseTooltip.Trigger asChild>{children}</BaseTooltip.Trigger>
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner
            side={side}
            align={align}
            sideOffset={sideOffset}
            arrowPadding={arrowPadding}
            collisionPadding={collisionPadding}
            collisionAvoidance={{
              side: 'shift',
              align: 'shift',
              fallbackAxisSide: 'none',
            }}
          >
            <BaseTooltip.Popup>
              <BaseTooltip.Arrow />
              {content}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}

export default Tooltip;
