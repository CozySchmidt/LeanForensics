import React, { useState } from "react";
import { useScrollBoost } from "react-scrollbooster";
import { useHistory } from "react-router-dom";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import "./StatusView.css";
import { statusViewData } from "../../constants/testData";

function StatusView() {
  const history = useHistory();
  const [openModal, setOpenModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const [viewport] = useScrollBoost({
    direction: "horizontal",
    friction: 0.2,
    scrollMode: "native",
    lockScrollOnDragDirection: true,
    bounce: false,
    inputsFocus: false,
  });

  const handleModalOpen = (batch) => {
    setOpenModal(true);
    setSelectedBatch(batch);
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
            selectedBatch.samples.map((sample, i) => {
              return <div key={i}>{sample.sampleId}</div>;
            })}
          <Button
            size="large"
            variant="outlined"
            onClick={() =>
              history.push({
                pathname: "/batch-editor",
                search: `?batchId=${selectedBatch.batchId}`,
              })
            }
          >
            Edit batch
          </Button>
        </Box>
      </Modal>
    );
  };

  return (
    <div className="status-container" ref={viewport}>
      <div className="status-content">
        {
          // render status columns
          statusViewData.map((o, i) => (
            <div className="status-column" key={i}>
              {o.statusName}

              {
                //render batches objects
                o.batches.map((batch, i) => (
                  <div key={i}>
                    <Button
                      size="large"
                      variant="outlined"
                      onClick={() => handleModalOpen(batch)}
                    >
                      {batch.batchId}
                    </Button>
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
      <ModalView />
    </div>
  );
}

export default StatusView;
