import React, { useMemo, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import './SampleView.css';
import Table from "./SampleTable";
import {getAllSamples} from "../../api/SampleApi";

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
      accessor: "CaseId",
      Header: "Case ID",
      width: 50,
    },
    {
      accessor: "KorQ",
      Header: "K or Q",
      width: 110,
    },
    {
      accessor: "ScreeningName",
      Header: "Screening Method",
      width: 130,
    },
    {
      accessor: "KitName",
      Header: "Kit Type",
      width: 110,
    },
    {
      accessor: "Comment",
      Header: "Comment",
      width: 300,
    },
    {
      accessor: row => {
        if (row.OnHold === 1) {
          return (
          <span style={{ cursor: 'not-allowed', pointerEvents: "none" }}>
            <Button variant="contained" color="warning">
              On Hold
            </Button>
          </span>
          )
        }
      },
      Header: "On Hold",
      width: 150,
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
      width: 250,
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
