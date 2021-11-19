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

import "./StatusView.css";
import { getAllBatchesByStages, getAllStages } from "../../api/OthersApi";
import { getSamplesByBatchId, updateBatchStage } from "../../api/BatchApi";

function StatusView() {
  const history = useHistory();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [nextStage, setNextStage] = React.useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [pageSize, setPageSize] = React.useState(15);
  const [stageList, setStageList] = useState(null);
  const [selectedStage, setSelectedStage] = useState("");

  useEffect(() => {
    retrieveBatches();
  }, []);

  async function retrieveBatches() {
    let stageList = await getAllBatchesByStages();
    // console.log(stageList);
    setStageList(stageList);
  }

  const handleModalOpen = async (batch) => {
    let batchSample = await getSamplesByBatchId(batch.BatchId);
    console.log(batch);
    setSelectedBatch(batchSample);
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

  const handleStageSubmit = async () => {
    let stageId = selectedStage;
    if (nextStage) {
      stageId = selectedBatch.StageId + 1;
    }
    if (stageId <= stageList.length) {
      let updateResult = await updateBatchStage(selectedBatch.BatchId, stageId);
      if (updateResult) {
        console.log(updateResult);
        window.location.reload(false);
      } else {
        alert("Something went wrong. Please try again later.");
      }
    } else {
      //TODO: change completed to true when next stage is unavailable
    }
  };

  //TODO: handle when it goes to the last stage
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
            {`Move ${selectedBatch.BatchName} to ${
              stageList[selectedBatch.StageId].StageName
            } Stage?`}
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
      backgroundColor: "whitesmoke",
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
          <div className="divider"/>
          <div className="arrow-button">
            <Button
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
                loading variant="outlined"
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
            <Button
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
                size="medium"
                variant="outlined"
                onClick={() =>
                    (window.location.href = `/batch-editor?batchId=${selectedBatch.BatchId}`)
                }
            >
              Edit batch
            </Button>
            <div className="divider"/>
            <Button
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
                size="medium"
                variant="outlined"
                onClick={handleClickDialogOpen}
            >
              Next Stage
            </Button>
            <div className="divider"/>
          </div>
          {selectedBatch && (
            <div>
              <div>Batch ID: {selectedBatch.BatchId}</div>
              <div>Batch Name: {selectedBatch.BatchName}</div>
              <div>Extraction: {selectedBatch.ExtractionName ?? "N/A"}</div>
              <div>Created Date: {selectedBatch.CreatedDate}</div>
              <div>Comments: {selectedBatch.Comment}</div>
              <div>Completed: {selectedBatch.IsCompleted ? "Yes" : "No"}</div>
            </div>
          )}
          {selectedBatch && (
            <DataGrid
              rows={selectedBatch.Samples}
              columns={columns}
              getRowId={(r) => r.CaseId + "-" + r.SampleId}
              pageSize={pageSize}
              disableSelectionOnClick
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              pagination
              rowsPerPageOptions={[15, 20, 50]}
              style={{ height: "70%", marginTop: "10px", color: "#003C71" }}
            />
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
                        <Button
                          size="medium"
                          variant="outlined"
                          sx={{
                            color: "whitesmoke",
                            backgroundColor: "darksalmon",
                            // fontWeight: "bold",
                            textTransform: "capitalize",
                            '&:hover': {
                              backgroundColor: "grey",
                              color: "#003C71",
                              // fontWeight: "bold"
                            }
                          }}
                          onClick={() => handleModalOpen(batch)}
                        >
                          {batch.BatchId}. {batch.BatchName}
                        </Button>
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
        cellValues === 1 && (
          <Button variant="contained" color="warning">
            On Hold
          </Button>
        )
      );
    },
  },
];

export default StatusView;
