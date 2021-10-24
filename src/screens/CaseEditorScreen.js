import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

import "./CaseEditorScreen.css";
import { kitTypeData, screeningData } from "../constants/testData";

const placeHolderData = [
  {
    sampleId: "",
    numSample: "",
    screening: "",
    kitType: "",
    onHold: "",
  },
  {
    sampleId: "",
    numSample: "",
    screening: "",
    kitType: "",
    onHold: "",
  },
  {
    sampleId: "",
    numSample: "",
    screening: "",
    kitType: "",
    onHold: "",
  },
];

const CaseEditorScreen = () => {
  const [sampleList, setSampleList] = React.useState([...placeHolderData]);
  const [caseId, setCaseId] = React.useState("");
  const [comment, setComment] = React.useState("");

  const isEmpty = (object) =>
    Object.values({}).every((x) => x === null || x === "");

  return (
    <div className="screen-holder">
      <div className="content-wrapper">
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch", maxWidth: "100%" },
          }}
          noValidate
          border="1px solid lightgrey"
          borderRadius="8px"
          autoComplete="off"
        >
          <h4>Case Information</h4>
          <TextField
            id="outlined"
            onChange={(e) => setCaseId(e.target.value)}
            value={caseId}
            label="Case ID"
          />
          <TextField
            id="outlined"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            label="Comment"
          />
        </Box>

        <Box border="1px solid lightgrey" borderRadius="8px">
          {sampleList.map((sample, i) => {
            return <SampleRow key={i} order={i + 1} obj={sample} />;
          })}
          <Button
            variant="contained"
            onClick={() => {
              setSampleList([
                ...sampleList,
                {
                  sampleId: "",
                  numSample: "",
                  screening: "",
                  kitType: "",
                  onHold: "",
                },
              ]);
            }}
          >
            Add
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              console.log(sampleList);
            }}
          >
            Submit
          </Button>
        </Box>
      </div>
    </div>
  );
};

const SampleRow = (props) => {
  const [sampleObj, setSampleObj] = React.useState(props.obj);
  const [sampleId, setSampleId] = React.useState("");
  const [numSample, setNumSample] = React.useState("");
  const [screening, setScreening] = React.useState("");
  const [kitType, setKitType] = React.useState("");
  const [onHold, setOnHold] = React.useState("");
  return (
    <div className="sample-row">
      <div className="row-item" style={{ margin: "10px" }}>
        {props.order}
      </div>
      <div className="row-item">
        <TextField
          id="outlined"
          onChange={(e) => {
            sampleObj["sampleId"] = e.target.value;
            setSampleId(e.target.value);
          }}
          value={sampleId}
          label="Sample ID"
        />
      </div>
      <div className="row-item">
        <TextField
          id="outlined"
          type="number"
          onChange={(e) => {
            sampleObj["numSample"] = parseInt(e.target.value);
            setNumSample(e.target.value);
          }}
          value={numSample}
          label="# of Sample"
        />
      </div>
      <div className="row-item">
        <TextField
          select
          onChange={(e) => {
            sampleObj["screening"] = e.target.value;
            setScreening(e.target.value);
          }}
          value={screening}
          label="Screening Method"
          sx={{ m: 1, width: "25ch" }}
        >
          {screeningData.map((screening) => (
            <MenuItem key={screening.screeningId} value={screening.screeningId}>
              {screening.screeningName}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <div className="row-item">
        <TextField
          select
          onChange={(e) => {
            sampleObj["kitType"] = e.target.value;
            setKitType(e.target.value);
          }}
          value={kitType}
          label="Kit Type"
          sx={{ m: 1, width: "25ch" }}
        >
          {kitTypeData.map((kitType) => (
            <MenuItem key={kitType.kitTypeId} value={kitType.kitTypeId}>
              {kitType.kitTypeName}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <div className="row-item">
        <TextField
          select
          onChange={(e) => {
            sampleObj["onHold"] = e.target.value;
            setOnHold(e.target.value);
          }}
          value={onHold}
          label="On Hold"
          sx={{ m: 1, width: "25ch" }}
        >
          <MenuItem key={0} value={0}>
            0
          </MenuItem>
          <MenuItem key={1} value={1}>
            1
          </MenuItem>
        </TextField>
      </div>
    </div>
  );
};

export default CaseEditorScreen;
