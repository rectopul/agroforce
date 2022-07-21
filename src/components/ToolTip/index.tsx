import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import * as React from 'react';
import {
  ReactChild, ReactFragment, ReactNode, ReactPortal,
} from 'react';

interface IToolTipProps {
  children: ReactNode;
  contentMenu: boolean | ReactChild | ReactFragment | ReactPortal;
}

export function ToolTip({
  children,
  contentMenu,
}: IToolTipProps) {
  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#FFF',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #00a5b4',
    },
  }));

  return (
    <HtmlTooltip
      title={<>{contentMenu}</>}
    >
      {/* <Button style={{ padding: 0 }}>{ children }</Button> */}
      <div style={{ padding: 0 }}>{ children }</div>
    </HtmlTooltip>
  );
}
