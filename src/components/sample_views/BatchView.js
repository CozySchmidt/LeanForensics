import React, { useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MOCK_DATA from '../../constants/mock_batch.json';
import COLUMNS from './BatchColumn';
import './BatchView.css';
import { GlobalFilter } from "./GlobalFilter";
import {BsFillArrowDownCircleFill, BsFillArrowUpCircleFill} from "react-icons/bs";

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
        accessor: "Comment",
        Header: "Comment",
        width: 200,
      },
      {
        accessor: "CreatedDate",
        Header: "Created Date",
        width: 110,
      },
      {
        accessor: "ExtractionId",
        Header: "Extraction",
        width: 50,
      },
      {
        accessor: "IsCompleted",
        Header: "Completed",
        width: 150,
        renderCell: (cellValues) => {
          return (
            cellValues === 1 && (
              <Button variant="contained" color="warning">
                Completed
              </Button>
            )
          );
        },
      },
      {
        accessor: "StageId",
        Header: "Stage ID",
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
