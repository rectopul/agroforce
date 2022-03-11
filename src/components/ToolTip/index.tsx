import { ReactChild, ReactFragment, ReactNode, ReactPortal, useState } from 'react';
import Button from '@mui/material/Button';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

interface IToolTipProps {
  children: ReactNode;
  contentMenu: boolean | ReactChild | ReactFragment | ReactPortal;
}

export function ToolTip({
  children,
  contentMenu
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
      title={<React.Fragment>{contentMenu}</React.Fragment>}
    >
      <Button style={{ padding: 0 }}>{ children }</Button>
    </HtmlTooltip>
  );
}
