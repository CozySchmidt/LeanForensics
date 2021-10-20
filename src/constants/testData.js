// Needs to be sorted from backend when retrieving it
export const statusViewData = [
  {
    statusName: "Search/Sampling",
    statusOrder: 1,
    batches: [
      {
        batchId: "batch1",
        samples: [
          { sampleId: "sample1" },
          { sampleId: "sample2" },
          { sampleId: "sample3" },
          { sampleId: "sample4" },
          { sampleId: "sample5" },
        ],
      },
      {
        batchId: "batch2",
        samples: [
          { sampleId: "sample1" },
          { sampleId: "sample2" },
          { sampleId: "sample3" },
          { sampleId: "sample4" },
          { sampleId: "sample5" },
        ],
      },
      {
        batchId: "batch3",
        samples: [],
      },
      {
        batchId: "batch4",
        samples: [],
      },
      {
        batchId: "batch5",
        samples: [],
      },
      {
        batchId: "batch6",
        samples: [],
      },
      {
        batchId: "batch7",
        samples: [],
      },
      {
        batchId: "batch8",
        samples: [],
      },
      {
        batchId: "batch9",
        samples: [],
      },
      {
        batchId: "batch0",
        samples: [],
      },
      {
        batchId: "batch12",
        samples: [],
      },
      {
        batchId: "batch123",
        samples: [],
      },
      {
        batchId: "batch4512",
        samples: [],
      },
      {
        batchId: "batch114",
        samples: [],
      },
      {
        batchId: "batch1443",
        samples: [],
      },
      {
        batchId: "batch188",
        samples: [],
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
        batchId: "batch3",
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
