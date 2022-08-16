import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { ReactNode } from "react";

interface IAccordionFilterProps {
  title?: string;
  children: ReactNode;
  grid?: boolean;
}

export function AccordionFilter({
  title,
  children,
  grid = false,
}: IAccordionFilterProps) {
  return (
    <div className="w-full shadow-md rounded">
      <Accordion className="w-full" defaultExpanded={grid}>
        <AccordionSummary
          style={{ paddingLeft: 10, paddingRight: 10 }}
          className="w-full"
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails className="max-h-72 overflow-y-auto">
          <Typography className="flex flex-col">{children}</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
