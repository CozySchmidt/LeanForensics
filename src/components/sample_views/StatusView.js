import React, { useState, useEffect } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { useHistory } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import "./StatusView.css";
import { statusViewData } from "../../constants/testData";
import { getAllBatchesByStages } from "../../api/OthersApi";
import { getSamplesByBatchId } from "../../api/BatchApi";

function StatusView() {
  const history = useHistory();
  const [openModal, setOpenModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [pageSize, setPageSize] = React.useState(15);
  const [stageList, setStageList] = useState(null);

  useEffect(() => {
    retrieveBatches();
  }, []);

  async function retrieveBatches() {
    let stageList = await getAllBatchesByStages();
    console.log(stageList);
    setStageList(stageList);
  }

  const handleModalOpen = async (batch) => {
    let batchSample = await getSamplesByBatchId(batch.BatchId);
    console.log(batchSample);
    setSelectedBatch(batchSample);
    setOpenModal(true);
  };
  const handleModalClose = () => setOpenModal(false);

  const ModalView = () => {
    const style = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "70%",
      height: "70%",
      bgcolor: "background.paper",
      border: "2px solid #000",
      boxShadow: 24,
      p: 4,
    };
    return (
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {selectedBatch && (
            <div>
              <div>Batch ID: {selectedBatch.BatchId}</div>
              <div>Batch Name: {selectedBatch.Name}</div>
              <div>Extraction: {selectedBatch.ExtractionName ?? "N/A"}</div>
              <div>Created Date: {selectedBatch.CreatedDate}</div>
              <div>Completed: {selectedBatch.IsCompleted ? "Yes" : "No"}</div>
            </div>
          )}
          {selectedBatch && (
            <DataGrid
              rows={selectedBatch.Samples}
              columns={columns}
              getRowId={(r) => r.SampleId}
              pageSize={pageSize}
              disableSelectionOnClick
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              pagination
              rowsPerPageOptions={[15, 20, 50]}
              style={{ height: "70%", marginTop: "10px" }}
            />
          )}

          <Button
            size="large"
            variant="outlined"
            onClick={() =>
              history.push({
                pathname: "/batch-editor",
                search: `?batchId=${selectedBatch.BatchId}`,
              })
            }
          >
            Edit batch
          </Button>
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
                      <div key={i}>
                        <Button
                          size="large"
                          variant="outlined"
                          onClick={() => handleModalOpen(batch)}
                        >
                          {batch.BatchId}. {batch.Name}
                        </Button>
                      </div>
                    ))
                }
              </div>
            ))
        }
      </div>
      <ModalView />
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
