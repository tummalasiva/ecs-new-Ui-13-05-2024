import React, { useContext, useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import FormSelect from "../../forms/FormSelect";
import { useFormik } from "formik";
import FormInput from "../../forms/FormInput";
import FormDatePicker from "../../forms/FormDatePicker";
import dayjs from "dayjs";
import SettingContext from "../../context/SettingsContext";
import { get, post } from "../../services/apiMethods";
import { PRIVATE_URLS } from "../../services/urlConstants";
import { LoadingButton } from "@mui/lab";

const Gender_Options = [
  {
    label: "Male",
    value: "male",
  },
  {
    label: "Female",
    value: "female",
  },
];

const STATUS_OPTIONS = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

export default function QuickAdmit() {
  const { selectedSetting } = useContext(SettingContext);
  const [academicYear, setAcademicYear] = useState([]);
  const [classData, setClassData] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAcademicYear = async () => {
    try {
      const { data } = await get(PRIVATE_URLS.academicYear.list);
      setAcademicYear(
        data.result.map((d) => ({ label: `${d.from}-${d.to}`, value: d._id }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate = async (values) => {
    try {
      const payload = {
        basicInfo: {
          name: values.name,
          admissionDate: values.admissionDate,
          dob: values.dob,
          gender: values.gender,
          caste: values.caste,
        },
        motherInfo: {
          name: values.motherName,
          contactNumber: values.motherPhone,
        },
        fatherInfo: {
          name: values.fatherName,
          contactNumber: values.fatherPhone,
        },
        academicInfo: {
          class: values.class,
          section: values.section,
          rollNumber: values.rollNumber,
        },
        contactNumber: values.contactNumber,
        academicYear: values.academicYear,
        schoolId: selectedSetting._id,
        active: values.active || true,
      };
      const formData = new FormData();
      formData.append("body", JSON.stringify(payload));

      setLoading(true);
      const { data } = await post(PRIVATE_URLS.student.create, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      entryFormik.resetForm();
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const entryFormik = useFormik({
    initialValues: {
      academicYear: "",
      name: "",
      admissionDate: null,
      dob: null,
      gender: "",
      cast: "",
      contactNumber: "",
      fatherName: "",
      fatherContactNumber: "",
      motherName: "",
      motherContactNumber: "",
      class: "",
      section: "",
      rollNumber: "",
      active: "",
    },
    onSubmit: handleCreate,
  });

  const getSection = async () => {
    try {
      const { data } = await get(PRIVATE_URLS.section.list, {
        params: {
          schoolId: selectedSetting._id,
          search: { class: entryFormik.values.class },
        },
      });
      setSectionData(data.result.map((s) => ({ label: s.name, value: s._id })));
    } catch (error) {
      console.log(error);
    }
  };
  const getClass = async () => {
    try {
      const { data } = await get(PRIVATE_URLS.class.list, {
        params: { schoolId: selectedSetting._id },
      });
      setClassData(data.result.map((s) => ({ label: s.name, value: s._id })));
    } catch (error) {
      console.log(error);
    }
  };

  // get data on page load
  useEffect(() => {
    getAcademicYear();
    getClass();
  }, []);

  useEffect(() => {
    if (entryFormik.values.class) {
      getSection();
    }
  }, [entryFormik.values.class, selectedSetting]);
  return (
    <>
      <PageHeader title="Quick Admit" />
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Grid rowSpacing={1} columnSpacing={2} container>
          <Grid xs={12} md={12} lg={12} item>
            <Typography
              component="span"
              color="red"
              fontWeight="bold"
              sx={{ display: "inline" }}
            >
              Note:{" "}
            </Typography>
            <Typography
              variant="h6"
              component="span"
              fontWeight="bold"
              sx={{ display: "inline" }}
            >
              Student will be admited to session
            </Typography>
          </Grid>
          <Grid xs={12} md={6} lg={3} item>
            <FormSelect
              required={true}
              name="academicYear"
              formik={entryFormik}
              label="Select Academic Year"
              options={academicYear}
            />
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Grid rowSpacing={1} columnSpacing={2} container>
          <Grid xs={12} md={12} lg={12} item>
            <Typography variant="h6" fontWeight="bold">
              Basic Information
            </Typography>
          </Grid>

          <Grid xs={12} md={6} lg={3} item>
            <FormInput
              required={true}
              name="name"
              formik={entryFormik}
              label="Name"
            />
          </Grid>

          <Grid xs={12} md={6} lg={3} item>
            <FormDatePicker
              required={true}
              name="admissionDate"
              formik={entryFormik}
              label="Admission Date"
            />
          </Grid>
          <Grid xs={12} md={6} lg={3} item>
            <FormDatePicker
              required={true}
              name="dob"
              formik={entryFormik}
              label="DOB"
            />
          </Grid>

          <Grid xs={12} md={6} lg={3} item>
            <FormSelect
              required={true}
              name="gender"
              formik={entryFormik}
              label="Select Gender"
              options={Gender_Options}
            />
          </Grid>
          <Grid xs={12} md={6} lg={3} item>
            <FormInput
              required={true}
              name="cast"
              formik={entryFormik}
              label="Cast"
            />
          </Grid>

          <Grid xs={12} md={6} lg={3} item>
            <FormInput
              required={true}
              name="contactNumber"
              formik={entryFormik}
              label="Contact Number"
            />
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Grid rowSpacing={1} columnSpacing={2} container>
          <Grid xs={12} md={12} lg={12} item>
            <Typography variant="h6" fontWeight="bold">
              Parent Information
            </Typography>
          </Grid>
          <Grid xs={12} md={6} lg={3} item>
            <FormInput
              required={true}
              name="fatherName"
              formik={entryFormik}
              label="Father Name"
            />
          </Grid>

          <Grid xs={12} md={6} lg={3} item>
            <FormInput
              required={true}
              name="fatherContactNumber"
              formik={entryFormik}
              label="Father Phone Number"
            />
          </Grid>
          <Grid xs={12} md={6} lg={3} item>
            <FormInput
              required={true}
              name="motherName"
              formik={entryFormik}
              label="Mother Name"
            />
          </Grid>

          <Grid xs={12} md={6} lg={3} item>
            <FormInput
              required={true}
              name="motherContactNumber"
              formik={entryFormik}
              label="Mother Phone Number"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Grid rowSpacing={1} columnSpacing={2} container>
          <Grid xs={12} md={12} lg={12} item>
            <Typography variant="h6" fontWeight="bold">
              Academic Information
            </Typography>
          </Grid>
          <Grid xs={12} md={6} lg={3} item>
            <FormSelect
              required={true}
              name="class"
              formik={entryFormik}
              label="Select Class"
              options={classData}
            />
          </Grid>

          <Grid xs={12} md={6} lg={3} item>
            <FormSelect
              required={true}
              name="section"
              formik={entryFormik}
              label="Select Section"
              options={sectionData}
            />
          </Grid>
          <Grid xs={12} md={6} lg={3} item>
            <FormInput
              required={true}
              name="rollNumber"
              formik={entryFormik}
              label="Select Roll No"
            />
          </Grid>

          <Grid xs={12} md={6} lg={3} item>
            <FormSelect
              required={true}
              name="active"
              formik={entryFormik}
              label="Select active status"
              options={STATUS_OPTIONS}
            />
          </Grid>
        </Grid>
      </Paper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <LoadingButton
          loading={loading}
          onClick={entryFormik.handleSubmit}
          size="small"
          variant="contained"
        >
          Submit
        </LoadingButton>
      </Box>
    </>
  );
}
