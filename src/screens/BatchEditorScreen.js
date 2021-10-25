import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import {
  batchSampleData,
  stageData,
  extractionTypeData,
  editBatchData,
} from "../constants/testData";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import queryString from "query-string";

import "./BatchEditorScreen.css";

const columns = [
  {
    field: "sampleId",
    headerName: "Sample ID",
    width: 200,
  },
  {
    field: "screening",
    headerName: "Screening Method",
    width: 200,
  },
  {
    field: "number",
    headerName: "# of Samples",
    width: 130,
  },
  {
    field: "kit",
    headerName: "Kit Type",
    width: 150,
  },
  {
    field: "hold",
    headerName: "On Hold",
    width: 150,
  },
  {
    field: "date",
    headerName: "Created Date",
    width: 300,
  },
];

function BatchEditorScreen({ location }) {
  const history = useHistory();
  const query = queryString.parse(location.search);
  const [retrievedBatch, setRetrievedBatch] = React.useState(null);
  const [editMode, setEditMode] = React.useState(query.batchId ? true : false);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [pageSize, setPageSize] = React.useState(15);
  const [initialStage, setInitialStage] = React.useState("");
  const [extractionType, setExtractionType] = React.useState("");
  const [comment, setComment] = React.useState("");

  const editBatchText = "Edit Batch";
  const createBatchText = "Create Batch";

  useEffect(() => {
    setRetrievedBatch(editMode && editBatchData);
    setSelectionModel(editMode && editBatchData ? editBatchData.samples : []);
    setInitialStage(editMode && editBatchData ? editBatchData.stageId : "");
    setExtractionType(
      editMode && editBatchData ? editBatchData.extractionTypeId : ""
    );
    setComment(editMode && editBatchData ? editBatchData.comment : "");
  }, []);

  const onSubmitBatch = () => {
    let batchObj = {
      stageId: initialStage,
      extractionTypeId: extractionType,
      comment: comment,
    };
    if (editMode) {
      //Edit api call
    } else {
      //Create api call
    }
    alert(JSON.stringify(batchObj, null, 4));
    alert(JSON.stringify(selectionModel, null, 4));
  };

  return (
    <div className="screen-holder">
      <Box sx={{ flexGrow: 1 }} style={{ paddingTop: "1em" }}>
        <Grid container spacing={2}>
          <Grid item xs="auto">
            <Button variant="contained" onClick={() => history.goBack()}>
              Cancel
            </Button>
          </Grid>

          <Grid item xs="auto">
            {editMode && (
              <Button variant="contained" onClick={() => history.goBack()}>
                Pull Out Samples
              </Button>
            )}
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs="auto">
            {editMode && (
              <Button
                variant="contained"
                color="error"
                onClick={() => history.goBack()}
              >
                Delete
              </Button>
            )}
          </Grid>
          <Grid item xs="auto">
            <Button variant="contained" onClick={onSubmitBatch}>
              Submit
            </Button>
          </Grid>
        </Grid>
        <h1>{editMode ? editBatchText : createBatchText}</h1>
      </Box>
      <div className="content-wrapper">
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch", maxWidth: "100%" },
          }}
          noValidate
          border="1px solid lightgrey"
          borderRadius="8px"
          autoComplete="off"
        >
          <h3>Batch Information</h3>

          {retrievedBatch && <h4>Batch ID:{retrievedBatch.batchId} </h4>}
          <TextField
            id="outlined-select"
            onChange={(e) => setInitialStage(e.target.value)}
            value={initialStage}
            select
            label="Initial Stage"
          >
            {stageData.map((stage) => (
              <MenuItem key={stage.stageId} value={stage.stageId}>
                {stage.stageName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="outlined-select"
            onChange={(e) => setExtractionType(e.target.value)}
            value={extractionType}
            select
            label="Extraction Type"
          >
            {extractionTypeData.map((extractionType) => (
              <MenuItem
                key={extractionType.extractionTypeId}
                value={extractionType.extractionTypeId}
              >
                {extractionType.extractionTypeName}
              </MenuItem>
            ))}
          </TextField>
          <FormControl fullWidth sx={{ m: 1 }}>
            <TextField
              id="outlined-select"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              label="Comment"
              multiline
              rows={4}
              fullWidth
            />
          </FormControl>
        </Box>
        <DataGrid
          rows={batchSampleData}
          columns={columns}
          getRowId={(r) => r.sampleId}
          checkboxSelection
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          pagination
          rowsPerPageOptions={[15, 20, 50]}
          onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          selectionModel={selectionModel}
          style={{ height: "85%", marginTop: "10px" }}
        />
      </div>
    </div>
  );
}

export default BatchEditorScreen;
