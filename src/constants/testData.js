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

function createBatchSampleData(sampleId, screening, number, kit, hold, date) {
  return {
    sampleId,
    screening,
    number,
    kit,
    hold,
    date,
  };
}

export const batchSampleData = [
  createBatchSampleData("BCIT-2021-1", "Snow", 1, "Jon", 35, new Date()),
  createBatchSampleData(
    "BCIT-2021-2",
    "Lannister",
    1,
    "Cersei",
    42,
    new Date()
  ),
  createBatchSampleData("BCIT-2021-3", "Lannister", 1, "Jaime", 45, new Date()),
  createBatchSampleData("BCIT-2021-4", "Stark", 1, "Arya", 16, new Date()),
  createBatchSampleData(
    "BCIT-2021-5",
    "Targaryen",
    1,
    "Daenerys",
    null,
    new Date()
  ),
  createBatchSampleData("BCIT-2021-6", "Melisandre", 1, null, 150, new Date()),
  createBatchSampleData(
    "BCIT-2021-7",
    "Clifford",
    1,
    "Ferrara",
    44,
    new Date()
  ),
  createBatchSampleData("BCIT-2021-8", "Frances", 1, "Rossini", 36, new Date()),
  createBatchSampleData("BCIT-2021-9", "Roxie", 1, "Harvey", 65, new Date()),
  createBatchSampleData("BCIT-2021-10", "Roxie", 1, "Harvey", 65, new Date()),
  createBatchSampleData("BCIT-2021-11", "Roxie", 1, "Harvey", 65, new Date()),
  createBatchSampleData("BCIT-2021-12", "Roxie", 1, "Harvey", 65, new Date()),
  createBatchSampleData("BCIT-2021-13", "Roxie", 1, "Harvey", 65, new Date()),
  createBatchSampleData("BCIT-2021-14", "Roxie", 1, "Harvey", 65, new Date()),
  createBatchSampleData("BCIT-2021-15", "Roxie", 1, "Harvey", 65, new Date()),
  createBatchSampleData("BCIT-2021-16", "Roxie", 1, "Harvey", 65, new Date()),
  createBatchSampleData("BCIT-2021-17", "Roxie", 1, "Harvey", 65, new Date()),
  createBatchSampleData("BCIT-2021-18", "Roxie", 1, "Harvey", 65, new Date()),
  createBatchSampleData("BCIT-2021-19", "Roxie", 1, "Harvey", 65, new Date()),
  createBatchSampleData("BCIT-2021-20", "Roxie", 1, "Harvey", 65, new Date()),
  createBatchSampleData("BCIT-2021-21", "Roxie", 1, "Harvey", 65, new Date()),
];
