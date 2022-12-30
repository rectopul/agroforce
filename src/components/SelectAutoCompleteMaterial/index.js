import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export function SelectAutoCompleteMaterial({
  data = [],
  value = "",
  onChange,
}) {
  return (
    <div className="h-10 w-full ml-2">
      <Autocomplete
        disablePortal
        options={data}
        sx={{ width: 200 }}
        size="small"
        renderInput={(params) => (
          <TextField
            {...params}
            value={value}
            onSelect={(e) => onChange(e.target.value)}
          />
        )}
      />
    </div>
  );
}
