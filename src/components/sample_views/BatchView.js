import React, { useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import './BatchView.css';
import { getAllBatches } from "../../api/BatchApi";
import BatchTable from "./BatchTable";

const BatchView = () => {

    let [batchList, setBatchList] = useState(null);

    useEffect(() => {
      retrieveBatches();
    }, []);

    async function retrieveBatches() {
      let batchList = await getAllBatches();
      console.log(batchList);
      setBatchList(batchList);
    }

    const columns = useMemo(() => [
      {
        accessor: "BatchId",
        Header: "Batch ID",
        width: 50,
      },
      {
        accessor: "BatchName",
        Header: "Batch Name",
        width: 200,
      },
      {
        accessor: "CaseFile",
        Header: "Case File",
        width: 200,
      },
      {
        accessor: row => {
          let utc = row.CreatedDate;
          let time = new Date(Date.parse(utc));
          let pst = time.toLocaleString();
          console.log(pst);
  
          return(
            pst
          )
        },
        Header: "Created Date",
        width: 140,
      },
      {
        accessor: row => {
          if (row.IsCompleted == 1) {
            return (
              <Button variant="contained">
                Yes
              </Button>
            )
          } else if (row.IsCompleted == 0) {
            return (
              <Button variant="contained" color="warning">
                No
              </Button>
            )
          }
        },
        Header: "Completed",
        width: 50,
      },
    ], []);

    while (batchList == null) {
      return (<div></div>)
    }
    return (
      <div className="viewHolder">
        <BatchTable columns={columns} data={batchList}></BatchTable>
      </div>
    )
};

export default BatchView;
