import React from "react";
import { useScrollBoost } from "react-scrollbooster";

import "./StatusView.css";

// Needs to be sorted from backend when retrieving it
const data = [
  {
    statusName: "Search/Sampling",
    statusOrder: 1,
    batches: [
      {
        batchId: "batch1",
        samples: [
          { sampleId: "sample1" },
          { sampleId: "sample1" },
          { sampleId: "sample1" },
          { sampleId: "sample1" },
          { sampleId: "sample1" },
        ],
      },
      {
        batchId: "batch2",
        samples: [
          { sampleId: "sample1" },
          { sampleId: "sample1" },
          { sampleId: "sample1" },
          { sampleId: "sample1" },
          { sampleId: "sample1" },
        ],
      },
    ],
  },
  { statusName: "Screening", statusOrder: 2, batches: [] },
  { statusName: "Extraction", statusOrder: 3, batches: [] },
  {
    statusName: "Clean up",
    statusOrder: 4,
    batches: [
      {
        batchId: "batch1",
        samples: [
          { sampleId: "sample1" },
          { sampleId: "sample1" },
          { sampleId: "sample1" },
          { sampleId: "sample1" },
          { sampleId: "sample1" },
        ],
      },
    ],
  },
  { statusName: "Quantification", statusOrder: 5, batches: [] },
  { statusName: "Amplification", statusOrder: 6, batches: [] },
  { statusName: "Report", statusOrder: 7, batches: [] },
];

const StatusView = () => {
  const [viewport] = useScrollBoost({
    direction: "horizontal",
    friction: 0.5,
    scrollMode: "native",
  });

  return (
    <div className="status-container" ref={viewport}>
      <div className="status-content">
        {
          // render status columns
          data.map((o, i) => (
            <div className="status-column" key={i}>
              {o.statusName}

              {
                //render batches objects
                o.batches.map((batch, i) => (
                  <div key={i}>
                    <button
                      onClick={() => {
                        console.log(batch.samples);
                      }}
                    >
                      {batch.batchId}
                    </button>
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default StatusView;
