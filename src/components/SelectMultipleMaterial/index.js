import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export function SelectMultipleMaterial({ data = [] }) {
  return (
    <div className="h-10 w-full ml-2">
      <Autocomplete
        disablePortal
        size="small"
        multiple
        limitTags={1}
        //id="multiple-limit-tags"
        options={data}
        getOptionLabel={(option) => option}
        defaultValue={[]}
        renderInput={(params) => <TextField {...params} label="limitTags" />}
        sx={{ width: "200px" }}
      />
    </div>
  );
}
