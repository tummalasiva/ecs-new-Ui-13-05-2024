import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  styled,
} from "@mui/material";

import FormInput from "../../forms/FormInput";
import FormSelect from "../../forms/FormSelect";
import FormDatePicker from "../../forms/FormDatePicker";
import TimezoneSelect from "react-timezone-select";
import currencyCodes from "currency-codes";
import avatar from "../../assets/images/avatar.jpg";
import AddOrUpdateFiles from "../../forms/AddOrUpdateFiles";
import PageHeader from "../../components/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import currencyToSymbolMap from "currency-symbol-map/map";
import { get, post, put } from "../../services/apiMethods";
import { PRIVATE_URLS } from "../../services/urlConstants";
import { LoadingButton } from "@mui/lab";
import FileSelect from "../../forms/FileSelect";

const MuiBox = styled(Box)({
  background: "#ececec",
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  overflow: "hidden",
  backgroundPosition: "center",
});

const FormBox = styled(Box)(({ theme }) => ({
  border: "1px solid",
  borderColor: "lightgray",
  marginBottom: "20px",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

const Title = styled(Typography)(({ theme }) => ({
  textAlign: "start",
  fontSize: "14px",
  padding: "5px 10px",
  borderBottom: "1px solid",
  borderBottomColor: "lightgray",
  fontWeight: "bold",
  color: "white",
  background: theme.palette.secondary.main,
}));

const BasicData = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "15px",
  padding: "15px 0px",
});

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(2),
  position: "fixed",
  bottom: 0,
  right: 0,
  left: 0,
  background: "whitesmoke",
  padding: theme.spacing(2),
  zIndex: 1000,
}));

