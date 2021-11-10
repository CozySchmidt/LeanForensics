import React, { useState, useEffect } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { useHistory } from "react-router-dom";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import "./StatusView.css";
import { statusViewData } from "../../constants/testData";
import { getAllBatchesByStages } from "../../api/BatchApi";
import { getSamplesByBatchId } from "../../api/SampleApi";

function StatusView() {
  const history = useHistory();
  const [openModal, setOpenModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [dragging, setDragging] = useState(false);
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
      width: 400,
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          {selectedBatch &&
            selectedBatch.Samples.map((sample, i) => {
              return <div key={i}>{sample.SampleId}</div>;
            })}
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
    console.log("onStartScroll", event);
    setDragging(true);
  };

  const onEndScroll = (event) => {
    console.log("onEndScroll", event);
    setDragging(false);
  };

  return (
    <ScrollContainer
      className="status-container"
      onStartScroll={onStartScroll}
      onScroll={(event) => {
        console.log("onScroll", event);
      }}
      onClick={(event) => {
        console.log("onClick", event);
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

export default StatusView;
