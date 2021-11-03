import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import "./CaseEditorScreen.css";
import { kitTypeData, screeningData } from "../constants/testData";

const placeHolderData = [
  {
    key: new Date().getTime() + 1,
    sampleId: "",
    numSample: "",
    screening: "",
    kitType: "",
    onHold: false,
  },
  {
    key: new Date().getTime() + 2,
    sampleId: "",
    numSample: "",
    screening: "",
    kitType: "",
    onHold: false,
  },
  {
    key: new Date().getTime() + 3,
    sampleId: "",
    numSample: "",
    screening: "",
    kitType: "",
    onHold: false,
  },
];

const CaseEditorScreen = () => {
  const [editMode, setEditMode] = React.useState(false);
  const [sampleList, setSampleList] = React.useState([...placeHolderData]);
  const [caseId, setCaseId] = React.useState("");
  const [comment, setComment] = React.useState("");

  const onSubmitCase = () => {
    //TODO: validation required
    let caseObj = {
      caseId: caseId,
      comment: comment,
    };

    if (editMode) {
      //Edit api call
    } else {
      //Create api call
    }
    let filteredList = filterEmptyList(sampleList);
    console.log(caseObj);
    console.log(filteredList);
    // alert(JSON.stringify(caseObj, null, 4));
    // alert(JSON.stringify(filteredList, null, 4));
  };

  const filterEmptyList = (list) => {
    return list.filter(checkNotEmptyObject);
  };

  const checkNotEmptyObject = (obj) => {
    return !Object.values(obj).every(
      (x) => x === null || x === "" || x === false
    );
  };

  const addSubRow = (obj) => {
      setSampleList([
        ...sampleList,
        {
          key: new Date().getTime(),
          sampleId: obj.sampleId+"-",
          numSample: obj.numSample,
          screening: obj.screening,
          kitType: obj.kitType,
          onHold: obj.onHold,
        },
      ]);
  };
  const addNewRow = () => {
      setSampleList([
        ...sampleList,
        {
          key: new Date().getTime(),
          sampleId: "",
          numSample: "",
          screening: "",
          kitType: "",
          onHold: false,
        },
      ]);
  };

  const deleteRow = (index) => {
    const items = sampleList.filter((item, i) => index !== i);
    setSampleList(items);
  };

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
            return (
              <SampleRow
                key={sample.key}
                index={i}
                obj={sample}
                onDelete={deleteRow}
                onAdd={addSubRow}
              />
            );
          })}
          <Button variant="contained" onClick={addNewRow}>
            Add
          </Button>
          <Button variant="contained" onClick={onSubmitCase}>
            Submit
          </Button>
        </Box>
      </div>
    </div>
  );
};

const SampleRow = (props) => {
  const [sampleObj, setSampleObj] = React.useState(props.obj);
  const [sampleId, setSampleId] = React.useState(props.obj.sampleId);
  const [numSample, setNumSample] = React.useState(props.obj.numSample);
  const [screening, setScreening] = React.useState(props.obj.screening);
  const [kitType, setKitType] = React.useState(props.obj.kitType);
  const [onHold, setOnHold] = React.useState(props.obj.onHold);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    props.onAdd(sampleObj);
  };

  return (
    <div className="sample-row">
      <IconButton
        aria-label="delete"
        onClick={() => props.onDelete(props.index)}
      >
        <DeleteRoundedIcon />
      </IconButton>
      <div className="row-item" style={{ margin: "10px" }}>
        {props.index + 1}
      </div>
      <div className="row-item">
        <TextField
          id="outlined"
          onChange={(e) => {
            sampleObj["sampleId"] = e.target.value;
            setSampleObj(sampleObj);
            setSampleId(e.target.value);
          }}
          value={sampleId}
          label="Sample ID"
        />
      </div>
      <div className="row-item">
        <TextField
          id="outlined"
          inputProps={{type: "number", min: 1}}
          onChange={(e) => {
            sampleObj["numSample"] = parseInt(e.target.value);
            setSampleObj(sampleObj);
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
            setSampleObj(sampleObj);
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
            setSampleObj(sampleObj);
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
        <FormControlLabel
          control={
            <Switch
              checked={onHold}
              onChange={(e) => {
                sampleObj["onHold"] = e.target.checked;
                setSampleObj(sampleObj);
                setOnHold(e.target.checked);
              }}
              color="warning"
            />
          }
          label={onHold && "On Hold"}
        />
      </div>
      <div className="row-item">
        <IconButton
          id="more-button"
          aria-controls="more-menu"
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <MoreHorizIcon />
        </IconButton>

        <Menu
          id="more-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "more-button",
          }}
        >
          <MenuItem onClick={handleClose}>Create Sub-sample</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default CaseEditorScreen;
