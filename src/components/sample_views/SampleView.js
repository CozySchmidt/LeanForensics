import React, { useMemo, useState, useEffect } from "react";
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import MOCK_DATA from "../../constants/mock_samples.json";
import Button from "@mui/material/Button";
import './SampleView.css';
import Table from "./Table";
import { GlobalFilter } from "./GlobalFilter";
import {BsFillArrowDownCircleFill, BsFillArrowUpCircleFill} from "react-icons/bs";

import {getAllSamples} from "../../api/SampleApi";
import axios from "axios";

const SampleView = () => {

  let [sampleList, setSampleList] = useState(null);

  useEffect(() => {
    retrieveSamples();
  }, []);

  async function retrieveSamples() {
    let sampleList = await getAllSamples();
    console.log(sampleList);
    setSampleList(sampleList);
  }

  const columns = useMemo(() => [
    {
      accessor: "SampleId",
      Header: "Sample ID",
      width: 50,
    },
    {
      accessor: "ScreeningId",
      Header: "Screening ID",
      width: 200,
    },
    {
      accessor: "ScreeningName",
      Header: "Screening Name",
      width: 90,
    },
    {
      accessor: "KitId",
      Header: "Kit Id",
      width: 150,
    },
    {
      accessor: "KitName",
      Header: "Kit Name",
      width: 110,
    },
    {
      accessor: "CaseId",
      Header: "Case ID",
      width: 110,
    },
    {
      accessor: "OnHold",
      Header: "On Hold",
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
    {
      accessor: "CreatedDate",
      Header: "Created Date",
      width: 110,
    },
  ], []);

  while (sampleList == null) {
    return (<div></div>)
  }
  
  return (
    <div className="viewHolder">
      <Table columns={columns} data={sampleList}></Table>
    </div>
  )
};

export default SampleView
