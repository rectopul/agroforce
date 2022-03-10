import * as React from 'react';
import { ReactNode } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface IAccordionFilterProps {
  title?: string;
  children: ReactNode;
}

export function AccordionFilter({ title, children }: IAccordionFilterProps) {
  return (
    <div className='w-full shadow-md rounded'>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{ title }</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            { children }
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
