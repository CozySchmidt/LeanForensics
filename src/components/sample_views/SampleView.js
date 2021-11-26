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
      accessor: "ScreeningName",
      Header: "Screening Name",
      width: 90,
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
      accessor: "CaseFile",
      Header: "Case File",
      width: 150,
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
        let date = row.CreatedDate.split("T");
        return(
          date[0]
        )
      },
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
