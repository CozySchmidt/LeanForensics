import React, { useState, useEffect } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { useHistory } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import "./StatusView.css";
import { getAllBatchesByStages, getAllStages } from "../../api/OthersApi";
import {
  deleteBatch,
  getSamplesByBatchId,
  markBatchCompleted,
  updateBatchReady,
  updateBatchStage,
} from "../../api/BatchApi";

function StatusView() {
  const history = useHistory();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [nextStage, setNextStage] = React.useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [pressedBatch, setPressedBatch] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [pageSize, setPageSize] = React.useState(15);
  const [stageList, setStageList] = useState(null);
  const [selectedStage, setSelectedStage] = useState("");

  useEffect(() => {
    retrieveBatches();
  }, []);

  async function retrieveBatches() {
    let stageList = await getAllBatchesByStages();
    console.log(stageList);
    setStageList(stageList);
  }
  async function updateReadyBatch() {
    let result = await updateBatchReady(selectedBatch);
    if (result) {
      window.location.reload(false);
    } else {
      alert("Something went wrong");
    }
  }

  const handleModalOpen = async (batch) => {
    let batchSample = await getSamplesByBatchId(batch.BatchId);
    // console.log(batch);
    setSelectedBatch(batchSample);
    setPressedBatch(batch);
    setSelectedStage(batch.StageId);
    setOpenModal(true);
  };
  const handleModalClose = () => setOpenModal(false);

  const handleStageChange = (event) => {
    console.log(event.target);
    setSelectedStage(event.target.value);
  };

  const handleClickDialogOpen = () => {
    setNextStage(true);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setNextStage(false);
    setOpenDialog(false);
  };
  
  const handleClickDeleteDialogOpen = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleStageSubmit = async () => {
    let stageId = selectedStage;
    if (nextStage && selectedBatch.IsReady) {
      stageId = selectedBatch.StageId + 1;
      updateReadyBatch();
    }
    if (nextStage && !selectedBatch.IsReady) {
      stageId = selectedBatch.StageId + 1;
    }
    if (!isLastStage()) {
      let updateResult;
      if (selectedBatch.IsReady) {
        updateReadyBatch();
        updateResult = await updateBatchStage(selectedBatch.BatchId, stageId);
        if (updateResult) {
          console.log(updateResult);
          window.location.reload(false);
        } else {
          alert("Something went wrong.");
        }
      } else {
        alert("Please mark this as READY.");
      }
    } else {
      //TODO: change completed to true when next stage is unavailable

      if (selectedBatch.IsReady) {
        let result = await markBatchCompleted(selectedBatch.BatchId);
        if (result) {
          alert("Successfully Updated");
          window.location.reload(false);
        } else {
          alert("Something went wrong.");
        }
      } else {
        alert("Please mark this as READY.");
      }
    }
  };

  const onDeleteBatch = async () => {
    setOpenDialog(false);
    let result = await deleteBatch(pressedBatch.BatchId);
    if (result) {
      alert("Successfully Deleted.");
      window.location.reload(false);
    } else {
      alert("Failed. Something went wrong.");
    }
  };

  const isLastStage = () => {
    return (
      (stageList && stageList.length) ===
      (selectedBatch && selectedBatch.StageId)
    );
  };

  const DialogView = () => {
    return (
      selectedBatch && (
        <Dialog
          open={openDialog}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {isLastStage()
              ? `Mark ${selectedBatch.BatchName} as Completed?`
              : `Move ${selectedBatch.BatchName} to
              ${stageList && stageList[selectedBatch.StageId].StageName} Stage? 
                  `}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleDialogClose}>No</Button>
            <Button onClick={handleStageSubmit} autoFocus>
              YES
            </Button>
          </DialogActions>
        </Dialog>
      )
    );
  };
  const DeleteDialogView = () => {
    return (
        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Would you like to delete ${pressedBatch.BatchId}. ${pressedBatch.BatchName}`}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose}>No</Button>
            <Button onClick={onDeleteBatch} autoFocus>
              YES
            </Button>
          </DialogActions>
        </Dialog>
    );
  };

  const ModalView = () => {
    const style = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "70%",
      height: "70%",
      fontFamily: `"Roboto", sans-serif`,
      fontWeight: "bold",
      backgroundColor: "white",
      color: "#003C71",
      border: "2px solid darkgrey",
      boxShadow: 24,
      p: 7,
    };
    return (
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {selectedBatch ? (
              <div style={{height:"100%"}}>
                <div style={{position: "absolute", marginLeft: 495, marginTop: 90}}>
                  Move to desired stage:
                </div>
              <div className="selector">
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedStage}
                  label="To Stage"
                  onChange={handleStageChange}
                >
                  {stageList &&
                    stageList.map((stage, i) => {
                      return (
                        <MenuItem key={i} value={stage.StageId}>
                          {stage.StageName}
                        </MenuItem>
                      );
                    })}
                </Select>
              </div>
              <div className="divider" />
              <div className="arrow-button">
                <Button
                  sx={{
                    color: "whitesmoke",
                    backgroundColor: "#4682B4",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    "&:hover": {
                      backgroundColor: "#90CAF9",
                      color: "#003C71",
                      fontWeight: "bold",
                    },
                  }}
                  loading
                  variant="outlined"
                  onClick={() => {
                    if (selectedStage.length !== 0) {
                      handleStageSubmit();
                    } else {
                      alert("Stage has to be selected");
                    }
                  }}
                >
                  <ArrowForwardIcon />
                </Button>
              </div>
              <div className="modal-buttons">
                  {selectedBatch.IsReady ? (
                  <Button
                  sx={{
                    marginRight: 5,
                    color: "whitesmoke",
                    backgroundColor: "#8c8c8c",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#4d4d4d",
                      color: "lightgrey",
                      fontWeight: "bold",
                    },
                  }}
                  size="medium"
                  variant="outlined"
                  onClick={updateReadyBatch}
                >
                 UNREADY
                </Button>
                  ) : (
                      <Button
                          sx={{
                              marginRight: 5,
                              color: "whitesmoke",
                              backgroundColor: "#01b25c",
                              fontWeight: "bold",
                              "&:hover": {
                                  backgroundColor: "#c1f0c1",
                                  color: "#003C71",
                                  fontWeight: "bold",
                              },
                          }}
                          size="medium"
                          variant="outlined"
                          onClick={updateReadyBatch}
                      >
                          READY
                      </Button>
                  )}
                <div className="divider" />
                <Button
                  sx={{
                    color: "whitesmoke",
                    backgroundColor: "#4682B4",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    "&:hover": {
                      backgroundColor: "#90CAF9",
                      color: "#003C71",
                      fontWeight: "bold",
                    },
                  }}
                  size="medium"
                  variant="outlined"
                  onClick={() =>
                    (window.location.href = `/batch-editor?batchId=${selectedBatch.BatchId}`)
                  }
                >
                  Edit batch
                </Button>
                <div className="divider" />
                <Button
                  sx={{
                    color: "whitesmoke",
                    backgroundColor: "#4682B4",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    "&:hover": {
                      backgroundColor: "#90CAF9",
                      color: "#003C71",
                      fontWeight: "bold",
                    },
                  }}
                  size="medium"
                  variant="outlined"
                  onClick={handleClickDialogOpen}
                >
                  {isLastStage() ? "Mark Completed" : "Next Stage"}
                </Button>
                <div className="divider" />
              </div>
              <div>
                <div>Batch ID: {selectedBatch.BatchId}</div>
                <div>Batch Name: {selectedBatch.BatchName}</div>
                <div>Extraction Type: {selectedBatch.ExtractionName ?? "N/A"}</div>
                <div>Created Date: {selectedBatch.CreatedDate}</div>
                <div>Comments: {selectedBatch.CaseFile}</div>
                <div>
                  Is {selectedBatch.StageName} Completed:{" "}
                  {selectedBatch.IsReady ? "Yes" : "No"}
                </div>
              </div>
              <DataGrid
                rows={selectedBatch.Samples}
                columns={columns}
                getRowId={(r) => r.CaseId + "-" + r.SampleId}
                pageSize={pageSize}
                disableSelectionOnClick
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                pagination
                rowsPerPageOptions={[15, 20, 50]}
                style={{ height: "70%", marginTop: "15px", color: "#003C71" }}
              />
            </div>
          ) : (
            <div>
              No Samples found in this batch. Remove this batch?
              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                sx={{
                  marginLeft: 2,
                  backgroundColor: "#d11a2a",
                  color: "whitesmoke",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "#b30000",
                    color: "darkgrey",
                    fontWeight: "bold",
                  },
                }}
                onClick={handleClickDeleteDialogOpen}
              >
                Delete
              </Button>
              <DeleteDialogView/>
            </div>
          )}
        </Box>
      </Modal>
    );
  };

  const onStartScroll = (event) => {
    // console.log("onStartScroll", event);
    setDragging(true);
  };

  const onEndScroll = (event) => {
    // console.log("onEndScroll", event);
    setDragging(false);
  };

  return (
    <ScrollContainer
      className="status-container"
      onStartScroll={onStartScroll}
      onScroll={(event) => {
        // console.log("onScroll", event);
      }}
      onClick={(event) => {
        // console.log("onClick", event);
      }}
      onEndScroll={onEndScroll}
    >
      <div className="status-content">
        {
          // render status columns
          stageList &&
            stageList.map((stage, i) => (
              <div className="status-column" key={i}>
                {stage.StageName}

                {
                  //render batches objects
                  stage.Batches.length > 0 &&
                    stage.Batches.map((batch, i) => (
                      <div className="batch-buttons" key={i}>
                          <span style={{ cursor: 'pointer'}}>
                            <Card
                                  onClick={() => handleModalOpen(batch)}
                                  sx={{minWidth: 100}}
                            >
                              <CardContent style={{backgroundColor:"#ffede6"}}>
                                <Typography
                                    sx={{
                                      fontSize: 15,
                                      fontWeight: "bold",
                                      color: "#474952",
                                      textTransform: "capitalize",
                                    }}
                                >
                                  <div>Batch #{batch.BatchId}</div>
                                  <div>{batch.BatchName}</div>
                                  <div>
                                    {batch.IsReady ? (
                                        <span style={{ cursor: 'not-allowed',
                                            pointerEvents: "none" }}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{
                                                  mt: 1,
                                                  fontWeight: "bold",
                                                  backgroundColor: "#01b25c",
                                                  color: "whitesmoke",
                                                  "&:hover": {
                                                    backgroundColor: "#01b25c",
                                                    color: "whitesmoke",
                                                    fontWeight: "bold",
                                                  },
                                                }}
                                            >
                                              READY
                                            </Button>
                                        </span>
                                    ) : ""}
                                  </div>
                                </Typography>
                              </CardContent>
                            </Card>
                          </span>
                      </div>
                    ))
                }
              </div>
            ))
        }
      </div>
      <ModalView />
      <DialogView />
    </ScrollContainer>
  );
}

const columns = [
  {
    field: "SampleId",
    headerName: "Sample ID",
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
    width: 90,
  },
  {
    field: "CaseId",
    headerName: "Case ID",
    width: 90,
  },
  {
    field: "KitName",
    headerName: "Kit Type",
    width: 150,
  },
  {
    field: "ScreeningName",
    headerName: "Screening",
    width: 110,
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
];

export default StatusView;
