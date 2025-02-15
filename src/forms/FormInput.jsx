import React from "react";
import { TextField } from "@mui/material";

export default function FormInput({
  name,
  multiline = false,
  rows = {},
  label = "default label",
  formik,
  required = false,
  disabled = false,
  containerStyle = {},
  ...rest
}) {
  const handleInputChange = (e) => {
    const { value } = e.target;
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    formik.setFieldValue(name, capitalizedValue);
  };

  return (
    <TextField
      required={required}
      id={name}
      name={name}
      label={label}
      multiline={multiline}
      rows={4}
      disabled={disabled}
      placeholder={`Enter ${label}`}
      fullWidth
      value={formik.values[name] || ""}
      onChange={handleInputChange}
      error={formik.touched[name] && Boolean(formik.errors[name])}
      helperText={formik.touched[name] && formik.errors[name]}
      sx={{
        mt: 2,
        borderWidth: 1,
        borderRadius: (theme) => theme.shape.borderRadius,
      }}
      variant="outlined"
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{
        multiple: true,
        style: {
          borderWidth: 1,
          height: "42px",
          borderRadius: (theme) => theme.shape.borderRadius,
        },
      }}
      {...rest}
    />
  );
}
