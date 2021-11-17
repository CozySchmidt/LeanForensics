import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { stageData, extractionTypeData } from "../constants/testData";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import queryString from "query-string";
import { getAllSamples } from "../api/SampleApi";
import { getSamplesByBatchId, pullOutSamplesFromBatch } from "../api/BatchApi";
import { makeStyles, createStyles } from "@mui/styles";
import { createTheme } from "@mui/material/styles";
import "./BatchEditorScreen.css";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .super-app-theme--selected": {
        backgroundColor: "rgba(69, 245, 66, 0.08)",
      },
    },
  })
);

function BatchEditorScreen({ location }) {
  const classes = useStyles();
  const history = useHistory();
  const query = queryString.parse(location.search);
  const [retrievedBatch, setRetrievedBatch] = React.useState(null);
  const [editMode, setEditMode] = React.useState(query.batchId ? true : false);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [initialSelectionModel, setInitialSelectionModel] = React.useState([]);
  const [sampleList, setSampleList] = React.useState([]);
  const [pageSize, setPageSize] = React.useState(15);
  const [initialStage, setInitialStage] = React.useState(
    retrievedBatch ? retrievedBatch.StageId : ""
  );
  const [extractionType, setExtractionType] = React.useState("");
  const [comment, setComment] = React.useState("");

  const editBatchText = "Edit Batch";
  const createBatchText = "Create Batch";

  useEffect(() => {
    retrieveAvailableSamples();
    editMode && retrieveBatchById();
  }, []);

  async function retrieveBatchById() {
    let batch = await getSamplesByBatchId(query.batchId);
    console.log(batch);
    setRetrievedBatch(batch);
    setInitialStage(batch.StageId);
    let selected = batch.Samples.map((sample) => {
      return sample["CaseId"] + "-" + sample["SampleId"];
    });
    // console.log(selected);
    setSelectionModel(selected);
    setInitialSelectionModel(selected);
  }

  async function retrieveAvailableSamples() {
    let samples = await getAllSamples();
    console.log(samples);
    setSampleList(samples);
  }

  const onSubmitBatch = async () => {
    if (editMode) {
      
    } else {
      //Create api call
    }
    // alert(JSON.stringify(batchObj, null, 4));
  };

  const onPullOutSamples = async () => {
    let newSampleList = selectionModel.filter((id) => {
      return !initialSelectionModel.includes(id);
    });
    let deleteSampleList = initialSelectionModel.filter((id) => {
      return selectionModel.includes(id);
    });
    let batchObj = {
      BatchId: retrievedBatch.BatchId,
      BatchName: retrievedBatch.BatchName+"-copy",
      StageId: initialStage,
      ExtractionTypeId: extractionType,
      Comment: comment,
      newSampleList: newSampleList.map((id) => {
        let index = id.indexOf("-");
        return {
          CaseId: parseInt(id.substring(0, index)),
          SampleId: id.substring(index + 1),
        };
      }),
      deleteSampleList: deleteSampleList.map((id) => {
        let index = id.indexOf("-");
        return {
          CaseId: parseInt(id.substring(0, index)),
          SampleId: id.substring(index + 1),
        };
      }),
    };
    // alert(JSON.stringify(batchObj, null, 4));
    let pullOutResult = await pullOutSamplesFromBatch(batchObj);
    if(pullOutResult) {
      history.push("/");
    }else {
      alert("Failed. Something went wrong.");
    }
  }

  return (
    <div className="screen-holder">
      <Box sx={{ flexGrow: 1 }} style={{ paddingTop: "1em" }}>
        <Grid container spacing={2}>
          <Grid item xs="auto">
            <Button variant="contained" onClick={() => history.push("/")}>
              Cancel
            </Button>
          </Grid>

          <Grid item xs="auto">
            {editMode && (
              <Button variant="contained" onClick={onPullOutSamples}>
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

          {retrievedBatch && (
            <div>
              <h4>Batch ID: {retrievedBatch.BatchId} </h4>
              <h4>Name: {retrievedBatch.BatchName} </h4>
            </div>
          )}
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
          rows={sampleList}
          columns={columns}
          getRowId={(r) => r.CaseId + "-" + r.SampleId}
          checkboxSelection
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          pagination
          rowsPerPageOptions={[15, 20, 50]}
          onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          getRowClassName={(params) =>
            initialSelectionModel.includes(params.id) &&
            `super-app-theme--selected`
          }
          className={classes.root}
          selectionModel={selectionModel}
          style={{ height: "85%", marginTop: "10px" }}
        />
      </div>
    </div>
  );
}

const columns = [
  {
    field: "SampleId",
    headerName: "Sample ID",
    width: 100,
  },
  {
    field: "CaseId",
    headerName: "Case ID",
    width: 100,
  },
  {
    field: "ScreeningName",
    field: "Screening Method",
    width: 150,
  },
  {
    field: "KitName",
    headerName: "Kit Type",
    width: 130,
  },
  {
    field: "ExtractionName",
    headerName: "Extraction Type",
    width: 150,
  },
  {
    field: "OnHold",
    headerName: "On Hold",
    width: 150,
    renderCell: (cellValues) => {
      return (
        cellValues === 1 && (
          <Button variant="contained" color="warning">
            On Hold
          </Button>
        )
      );
    },
  },
  {
    field: "CreatedDate",
    headerName: "Created Date",
    width: 300,
  },
];

export default BatchEditorScreen;
