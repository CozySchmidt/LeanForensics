import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import queryString from "query-string";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import "./CaseEditorScreen.css";
import { kitTypeData, screeningData } from "../constants/testData";
import {
  createCase,
  getSamplesByCaseId,
  updateCaseWithSamples,
} from "../api/CaseApi";

let placeHolderData = [];
for (let i = 0; i < 3; i++) {
  placeHolderData.push({
    key: new Date().getTime() + i + 1,
    SampleId: `${i + 1}`,
    ScreeningId: "",
    KitId: "",
    onHold: false,
  });
}

const CaseEditorScreen = ({ location }) => {
  const history = useHistory();
  const query = queryString.parse(location.search);
  const [retrievedCase, setRetrievedCase] = React.useState(null);
  const [editMode, setEditMode] = React.useState(query.caseId ? true : false);
  const [sampleList, setSampleList] = React.useState(
    editMode ? [] : [...placeHolderData]
  );
  const [initialSampleList, setInitialSampleList] = React.useState([]);
  const [comment, setComment] = React.useState("");

  useEffect(() => {
    editMode && retrieveCaseById();
  }, []);

  async function retrieveCaseById() {
    let caseResult = await getSamplesByCaseId(query.caseId);
    console.log(caseResult);
    setRetrievedCase(caseResult);
    setComment(caseResult.Comment);
    let keyList = caseResult.Samples.map((sample, i) => {
      sample["key"] = new Date().getTime() + i + 1;
      return sample;
    });
    console.log(keyList);
    setSampleList(keyList);
    setInitialSampleList(JSON.parse(JSON.stringify(keyList)));
  }

  const onSubmitCase = async () => {
    //TODO: validation required
    let caseObj = {
      comment: comment,
    };

    let temp = sampleList.map(function (sample) {
      // Change empty string to null
      if (
        sample["ScreeningId"] !== null &&
        sample["ScreeningId"].toString().trim().length === 0
      ) {
        sample["ScreeningId"] = null;
      }
      if (
        sample["KitId"] !== null &&
        sample["KitId"].toString().trim().length === 0
      ) {
        sample["KitId"] = null;
      }
      //exclude key to check emptiness
      delete sample.key;
      return sample;
    });
    let filteredList = filterEmptyList(temp);
    // console.log(caseObj);
    console.log(filteredList);

    if (editMode) {
      //Edit api call
      let initList = initialSampleList.map(function (sample) {
        delete sample.key;
        return sample;
      });
      let deleteSampleList = initList.filter((sample) => {
        return !containsObject(sample, filteredList);
      });
      let newSampleList = filteredList.filter((sample) => {
        return !containsObject(sample, initList);
      });

      console.log("delete ", deleteSampleList);
      console.log("new ", newSampleList);
      let caseObj = {
        CaseId: retrievedCase.CaseId,
        Comment: comment,
        deleteSampleList: deleteSampleList,
        newSampleList: newSampleList,
      };
      if (deleteSampleList.length > 0 && newSampleList > 0) {
        let caseResult = await updateCaseWithSamples(caseObj);
        if (caseResult) {
          alert("Successfully Updated.");
          history.push("/");
        }
      } else {
        alert("No changes detected.");
      }
    } else {
      //Create api call
      let result = await createCase(caseObj, filteredList);
      if (result) {
        alert("Successfully added!");
        window.location.href = "/status-view";
      } else {
        alert("Something went wrong. Please try again later");
      }
    }
  };

  function containsObject(obj, list) {
    let i;
    for (i = 0; i < list.length; i++) {
      if (JSON.stringify(list[i]) === JSON.stringify(obj)) return true;
    }

    return false;
  }

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
        SampleId: obj.SampleId + "-",
        ScreeningId: obj.ScreeningId,
        KitId: obj.KitId,
        onHold: obj.OnHold,
      },
    ]);
  };
  const addNewRow = () => {
    setSampleList([
      ...sampleList,
      {
        key: new Date().getTime(),
        SampleId: `${sampleList.length + 1}`,
        ScreeningId: "",
        KitId: "",
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
      <Box sx={{ flexGrow: 1 }} style={{ paddingTop: "1em" }}>
        <Grid container spacing={2}>
          <Grid item xs="auto">
            <Button variant="contained" onClick={() => history.push("/")}>
              Cancel
            </Button>
          </Grid>

          <Grid item xs={4}></Grid>
          <Grid item xs="auto">
            {editMode && (
              <Button
                variant="contained"
                color="error"
                onClick={() => history.goBack()}
              >
                Delete
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
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
          {retrievedCase && (
            <div>
              <h4>Case ID: {retrievedCase.CaseId} </h4>
            </div>
          )}
          <TextField
            id="outlined"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            label="Comment"
          />
        </Box>

        <Box border="1px solid lightgrey" borderRadius="8px">
          {sampleList &&
            sampleList.map((sample, i) => {
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
  const [sampleId, setSampleId] = React.useState(props.obj.SampleId);
  const [screening, setScreening] = React.useState(props.obj.ScreeningId);
  const [kitId, setKitId] = React.useState(props.obj.KitId);
  const [onHold, setOnHold] = React.useState(props.obj.OnHold == 1);
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
            sampleObj["SampleId"] = e.target.value;
            setSampleObj(sampleObj);
            setSampleId(e.target.value);
          }}
          value={sampleId}
          label="Sample ID"
        />
      </div>
      <div className="row-item">
        <TextField
          select
          onChange={(e) => {
            sampleObj["ScreeningId"] = e.target.value;
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
            sampleObj["KitId"] = e.target.value;
            setSampleObj(sampleObj);
            setKitId(e.target.value);
          }}
          value={kitId}
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
                sampleObj["OnHold"] = e.target.checked;
                setSampleObj(sampleObj);
                setOnHold(e.target.checked);
              }}
              color="warning"
            />
          }
          label={onHold ? "On Hold" : ""}
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