const RollNumber_Options = [
  {
    label: "Manual",
    value: "Manual",
  },
  {
    label: "Auto ascending name",
    value: "Auto ascending name",
  },
  {
    label: "Auto ascending name female",
    value: "Auto ascending name female",
  },
];
const Attendence_Type = [
  {
    label: "Class wise",
    value: "classWise",
  },
  {
    label: "Section wise",
    value: "sectionWise",
  },
  {
    label: "Session wise",
    value: "sessionWise",
  },
];
const Admission_Options = [
  {
    label: "Manual",
    value: "Manual",
  },
  {
    label: "Auto ascending no",
    value: "Auto ascending no",
  },
];
export default function AddInstitute({ initialValue = null }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const symbol = Object.keys(currencyToSymbolMap);
  const [dataToEdit, setDataToEdit] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);

  const getSchoolDetails = async () => {
    try {
      const { data } = await get(PRIVATE_URLS.school.details + "/" + id);
      setDataToEdit(data.result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (id) {
      getSchoolDetails();
    }
  }, [id]);

  const handleChangePhoto = (e, type) => {
    const { files } = e.target;
    let fileList = [];
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        fileList.push(file);
      }
      if (type === "logo") {
        setLogo(fileList);
      } else if (type === "bannerImages") {
        setBannerImages(fileList);
      }
    } else {
      console.log("No files selected");
    }
  };

  const handleRemoveFile = (fileName, index) => {
    setLogo(logo.filter((img) => img.name != fileName));
    setBannerImages(bannerImages.filter((img) => img.name != fileName));
  };

  const [previewCreateUrl, setPreviewCreateUrl] = useState(null);
  const currencies = currencyCodes.data.map((currency) => ({
    label: `${currency.currency} - ${currency.code}`,
    value: currency.code,
  }));

  // create || update actions
  const handleCreateOrUpdate = async (values) => {
    try {
      const payload = {
        ...values,
      };
      setLoading(true);

      const formData = new FormData();
      formData.append("bodyData", JSON.stringify(payload));
      logo.forEach((f) => formData.append("logo", f));

      if (dataToEdit) {
        const { data } = await put(
          PRIVATE_URLS.school.update + "/" + dataToEdit._id,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        const { data } = await post(PRIVATE_URLS.school.create, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      entryFormik.resetForm();
      setLogo([]);
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const entryFormik = useFormik({
    initialValues: {
      name: dataToEdit?.name || "",
      address: dataToEdit?.address || "",
      phone: dataToEdit?.phone || "",
      regDate: dataToEdit && dataToEdit.regDate ? dataToEdit.regDate : null,
      email: dataToEdit?.email || "",
      fax: dataToEdit?.fax || "",
      websiteFooter: dataToEdit?.websiteFooter || "",
      description: dataToEdit?.description || "",
      currency: dataToEdit?.currency || "",
      currencySymbol: dataToEdit?.currencySymbol || "",
      sessionStartMonth:
        dataToEdit && dataToEdit.sessionStartMonth
          ? dataToEdit.sessionStartMonth
          : null,
      sessionEndMonth:
        dataToEdit && dataToEdit.sessionEndMonth
          ? dataToEdit.sessionEndMonth
          : null,
      rollNumberType: dataToEdit?.rollNumberType || "",
      studentAttendenceType: dataToEdit?.studentAttendenceType || "",
      admissionNo: dataToEdit?.admissionNo || "",
      latitude: dataToEdit?.latitude || "",
      longitude: dataToEdit?.longitude || "",
      defaultTimeZone: dataToEdit?.defaultTimeZone || "",
      googleAnalyticsId: dataToEdit?.googleAnalyticsId || "",
      teacherActivityFeedbackEnabled:
        dataToEdit?.teacherActivityFeedbackEnabled || false,
      facebookUrl: dataToEdit?.facebookUrl || "",
      twitterUrl: dataToEdit?.twitterUrl || "",
      linkedinUrl: dataToEdit?.linkedinUrl || "",
      gplusUrl: dataToEdit?.gplusUrl || "",
      youtubeUrl: dataToEdit?.youtubeUrl || "",
      instagramUrl: dataToEdit?.instagramUrl || "",
      pinterestUrl: dataToEdit?.pinterestUrl || "",
    },
    onSubmit: handleCreateOrUpdate,
    enableReinitialize: true,
  });

  return (
    <>
      <PageHeader title="Add Institute" showTextField={false} />

      <form onSubmit={entryFormik.handleSubmit}>
        <BasicData>
          <MuiBox>
            <img
              src={dataToEdit?.logo || avatar}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "contain",
              }}
              alt="Preview"
            />
          </MuiBox>
          <Grid container spacing={2} display="flex" justifyContent="center">
            <Grid xs={12} md={6} lg={3} item>
              <FileSelect
                multi={false}
                name="logo"
                label="Select Logo"
                onChange={(e) => handleChangePhoto(e, "logo")}
                customOnChange={true}
                selectedFiles={logo}
                onRemove={(fileName) => handleRemoveFile(fileName)}
                accept="image/jpeg, image/png"
              />
            </Grid>
          </Grid>
        </BasicData>

        {/* Basic Info */}
        <FormBox>
          <Title id="modal-modal-title" variant="h6" component="h2">
            Basic Information
          </Title>
          <Box sx={{ padding: "10px" }}>
            <Grid container spacing={2}>
              <Grid xs={12} md={6} lg={3} item>
                <FormInput
                  required={true}
                  name="name"
                  formik={entryFormik}
                  label="School Name"
                />
              </Grid>
              <Grid xs={12} md={6} lg={3} item>
                <FormInput
                  required={true}
                  name="address"
                  formik={entryFormik}
                  label="Address"
                />
              </Grid>

              <Grid xs={12} md={6} lg={3} item>
                <FormInput
                  required={true}
                  name="phone"
                  formik={entryFormik}
                  label="Phone number"
                />
              </Grid>
              <Grid xs={12} md={6} lg={3} item>
                <FormDatePicker
                  formik={entryFormik}
                  label="Registration Date"
                  name="regDate"
                  required={true}
                />
              </Grid>
              <Grid xs={12} md={6} lg={3} item>
                <FormInput
                  required={true}
                  name="email"
                  formik={entryFormik}
                  label="Email"
                />
              </Grid>
              <Grid xs={12} md={6} lg={3} item>
                <FormInput name="fax" formik={entryFormik} label="Fax" />
              </Grid>
              <Grid xs={12} md={6} lg={3} item>
                <FormInput
                  name="websiteFooter"
                  formik={entryFormik}
                  label="Website Footer"
                />
              </Grid>

              <Grid xs={12} md={12} lg={12} item>
                <FormInput
                  name="description"
                  formik={entryFormik}
                  label="Note"
                />
              </Grid>
            </Grid>
          </Box>
        </FormBox>

        {/* Settings */}
        <FormBox>
          <Title id="modal-modal-title" variant="h6" component="h2">
            Setting Information
          </Title>
          <Box sx={{ padding: "10px" }}>
            <Grid container spacing={2}>
              <Grid xs={12} md={6} lg={3} item>
                <FormSelect
                  name="currency"
                  formik={entryFormik}
                  label="Currency"
                  options={currencies}
                  onChange={(event) => {
                    const selectedCurrency = event.target.value;
                    entryFormik.setFieldValue("currency", selectedCurrency);
                    entryFormik.setFieldValue(
                      "currencySymbol",
                      currencyToSymbolMap[selectedCurrency]
                    );
                  }}
                />
              </Grid>
              <Grid xs={12} md={6} lg={3} item>
                <FormInput
                  name="currencySymbol"
                  formik={entryFormik}
                  label="Currency Symbol"
                  disabled
                />
              </Grid>
              <Grid xs={12} md={6} lg={3} item>
                <FormDatePicker
                  formik={entryFormik}
                  label="Session Start Month"
                  name="sessionStartMonth"
                  openTo="month"
                  inputFormat="MM"
                  views={["month"]}
                  required={true}
                />
              </Grid>
              <Grid xs={12} md={6} lg={3} item>
                <FormDatePicker
                  formik={entryFormik}
                  label="Session End Month"
                  name="sessionEndMonth"
                  openTo="month"
                  inputFormat="MM"
                  views={["month"]}
                  required={true}
                />
              </Grid>

              <Grid xs={12} md={6} lg={3} item>
                <FormSelect
                  name="rollNumberType"
                  formik={entryFormik}
                  label="Roll Number"
                  options={RollNumber_Options}
                />
              </Grid>
              <Grid xs={12} md={6} lg={3} item>
                <FormSelect
                  required={true}
                  name="studentAttendenceType"
                  formik={entryFormik}
                  label="Attendence Type "
                  options={Attendence_Type}
                />
              </Grid>

              <Grid xs={12} md={6} lg={3} item>
                <FormSelect
                  name="admissionNo"
                  formik={entryFormik}
                  label="Admission Numder"
                  options={Admission_Options}
                />
              </Grid>

              <Grid xs={12} md={6} lg={3} item>
                <FormInput
                  name="latitude"
                  formik={entryFormik}
                  label="Latitude"
                />
              </Grid>

              <Grid xs={12} md={6} lg={3} item>
                <FormInput
                  name="longitude"
                  formik={entryFormik}
                  label="Longitude"
                />
              </Grid>
              <Grid xs={12} md={6} lg={3} item mt={2}>
                <TimezoneSelect
                  styles={{
                    control: (baseStyle, state) => ({
                      ...baseStyle,
                      height: "42px",
                    }),
                    menu: (provided, state) => ({
                      ...provided,
                      zIndex: 1000,
                      backgroundColor: "white",
                    }),
                  }}
                  placeholder="Select Default Timezone"
                  name="defaultTimeZone"
                  value={entryFormik.values.defaultTimeZone}
                  onChange={(value) =>
                    entryFormik.setFieldValue("defaultTimeZone", value)
                  }
                  label="Time Zone"
                />
              </Grid>

              <Grid xs={12} md={6} lg={3} item>
                <FormInput
                  name="googleAnalyticsId"
                  formik={entryFormik}
                  label="Google Analytics Id"
                />
              </Grid>
              <Grid xs={12} md={6} lg={3} item>
                <FormSelect
                  name="teacherActivityFeedbackEnabled"
                  formik={entryFormik}
                  label="Teacher Activity Feedack Enable"
                  options={[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ]}
                />
              </Grid>
            </Grid>
          </Box>
        </FormBox>

        {/* Social Info */}
        <FormBox sx={{ marginBottom: !dataToEdit ? "60px" : "20px" }}>
          <Title id="modal-modal-title" variant="h6" component="h2">
            Social Information
          </Title>
          <Box sx={{ padding: "10px" }}>
            <Grid container spacing={2}>
              <Grid xs={12} md={6} lg={3} item>
                <FormInput
                  name="facebookUrl"
                  formik={entryFormik}
                  label="Facebook URL"
                />
              </Grid>
              <Grid xs={12} md={6} lg={3} item>
                <FormInput
                  name="twitterUrl"
                  formik={entryFormik}
                  label="TwitterURL"
                />
              </Grid>
              <Grid xs={12} md={6} lg={3} item>
                <FormInput
                  name="linkedinUrl"
                  formik={entryFormik}
                  label="Linkedin Url"
                />
              </Grid>
              <Grid xs={12} md={6} lg={3} item>
                <FormInput
                  name="gplusUrl"
                  formik={entryFormik}
                  label="Google Plus Url"
                />
              </Grid>
              <Grid xs={12} md={6} lg={3} item>
                <FormInput
                  name="youtubeUrl"
                  formik={entryFormik}
                  label="Youtube URL"
                />
              </Grid>
              <Grid xs={12} md={6} lg={3} item>
                <FormInput
                  name="instagramUrl"
                  formik={entryFormik}
                  label="Instagram URL"
                />
              </Grid>
              <Grid xs={12} md={6} lg={3} item>
                <FormInput
                  name="pinterestUrl"
                  formik={entryFormik}
                  label="Pinterest URL"
                />
              </Grid>
            </Grid>
          </Box>
        </FormBox>

        {/* Banner Images */}
        {dataToEdit ? (
          <FormBox sx={{ marginBottom: "60px" }}>
            <Title id="modal-modal-title" variant="h6" component="h2">
              Banner Image
            </Title>
            <Box sx={{ padding: "10px" }}>
              <Grid container spacing={2}>
                <Grid
                  container
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  justifyContent="flex-end"
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <AddOrUpdateFiles
                      accept="image/jpeg, image/png"
                      title="Upload Image"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </FormBox>
        ) : null}
        <Grid container>
          <Grid item xs={12} md={12}>
            <StyledBox>
              <Stack spacing={2} direction="row">
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <LoadingButton
                  loading={loading}
                  type="submit"
                  size="small"
                  variant="contained"
                >
                  {dataToEdit ? "Update" : "Submit"}
                </LoadingButton>
              </Stack>
            </StyledBox>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
