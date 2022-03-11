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
      <Accordion className='w-full px-7'>
        <AccordionSummary
         className='w-full px-10 z-40'
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{ title }</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className='flex flex-col'>
            { children }
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
