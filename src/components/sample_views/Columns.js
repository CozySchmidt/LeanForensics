export const COLUMNS = [
    {
        Header: 'Sample Number',
        accessor: 'sampleNumber',
      }, 
      {
        Header: 'Current Status',
        accessor: 'currentStatus',
      }, 
      {
        Header: 'Case Number',
        accessor: 'caseNumber',
      }, 
      {
        Header: 'Batch Number',
        accessor: 'batchNumber',
      }, 
      {
        Header: 'Submitted On',
        accessor: 'submitted',
      }, 
      {
        Header: 'Created On',
        accessor: 'created',
      }, 
      {
        Header: 'Reported On',
        accessor: 'reported',
      }
]

// export const COLUMNS = [
//   {
//     accessor: "SampleId",
//     Header: "Sample ID",
//     width: 50,
//   },
//   {
//     accessor: "ScreeningId",
//     Header: "Screening ID",
//     width: 200,
//   },
//   {
//     accessor: "ScreeningName",
//     Header: "Screening Name",
//     width: 90,
//   },
//   {
//     accessor: "KitId",
//     Header: "Kit Id",
//     width: 150,
//   },
//   {
//     accessor: "KitName",
//     Header: "Kit Name",
//     width: 110,
//   },
//   {
//     accessor: "CaseId",
//     Header: "Case ID",
//     width: 110,
//   },
//   {
//     accessor: "OnHold",
//     Header: "On Hold",
//     width: 150,
//     renderCell: (cellValues) => {
//       return (
//         cellValues === 1 && (
//           <Button variant="contained" color="warning">
//             On Hold
//           </Button>
//         )
//       );
//     },
//   },
//   {
//     accessor: "CreatedDate",
//     Header: "Created Date",
//     width: 110,
//   },
// ];

export default COLUMNS;