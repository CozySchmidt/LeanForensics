import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { stageData, extractionTypeData } from "../constants/testData";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import SouthWestIcon from '@mui/icons-material/SouthWest';
import Grid from "@mui/material/Grid";
import queryString from "query-string";
import { getAllSamples } from "../api/SampleApi";
import {
  getSamplesByBatchId,
  pullOutSamplesFromBatch,
  updateBatchInfo,
  createBatch,
} from "../api/BatchApi";
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
  const [initialStage, setInitialStage] = React.useState(1);
  const [extractionType, setExtractionType] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [batchName, setBatchName] = React.useState("");

  const editBatchText = "Edit Batch";
  const createBatchText = "New Batch";

  useEffect(() => {
    retrieveAvailableSamples();
    editMode && retrieveBatchById();
  }, []);

  async function retrieveBatchById() {
    let batch = await getSamplesByBatchId(query.batchId);
    console.log(batch);
    setRetrievedBatch(batch);
    setInitialStage(batch.StageId);
    setExtractionType(batch.ExtractionTypeId);
    setComment(batch.Comment);
    setBatchName(batch.BatchName);

    let selected = await batch.Samples.map((sample) => {
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
      //Edit api call
      let newSampleList = selectionModel.filter((id) => {
        return !initialSelectionModel.includes(id);
      });
      let deleteSampleList = initialSelectionModel.filter((id) => {
        return !selectionModel.includes(id);
      });
      let batchObj = {
        BatchId: retrievedBatch.BatchId,
        batch: {
          BatchName: batchName,
          StageId: initialStage,
          ExtractionTypeId: extractionType,
          Comment: comment,
        },
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
      let batchResult = await updateBatchInfo(batchObj);
      if (batchResult) {
        alert("Successfully Updated.");
        history.push("/");
      } else {
        alert("Failed. Something went wrong.");
      }
    } else {
      //Create api call
      let batchObj = {
        samples: selectionModel.map((id) => {
          let index = id.indexOf("-");
          return {
            CaseId: parseInt(id.substring(0, index)),
            SampleId: id.substring(index + 1),
          };
        }),
        batch: {
          BatchName: batchName,
          StageId: initialStage,
          ExtractionId: extractionType,
          Comment: comment,
        },
      };
      let batchResult = await createBatch(batchObj);
      if (batchResult) {
        alert("Successfully Created.");
        history.push("/");
      } else {
        alert("Failed. Something went wrong.");
      }
    }
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
      BatchName: retrievedBatch.BatchName + "-copy",
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
    if (pullOutResult) {
      alert("Successfully Updated.");
      history.push("/");
    } else {
      alert("Failed. Something went wrong.");
    }
  };

  return (
    <div className="screen-holder">
      <Box sx={{ flexGrow: 1 }} style={{ paddingTop: "1em"}}>
        <Grid container spacing={2}>
          <Grid item xs="auto">
            <div className="batch-editor-buttons">
              <Button
                  startIcon={<ClearIcon />}
                  sx={{
                color: "whitesmoke",
                backgroundColor: "#003C71",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    '&:hover': {
                      backgroundColor: "#D3D9DE",
                      color: "#003C71",
                      fontWeight: "bold"
                    }
              }} loading variant="outlined" onClick={() => history.push("/")}>
                Cancel
              </Button>
            </div>
          </Grid>
          <Grid item xs={4}></Grid>
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
          border="1px solid #FFF200"
          borderRadius="8px"
          padding="20px"
          autoComplete="off"
          backgroundColor="whitesmoke"
          color="#003C71"
        >
          <Grid item xs="auto">
            <div className="pull-button">
              {editMode && (
                  <Button loading variant="outlined" onClick={onPullOutSamples}
                          startIcon={<SouthWestIcon />}
                          sx={{
                            color: "whitesmoke",
                            backgroundColor: "#4682B4",
                            fontWeight: "bold",
                            textTransform: "capitalize",
                            '&:hover': {
                              backgroundColor: "#90CAF9",
                              color: "#003C71",
                              fontWeight: "bold"
                            }
                          }}
                  >
                    Pull Samples
                  </Button>
              )}
            </div>
          </Grid>
          <Grid item xs="auto">
            <div className="box-buttons">
              {editMode && (
                  <Button
                      loading variant="outlined"
                      startIcon={<DeleteIcon />}
                      sx={{
                        backgroundColor: "red",
                        color: "whitesmoke",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                        '&:hover': {
                          backgroundColor: "red",
                          color: "#003C71",
                          fontWeight: "bold"
                        }
                      }}
                      color="error"
                      onClick={() => history.goBack()}
                  >
                    Delete
                  </Button>
              )}
              <div className="divider"/>
              <Button loading variant="outlined"
                  // startIcon={<EditIcon />}
                      sx={{
                        color: "whitesmoke",
                        backgroundColor: "#4682B4",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                        '&:hover': {
                          backgroundColor: "#90CAF9",
                          color: "#003C71",
                          fontWeight: "bold"
                        }
                      }}
                      onClick={onSubmitBatch}>
                {editMode ? "Edit Batch" : "Submit"}
              </Button>
            </div>
          </Grid>
          <h2>Batch Information</h2>

          {retrievedBatch && (
            <div>
              <h3>Batch ID: {retrievedBatch.BatchId} </h3>
            </div>
          )}
          <TextField variant="standard"
                    //  error
                    //  id="outlined-error-helper-text"
                    //  helperText="Required"
                     value={batchName}
                     label="Batch Name"
                     fullWidth
                     onChange={(e) => setBatchName(e.target.value)}
          />
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
              noValidate
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
          style={{
            height: "85%",
            marginTop: "10px",
            marginBottom: "20px",
            backgroundColor: "whitesmoke",
            color: "#003C71",
            border: "1px solid #FFF200"
          }}
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
    headerName: "Screening Method",
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
          <Button loading variant="outlined" color="warning">
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
