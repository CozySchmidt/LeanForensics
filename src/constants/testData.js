// Needs to be sorted from backend when retrieving it
export const statusViewData = [
  {
    statusName: "Search/Sampling",
    statusOrder: 1,
    batches: [
      {
        batchId: "batch1",
        samples: [
          { sampleId: "BCIT-2021-1" },
          { sampleId: "BCIT-2021-2" },
          { sampleId: "BCIT-2021-3" },
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
  createBatchSampleData("BCIT-2021-1", "Blood", 1, "YFiler", 0, new Date()),
  createBatchSampleData("BCIT-2021-2", "Blood", 1, "YFiler", 0, new Date()),
  createBatchSampleData("BCIT-2021-3", "Blood", 1, "YFiler", 0, new Date()),
  createBatchSampleData("BCIT-2021-4", "Semen", 1, "YFiler", 0, new Date()),
  createBatchSampleData("BCIT-2021-5", "Semen", 1, "YFiler", 0, new Date()),
  createBatchSampleData("BCIT-2021-6", "Saliva", 1, "YFiler", 0, new Date()),
  createBatchSampleData("BCIT-2021-7", "Saliva", 1, "YFiler", 0, new Date()),
  createBatchSampleData(
    "BCIT-2021-8",
    "Saliva",
    1,
    "Global Filer",
    0,
    new Date()
  ),
  createBatchSampleData(
    "BCIT-2021-9",
    "Saliva",
    1,
    "Global Filer",
    0,
    new Date()
  ),
  createBatchSampleData(
    "BCIT-2021-10",
    "Blood",
    1,
    "Global Filer",
    0,
    new Date()
  ),
  createBatchSampleData(
    "BCIT-2021-11",
    "Blood",
    1,
    "Global Filer",
    0,
    new Date()
  ),
  createBatchSampleData(
    "BCIT-2021-12",
    "Blood",
    1,
    "Global Filer",
    0,
    new Date()
  ),
  createBatchSampleData(
    "BCIT-2021-13",
    "Blood",
    1,
    "Global Filer",
    0,
    new Date()
  ),
  createBatchSampleData(
    "BCIT-2021-14",
    "Semen",
    1,
    "Global Filer",
    0,
    new Date()
  ),
  createBatchSampleData("BCIT-2021-15", "Semen", 1, null, 1, new Date()),
  createBatchSampleData("BCIT-2021-16", "Semen", 1, "Filer", 1, new Date()),
  createBatchSampleData("BCIT-2021-17", "Semen", 1, "Filer", 1, new Date()),
  createBatchSampleData("BCIT-2021-18", "Semen", 1, "Filer", 0, new Date()),
  createBatchSampleData("BCIT-2021-19", "Semen", 1, null, 0, new Date()),
];

export const extractionTypeData = [
  { extractionTypeId: 1, extractionTypeName: "Direct" },
  { extractionTypeId: 2, extractionTypeName: "Demin" },
  { extractionTypeId: 3, extractionTypeName: "Differential" },
];
export const screeningData = [
  { screeningId: 1, screeningName: "Blood" },
  { screeningId: 2, screeningName: "Semen" },
  { screeningId: 3, screeningName: "Saliva" },
];

export const kitTypeData = [
  { kitTypeId: 1, kitTypeName: "Global Filer" },
  { kitTypeId: 2, kitTypeName: "Y Filer" },
];

export const stageData = [
  { stageId: 1, stageName: "Search/Sampling" },
  { stageId: 2, stageName: "Screening" },
  { stageId: 3, stageName: "Extraction" },
  { stageId: 4, stageName: "Clean Up" },
  { stageId: 5, stageName: "Quantification" },
  { stageId: 6, stageName: "Amplification" },
  { stageId: 7, stageName: "Report" },
];

export const editBatchData = {
  batchId: "123",
  stageId: "1",
  extractionTypeId: "1",
  comment: "test comment",
  samples: ["BCIT-2021-1", "BCIT-2021-2", "BCIT-2021-3", "BCIT-2021-4"],
};
