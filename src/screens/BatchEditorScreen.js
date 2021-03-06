import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import SouthWestIcon from "@mui/icons-material/SouthWest";
import Grid from "@mui/material/Grid";
import queryString from "query-string";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { getAllSamples } from "../api/SampleApi";
import {
  getSamplesByBatchId,
  pullOutSamplesFromBatch,
  updateBatchInfo,
  createBatch,
  deleteBatch,
} from "../api/BatchApi";
import { makeStyles, createStyles } from "@mui/styles";
import { createTheme } from "@mui/material/styles";
import "./BatchEditorScreen.css";
import { getAllExtractionMethods, getAllStages } from "../api/OthersApi";
import FormHelperText from "@mui/material/FormHelperText";

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
  const [extractionType, setExtractionType] = React.useState(null);
  const [comment, setComment] = React.useState("");
  const [batchName, setBatchName] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [extractionTypeData, setExtractionTypeData] = React.useState([]);
  const [stageData, setStageData] = React.useState([]);
  const [initialStageError, setInitialStageError] = React.useState(false);
  const [extractionTypeError, setExtractionTypeError] = React.useState(false);

  const editBatchText = "Edit Batch";
  const createBatchText = "New Batch";

  useEffect(() => {
    retrieveAvailableSamples();
    retrieveExtractionMethods();
    retrieveStages();
    editMode && retrieveBatchById();
  }, []);

  const handleClickDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const retrieveExtractionMethods = async () => {
    let methods = await getAllExtractionMethods();
    console.log(methods);
    setExtractionTypeData(methods);
  };

  const retrieveStages = async () => {
    let stages = await getAllStages();
    console.log(stages);
    setStageData(stages);
  };

  async function retrieveBatchById() {
    let batch = await getSamplesByBatchId(query.batchId);
    console.log(batch);
    setRetrievedBatch(batch);
    setInitialStage(batch.StageId ?? "");
    setExtractionType(batch.ExtractionId ?? "");
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

  const onDeleteBatch = async () => {
    setOpenDialog(false);
    let result = await deleteBatch(retrievedBatch.BatchId);
    if (result) {
      alert("Successfully Deleted.");
      history.push("/");
    } else {
      alert("Failed. Something went wrong.");
    }
  };

  /* Input validation */
  const handleValidate = () => {
    let isValidated = true;

    setInitialStageError(false);
    setExtractionTypeError(false);

    if (initialStage < 1 || initialStage.length === 0) {
      setInitialStageError(true);
      isValidated = false;
    }
    if (extractionType < 1 || extractionType.length === 0) {
      setExtractionTypeError(true);
      isValidated = false;
    }
    return isValidated;
  };

  const onSubmitBatch = async () => {
    if (selectionModel.length > 0) {
      if (editMode) {
        //Edit api call
        let newSampleList = selectionModel.filter((id) => {
          return !initialSelectionModel.includes(id);
        });
        let deleteSampleList = initialSelectionModel.filter((id) => {
          return !selectionModel.includes(id);
        });
        let extractionId = extractionType.length === 0 ? 0 : extractionType;
        let batchObj = {
          BatchId: retrievedBatch.BatchId,
          batch: {
            BatchName: batchName,
            StageId: initialStage,
            ExtractionId: extractionId,
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
      } else if (!handleValidate()) {
          console.log("ERROR: Please fill in all the required fields.");
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
          alert("Successfully created batch.");
          history.push("/");
        } else {
          alert("Failed. Something went wrong.");
        }
      }
    } else {
      alert("Batch must contain at least one sample.")
    }
  };

  const onPullOutSamples = async () => {
    let newSampleList = selectionModel.filter((id) => {
      return !initialSelectionModel.includes(id);
    });
    let deleteSampleList = initialSelectionModel.filter((id) => {
      return selectionModel.includes(id);
    });
    if (deleteSampleList.length !== initialSelectionModel.length) {
      if (selectionModel.length > 0) {
        let batchObj = {
          BatchId: retrievedBatch.BatchId,
          BatchName: retrievedBatch.BatchName + "-copy",
          StageId: initialStage,
          ExtractionId: extractionType,
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
      } else {
        alert("Cannot create empty batch.");
      }
    } else {
      alert("Cannot remove all samples in this batch. ");
    }
  };

  const DialogView = () => {
    return (
      retrievedBatch && (
        <Dialog
          open={openDialog}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Delete Batch ${retrievedBatch.BatchId}? ${retrievedBatch.BatchName}`}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleDialogClose}>No</Button>
            <Button onClick={onDeleteBatch} autoFocus>
              YES
            </Button>
          </DialogActions>
        </Dialog>
      )
    );
  };

  return (
    <div className="screen-holder">
      <Box
        sx={{ flexGrow: 1 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className="button-container">
              <Button id="cancel-btn"
                startIcon={<ClearIcon />}
                variant="outlined"
                onClick={() => history.push("/")}
              >
                Cancel
              </Button>
            </div>
          </Grid>
        </Grid>
        <h1>{editMode ? editBatchText : createBatchText}</h1>
      </Box>
      <div className="content-wrapper">
        <Grid justify="flex-end">
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m:1, width: "24ch", maxWidth: "100%"},
            }}
            noValidate
            border="1px solid #003C71"
            borderRadius="8px"
            padding="40px"
            autoComplete="off"
            backgroundColor="white"
            color="#003C71"
          >
            <div className="buttons-batch-editor">
              <Grid item xs="auto">
                  {editMode && (
                   <div className="btn-divider">
                      <Button id="button"
                        variant="contained"
                        onClick={onPullOutSamples}
                        startIcon={<SouthWestIcon />}
                      >
                        Pull Samples
                      </Button>
                   </div>
                  )}
              </Grid>
              <Grid item xs="auto">
                  {editMode && (
                   <div className="btn-divider">
                      <Button id="delete-btn"
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        onClick={handleClickDialogOpen}
                      >
                        Delete
                      </Button>
                   </div>
                  )}
              </Grid>
              <Grid item xs="auto">
                  <Button id="button"
                    variant="contained"
                    onClick={onSubmitBatch}
                  >
                    {editMode ? "Edit Batch" : "Submit"}
                  </Button>
              </Grid>
            </div>
            <h2>Batch Information</h2>

            {retrievedBatch && (
              <div>
                <h3>Batch ID: {retrievedBatch.BatchId} </h3>
              </div>
            )}
            <TextField
              variant="outlined"
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
                required
                label="Initial Stage"
                error={initialStageError}
            >
              {stageData.map((stage) => (
                  <MenuItem key={stage.StageId} value={stage.StageId}>
                    {stage.StageName}
                  </MenuItem>
              ))}
            </TextField>
            <TextField
                id="outlined-select"
                onChange={(e) => setExtractionType(e.target.value)}
                value={extractionType}
                select
                required
                label="Extraction Type"
                error={extractionTypeError}
                helperText={extractionTypeError && "Please select"}
            >
              {extractionTypeData.map((extractionType) => (
                  <MenuItem
                      key={extractionType.ExtractionId}
                      value={extractionType.ExtractionId}
                  >
                    {extractionType.ExtractionName}
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
        </Grid>
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
            height: "100%",
            padding: "1em",
            marginTop: "20px",
            marginBottom: "50px",
            backgroundColor: "white",
            color: "#003C71",
            border: "1px solid #003C71",
          }}
        />
      </div>
      <DialogView />
    </div>
  );
}

const columns = [
  {
    field: "SampleId",
    headerName: "Sample ID",
    width: 150,
  },
  {
    field: "CaseId",
    headerName: "Case ID",
    width: 100,
  },
  {
    field: "SampleName",
    headerName: "Sample Name",
    width: 200,
  },
  {
    field: "KorQ",
    headerName: "K or Q",
    width: 150,
  },
  {
    field: "ScreeningName",
    headerName: "Screening Method",
    width: 200,
  },
  {
    field: "KitName",
    headerName: "Kit Type",
    width: 200,
  },
  {
    field: "OnHold",
    headerName: "On Hold",
    width: 150,
    renderCell: (cellValues) => {
      return (
        cellValues.value === 1 && (
          <Button loading variant="contained" color="warning"
                  style={{ cursor: 'not-allowed', pointerEvents: "none" }}
          >
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
