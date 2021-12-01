import React, {useEffect} from "react";
import {useHistory} from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import queryString from "query-string";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from '@mui/material/Divider';

import "./CaseEditorScreen.css";
import {
    createCase,
    getSamplesByCaseId,
    updateCaseWithSamples,
    deleteCase,
} from "../api/CaseApi";
import {getAllKitType, getAllScreeningMethods} from "../api/OthersApi";
// import DeleteIcon from "@mui/material/SvgIcon/SvgIcon";
// import ClearIcon from "@mui/material/SvgIcon/SvgIcon";

let placeHolderData = [];
for (let i = 0; i < 3; i++) {
    placeHolderData.push({
        key: new Date().getTime() + i + 1,
        SampleId: `${i + 1}`,
        Comment: "",
        KorQ: "",
        ScreeningId: "",
        KitId: "",
        OnHold: false,
    });
}

const CaseEditorScreen = ({location}) => {
    const history = useHistory();
    const query = queryString.parse(location.search);
    const [retrievedCase, setRetrievedCase] = React.useState(null);
    const [editMode, setEditMode] = React.useState(query.caseId ? true : false);
    const [sampleList, setSampleList] = React.useState(
        editMode ? [] : [...placeHolderData]
    );
    const [initialSampleList, setInitialSampleList] = React.useState([]);
    const [casefile, setComment] = React.useState("");
    const [openDialog, setOpenDialog] = React.useState(false);
    const [kitTypeData, setKitTypeData] = React.useState([]);
    const [screeningData, setScreeningData] = React.useState([]);
    const [sampleType, setSampleType] = React.useState("");

    useEffect(() => {
        retrieveKitTypes();
        retrieveScreening();
        editMode && retrieveCaseById();
    }, []);

    const handleClickDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const retrieveKitTypes = async () => {
        let kit = await getAllKitType();
        console.log(kit);
        setKitTypeData(kit);
    };

    const retrieveScreening = async () => {
        let methods = await getAllScreeningMethods();
        console.log(methods);
        setScreeningData(methods);
    };

    async function retrieveCaseById() {
        let caseResult = await getSamplesByCaseId(query.caseId);
        console.log(caseResult);
        setRetrievedCase(caseResult);
        setComment(caseResult.CaseFile);
        let keyList = caseResult.Samples.map((sample, i) => {
            sample["key"] = new Date().getTime() + i + 1;
            return sample;
        });
        console.log(keyList);
        setSampleList(keyList);
        setInitialSampleList(JSON.parse(JSON.stringify(keyList)));
    }

    const onDeleteCase = async () => {
        setOpenDialog(false);
        let result = await deleteCase(retrievedCase.CaseId);
        if (result) {
            alert("Successfully deleted.");
            history.push("/");
        } else {
            alert("Failed. Something went wrong.");
        }
    };

    const onSubmitCase = async (e) => {
        //TODO: validation required
        let caseObj = {
            CaseFile: casefile,
        };

        let temp = sampleList.map(function (sample, i) {
            // Change empty string to null
            if (
                sample["ScreeningId"] !== null &&
                sample["ScreeningId"].toString().trim().length === 0
            ) {
                sample["ScreeningId"] = null;
            }
            if (
                sample["Comment"] !== null &&
                sample["Comment"].toString().trim().length === 0
            ) {
                sample["Comment"] = null;
            }
            if (
                sample["KitId"] !== null &&
                sample["KitId"].toString().trim().length === 0
            ) {
                sample["KitId"] = null;
            }
            if (
                sample["KorQ"] !== null &&
                sample["KorQ"].toString().trim().length === 0
            ) {
                sample["KorQ"] = null;
            }
            //exclude key to check emptiness
            delete sample.key;
            return sample;
        });
        let filteredList = filterEmptyList(temp);
        console.log("caseObj", caseObj);
        console.log("filteredList", filteredList);

        if (filteredList.length > 0) {
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
                    CaseFile: casefile,
                    deleteSampleList: deleteSampleList,
                    newSampleList: newSampleList,
                };
                if (deleteSampleList.length > 0 && newSampleList.length > 0) {
                    let caseResult = await updateCaseWithSamples(caseObj);
                    if (caseResult) {
                        alert("Successfully Updated.");
                        history.push("/");
                    }
                } else {
                    alert("No changes detected.");
                }
            } else {
                let empty = false;
                let i;
                for (i = 0; i < filteredList.length; i++) {
                    if (filteredList[i].ScreeningId == null || filteredList[i].KorQ == null || filteredList[i].KitId == null) {
                        empty = true;
                    }
                }
                if (empty) {
                    alert("Please fill in all the required fields: Screening Method, K or Q, and Kit Type!");
                } else {
                    //Create api call
                    let result = await createCase(caseObj, filteredList);
                    if (result) {
                        alert("Successfully created case.");
                        window.location.href = "/status-view";
                    } else {
                        alert("Something went wrong. Please try again later");
                    }
                }
            }
        } else {
            alert("Case cannot be empty.");
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

    const checkNotEmptyObject = (obj, i) => {
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
                KorQ: obj.KorQ,
                ScreeningId: obj.ScreeningId,
                KitId: obj.KitId,
                OnHold: obj.OnHold,
            },
        ]);
    };
    const addNewRow = () => {
        setSampleList([
            ...sampleList,
            {
                key: new Date().getTime(),
                SampleId: `${sampleList.length + 1}`,
                KorQ: "",
                ScreeningId: "",
                KitId: "",
                OnHold: false,
            },
        ]);
    };

    const deleteRow = (index) => {
        const items = sampleList.filter((item, i) => index !== i);
        setSampleList(items);
    };

    const DialogView = () => {
        return (
            retrievedCase && (
                <Dialog
                    open={openDialog}
                    onClose={handleDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {`Delete Case with ID: ${retrievedCase.CaseId}`}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>No</Button>
                        <Button onClick={onDeleteCase} autoFocus>
                            YES
                        </Button>
                    </DialogActions>
                </Dialog>
            )
        );
    };

    return (
        <div className="screen-holder">
            <Box sx={{flexGrow: 1}} style={{paddingTop: "1em"}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div className="button-container">
                        <Button id="cancel-btn"
                            variant="outlined"
                            onClick={() => history.push("/")}
                            startIcon={<ClearIcon/>}
                        >
                            Cancel
                        </Button>
                        </div>
                    </Grid>
                    <Grid item xs={20}>
                        <div className="button-container">
                        {editMode && (
                            <Button id="delete-btn"
                                    variant="contained"
                                    startIcon={<DeleteIcon/>}
                                    onClick={handleClickDialogOpen}
                                    sx={{m:1}}
                            >
                                Delete
                            </Button>
                            )}
                        </div>
                    </Grid>
                </Grid>
            </Box>
            <div className="content-wrapper">
                <Box
                    component="form"
                    sx={{
                        "& > :not(style)": {
                            m: 1,
                            width: "25ch",
                            maxWidth: "100%",
                        },
                    }}
                    noValidate
                    border="1px solid #003C71"
                    borderRadius="8px"
                    autoComplete="off"
                    backgroundColor="white"
                    padding="25px"
                    color="#003C71"
                >
                    <div className="buttons-case-editor">
                        <Grid item xs="auto">
                            <Button id="button"
                                variant="contained"
                                onClick={addNewRow}
                                startIcon={<AddIcon/>}
                            >
                                Add
                            </Button>
                        </Grid>
                        <Grid item xs="auto">
                            <div className="btn-divider">
                            <Button id="button"
                                loading
                                variant="contained"
                                onClick={onSubmitCase}
                            >
                                Submit
                            </Button>
                            </div>
                        </Grid>
                    </div>
                    <h2>Case Information</h2>
                    {retrievedCase && (
                        <div>
                            <h4>Case ID: {retrievedCase.CaseId} </h4>
                        </div>
                    )}
                    <TextField
                        id="outlined"
                        onChange={(e) => setComment(e.target.value)}
                        value={casefile}
                        label="Case File"
                    />
                </Box>
                <br/>
                <Box
                    style={{paddingBottom: "1em"}}
                    border="1px solid #003C71"
                    borderRadius="8px"
                    backgroundColor="white"
                    paddingTop="1em"
                >
                    {sampleList &&
                    sampleList.map((sample, i) => {
                        return (
                            <div className="sample-row">
                                <SampleRow
                                    key={sample.key}
                                    index={i}
                                    obj={sample}
                                    onDelete={deleteRow}
                                    onAdd={addSubRow}
                                    screeningData={screeningData}
                                    kitTypeData={kitTypeData}
                                    sampleType={sampleType}
                                />
                            </div>
                        );
                    })}
                </Box>
                <div className="box-divider"/>
            </div>
            <DialogView/>
        </div>
    );
};

const SampleRow = (props) => {
    const [sampleObj, setSampleObj] = React.useState(props.obj);
    const [comment, setComment] = React.useState(props.obj.Comment);
    const [sampleId, setSampleId] = React.useState(props.obj.SampleId);
    const [screening, setScreening] = React.useState(props.obj.ScreeningId);
    const [kitId, setKitId] = React.useState(props.obj.KitId);
    const [onHold, setOnHold] = React.useState(props.obj.OnHold == 1);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [sampleType, setSampleType] = React.useState(props.obj.KorQ);

    const sampleTypes = [
        {
            value: "K",
            label: "K",
        },
        {
            value: "Q",
            label: "Q",
        },
    ];

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCreateNew = () => {
        props.onAdd(sampleObj);
        setAnchorEl(null);
    };

    return (
        <div className="sample-row" style={{marginTop: "50px"}}>
            <div className="row-item">
                {props.index + 1}
            </div>
            <div className="row-item">
                <TextField
                    id="outlined"
                    required
                    onChange={(e) => {
                        sampleObj["SampleId"] = e.target.value;
                        setSampleObj(sampleObj);
                        setSampleId(e.target.value);
                    }}
                    value={sampleId}
                    label="Sample ID"
                    sx={{m:2, width: "30ch"}}
                />
            </div>
            <div className="row-item">
                <TextField
                    select
                    required
                    onChange={(e) => {
                        sampleObj["KorQ"] = e.target.value;
                        setSampleObj(sampleObj);
                        setSampleType(e.target.value);
                    }}
                    value={sampleType}
                    label="K or Q"
                    sx={{m:2, width: "30ch"}}
                >
                    {sampleTypes.map((sampleType) => (
                        <MenuItem key={sampleType.value} value={sampleType.value}>
                            {sampleType.label}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
            <div className="row-item">
                <TextField
                    select
                    required
                    onChange={(e) => {
                        sampleObj["ScreeningId"] = e.target.value;
                        setSampleObj(sampleObj);
                        setScreening(e.target.value);
                    }}
                    value={screening}
                    label="Screening Method"
                    sx={{m:2, width: "30ch"}}
                >
                    {props.screeningData.map((screening) => (
                        <MenuItem key={screening.ScreeningId} value={screening.ScreeningId}>
                            {screening.ScreeningName}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
            <div className="row-item">
                <TextField
                    select
                    required
                    onChange={(e) => {
                        sampleObj["KitId"] = e.target.value;
                        setSampleObj(sampleObj);
                        setKitId(e.target.value);
                    }}
                    value={kitId}
                    label="Kit Type"
                    sx={{m:1,ml:2, width: "30ch"}}
                >
                    {props.kitTypeData.map((kitType) => (
                        <MenuItem key={kitType.KitId} value={kitType.KitId}>
                            {kitType.KitName}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
            <div className="row-item">
                <TextField
                    id="outlined"
                    onChange={(e) => {
                        sampleObj["Comment"] = e.target.value;
                        setSampleObj(sampleObj);
                        setComment(e.target.value);
                    }}
                    value={comment}
                    label="Comment"
                    sx={{m:1, width: "30ch"}}
                />
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
                    label={onHold ? "On Hold" : "Off"}
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
                    <MoreHorizIcon/>
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
                    <MenuItem onClick={handleCreateNew}>Create Sub-sample</MenuItem>
                </Menu>
            </div>
            <div className="row-item-icon">
                <IconButton
                    aria-label="delete"
                    onClick={() => props.onDelete(props.index)}
                >
                    <DeleteRoundedIcon/>
                </IconButton>
            </div>
        </div>
    );
};

export default CaseEditorScreen;