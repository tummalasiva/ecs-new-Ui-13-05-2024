import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { Grid } from "@mui/material";
import PageHeader from "../components/PageHeader";
import CustomTable from "../components/Tables/CustomTable";
import { eventTableKeys } from "../data/tableKeys/eventData";
import AddForm from "../forms/AddForm";
import FormModal from "../forms/FormModal";
import FormInput from "../forms/FormInput";
import FormSelect from "../forms/FormSelect";
import FormDatePicker from "../forms/FormDatePicker";
import { PRIVATE_URLS } from "../services/urlConstants";
import { get, post, put } from "../services/apiMethods";
import FileSelect from "../forms/FileSelect";
import SettingContext from "../context/SettingsContext";

export default function Event() {
  const { selectedSetting } = useContext(SettingContext);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [selectImg, setSelectImg] = useState([]);

  const getData = async () => {
    try {
      const { data } = await get(PRIVATE_URLS.event.list);
      console.log(data, "event");
      setData(data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const getRole = async () => {
    try {
      const { data } = await get(PRIVATE_URLS.role.list);
      // console.log(data, "rol");
      setRoles(data.result.map((r) => ({ label: r.name, value: r._id })));
    } catch (error) {
      console.log(error);
    }
  };

  // open add model
  const AddDepartmentHandel = () => {
    setOpen(true);
  };

  const handleChangeFiles = (e) => {
    const { files } = e.target;
    let fileList = [];
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        fileList.push(file);
      }
      setSelectImg(fileList);
    } else {
      console.log("No files selected");
    }
  };

  // create || update actions
  const handleCreateOrUpdate = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("eventFor", values.eventFor);
    formData.append("location", values.location);
    formData.append("fromDate", values.fromDate);
    formData.append("toDate", values.toDate);
    formData.append("isPublic", values.isPublic ? true : false);
    formData.append("video", values.video);
    formData.append("shortEvent", values.shortEvent);
    formData.append("note", values.note);
    selectImg.forEach((file) => formData.append("file", file));
    formData.append("schoolId", selectedSetting._id);

    try {
      setLoading(true);
      if (dataToEdit) {
        const { data } = await put(
          PRIVATE_URLS.event.update + "/" + dataToEdit._id,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        const { data } = await post(PRIVATE_URLS.event.create, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      handleClose();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const entryFormik = useFormik({
    initialValues: {
      title: dataToEdit?.title || "",
      eventFor: dataToEdit?.eventFor || "",
      location: dataToEdit?.location || "",
      fromDate: dataToEdit?.fromDate || "",
      toDate: dataToEdit?.toDate || "",
      isPublic: dataToEdit?.isPublic || false,
      video: dataToEdit?.video || null,
      shortEvent: dataToEdit?.shortEvent || "",
      note: dataToEdit?.note || "",
    },
    onSubmit: handleCreateOrUpdate,
    enableReinitialize: true,
  });

  const handleClose = () => {
    setOpen(false);
    setDataToEdit(null);
    getData();
  };

  useEffect(() => {
    getRole();
    getData();
  }, []);

  return (
    <>
      <PageHeader title="Events" />
      <CustomTable
        actions={["edit", "delete"]}
        bodyDataModal="events"
        bodyData={data}
        tableKeys={eventTableKeys}
      />

      {/* ====== Fab button component =======*/}
      <AddForm title="Add Events" onAddClick={AddDepartmentHandel} />
      {/* ================================== */}

      {/* ==== add/edit academicYear ======== */}
      <FormModal
        open={open}
        formik={entryFormik}
        formTitle="Add Events"
        onClose={handleClose}
        submitButtonTitle="Submit"
        adding={loading}
      >
        <Grid
          rowSpacing={1}
          columnSpacing={2}
          container
          component="form"
          onSubmit={entryFormik.handleSubmit}
        >
          <Grid xs={12} sm={6} md={6} item>
            <FormInput
              formik={entryFormik}
              name="title"
              label="Event Title"
              required={true}
            />
          </Grid>
          <Grid xs={12} sm={6} md={6} item>
            <FormSelect
              formik={entryFormik}
              name="eventFor"
              label="Select Event For"
              required={true}
              options={roles}
            />
          </Grid>
          <Grid xs={12} sm={6} md={6} item>
            <FormInput
              formik={entryFormik}
              name="location"
              label="Location"
              required={true}
            />
          </Grid>
          <Grid xs={12} sm={6} md={6} item>
            <FormDatePicker
              formik={entryFormik}
              name="fromDate"
              label="From Date"
            />
          </Grid>
          <Grid xs={12} sm={6} md={6} item>
            <FormDatePicker
              required={true}
              formik={entryFormik}
              name="toDate"
              label="To Date"
            />
          </Grid>
          <Grid xs={12} sm={6} md={6} item>
            <FormInput formik={entryFormik} name="hostedBy" label="Hosted By" />
          </Grid>
          <Grid xs={12} sm={6} md={6} item>
            <FormInput formik={entryFormik} name="video" label="Video Link" />
          </Grid>
          <Grid xs={12} sm={6} md={6} item>
            {/* <FormInput
              required={true}
              formik={entryFormik}
              type="file"
              name="image"
              label="Select Image"
              inputProps={{
                accept: "image/*",
              }}
            /> */}
            <FileSelect
              name={`image`}
              onChange={(e) => handleChangeFiles(e)}
              customOnChange={true}
              selectedFiles={selectImg}
              // onRemove={(fileName) => handleRemoveFile(fileName)}
              multi={false}
            />
          </Grid>
          <Grid xs={12} sm={6} md={6} item>
            <FormSelect
              formik={entryFormik}
              name="isPublic"
              label="Is Web View"
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
            />
          </Grid>

          <Grid xs={12} sm={6} md={6} item>
            <FormInput
              required={true}
              formik={entryFormik}
              name="shortEvent"
              label="Short event"
            />
          </Grid>
          <Grid xs={12} sm={12} md={12} item>
            <FormInput formik={entryFormik} name="note" label="Note" />
          </Grid>
        </Grid>
      </FormModal>
    </>
  );
}
