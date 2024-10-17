import React from 'react';
import { Grid, TextField, Tooltip } from '@mui/material';
import { Info } from 'lucide-react';

interface ParameterInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  tooltip: string;
  min?: number;
  max?: number;
  step?: number;
}

const ParameterInput: React.FC<ParameterInputProps> = ({
  label,
  value,
  onChange,
  tooltip,
  min,
  max,
  step,
}) => {
  return (
    <Grid item xs={12} sm={6}>
      <div className="flex items-center">
        <TextField
          label={label}
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          fullWidth
          margin="normal"
          inputProps={{ min, max, step }}
        />
        <Tooltip title={tooltip} arrow>
          <Info className="ml-2 text-gray-500 cursor-pointer" size={20} />
        </Tooltip>
      </div>
    </Grid>
  );
};

export default ParameterInput;