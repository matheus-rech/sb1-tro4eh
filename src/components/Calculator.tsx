import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import ParameterInput from './ParameterInput';
import SampleSizeChart from './SampleSizeChart';
import { calculateSampleSize } from '../utils/calculations';

const Calculator: React.FC = () => {
  // Common Parameters
  const [sigma, setSigma] = useState<number>(4);
  const [alpha, setAlpha] = useState<number>(0.05);
  const [power, setPower] = useState<number>(0.8);

  // Adjustment Parameters
  const [dropoutRate, setDropoutRate] = useState<number>(0.2);
  const [designEffect, setDesignEffect] = useState<number>(1);
  const [useCluster, setUseCluster] = useState<boolean>(false);
  const [clusterSize, setClusterSize] = useState<number>(10);
  const [icc, setIcc] = useState<number>(0.02);

  // Method Selection
  const [selectedMethod, setSelectedMethod] = useState<string>('Andrews');

  // Method-Specific Parameter
  const [effectSize, setEffectSize] = useState<number>(3); // Default for Andrews

  // Update Design Effect if Cluster Randomization is used
  const handleUseClusterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseCluster(event.target.checked);
    if (event.target.checked) {
      const de = 1 + (clusterSize - 1) * icc;
      setDesignEffect(de);
    } else {
      setDesignEffect(1);
    }
  };

  // Handle Method Change
  const handleMethodChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const method = event.target.value as string;
    setSelectedMethod(method);
    // Set default effect size based on method
    switch (method) {
      case 'Doi':
        setEffectSize(0.82);
        break;
      case 'Ito':
        setEffectSize(0.4);
        break;
      case 'Andrews':
        setEffectSize(3);
        break;
      // Add more cases if needed
      default:
        setEffectSize(3);
    }
  };

  // Sample Size Calculation
  const sampleSize = calculateSampleSize(
    effectSize,
    sigma,
    alpha,
    power,
    dropoutRate,
    designEffect
  );

  const methodExplanations: { [key: string]: string } = {
    Doi: 'The Doi method is based on observed MMSE changes from Doi et al. study.',
    Ito: 'The Ito method uses the standardized mean difference from Ito et al. meta-analysis.',
    Andrews: 'The Andrews method considers the minimal clinically important difference in MMSE scores.',
    // Add more explanations if needed
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Input Parameters
      </Typography>
      <Grid container spacing={2}>
        {/* Common Parameters */}
        <ParameterInput
          label="Standard Deviation (σ)"
          value={sigma}
          onChange={setSigma}
          tooltip="Represents the variability in MMSE scores among the study population."
          min={1}
          step={0.1}
        />
        <ParameterInput
          label="Alpha (α)"
          value={alpha}
          onChange={setAlpha}
          tooltip="The probability of a Type I error (false positive)."
          min={0.001}
          max={0.1}
          step={0.001}
        />
        <ParameterInput
          label="Power (1 - β)"
          value={power}
          onChange={setPower}
          tooltip="The probability of correctly rejecting the null hypothesis (detecting a true effect)."
          min={0.7}
          max={0.99}
          step={0.01}
        />
        {/* Adjustment Parameters */}
        <ParameterInput
          label="Dropout Rate"
          value={dropoutRate}
          onChange={setDropoutRate}
          tooltip="Expected proportion of participants who may drop out."
          min={0}
          max={0.5}
          step={0.01}
        />
        {/* Method Selection */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="method-select-label">Select Method</InputLabel>
            <Select
              labelId="method-select-label"
              value={selectedMethod}
              onChange={handleMethodChange}
              label="Select Method"
            >
              <MenuItem value="Doi">MMSE Change (Doi method)</MenuItem>
              <MenuItem value="Ito">Standardized Mean Difference (Ito method)</MenuItem>
              <MenuItem value="Andrews">Minimal Clinically Important Difference (Andrews method)</MenuItem>
              {/* Add more methods if needed */}
            </Select>
          </FormControl>
        </Grid>
        {/* Method-Specific Parameter */}
        <ParameterInput
          label={`Effect Size (${selectedMethod} method)`}
          value={effectSize}
          onChange={setEffectSize}
          tooltip={`Effect size based on the ${selectedMethod} method.`}
          min={selectedMethod === 'Andrews' ? 1 : 0.1}
          step={0.01}
        />
        {/* Cluster Randomization Option */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={useCluster}
                onChange={handleUseClusterChange}
                color="primary"
              />
            }
            label="Use Cluster Randomization"
          />
        </Grid>
        {useCluster && (
          <>
            <ParameterInput
              label="Cluster Size (m)"
              value={clusterSize}
              onChange={(value) => {
                setClusterSize(value);
                setDesignEffect(1 + (value - 1) * icc);
              }}
              tooltip="Average number of participants per cluster."
              min={2}
              step={1}
            />
            <ParameterInput
              label="ICC"
              value={icc}
              onChange={(value) => {
                setIcc(value);
                setDesignEffect(1 + (clusterSize - 1) * value);
              }}
              tooltip="Intraclass Correlation Coefficient."
              min={0}
              max={1}
              step={0.01}
            />
          </>
        )}
      </Grid>
      {/* Display Sample Size */}
      <Typography variant="h6" gutterBottom>
        Calculated Sample Size
      </Typography>
      <Typography>
        {selectedMethod} Method: <strong>{sampleSize} participants per group</strong>
      </Typography>
      <Typography variant="body1" gutterBottom>
        {methodExplanations[selectedMethod]}
      </Typography>
      {/* Visualizations */}
      <SampleSizeChart
        sigma={sigma}
        alpha={alpha}
        power={power}
        dropoutRate={dropoutRate}
        designEffect={designEffect}
        selectedMethod={selectedMethod}
      />
    </div>
  );
};

export default Calculator;