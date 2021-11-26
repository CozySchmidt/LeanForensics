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
            alert("Successfully Deleted.");
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
        // console.log(caseObj);
        console.log(filteredList);

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
                //Create api call
                let result = await createCase(caseObj, filteredList);
                if (result) {
                    alert("Successfully added!");
                    window.location.href = "/status-view";
                } else {
                    alert("Something went wrong. Please try again later");
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
                    <Grid item xs="auto">
                        <Button
                            loading
                            variant="outlined"
                            onClick={() => history.push("/")}
                            startIcon={<ClearIcon/>}
                            sx={{
                                marginLeft: 112,
                                marginTop: 1,
                                color: "whitesmoke",
                                backgroundColor: "#003C71",
                                fontWeight: "bold",
                                textTransform: "capitalize",
                                "&:hover": {
                                    backgroundColor: "#D3D9DE",
                                    color: "#003C71",
                                    fontWeight: "bold",
                                },
                            }}
                        >
                            Cancel
                        </Button>
                    </Grid>

                    <Grid item xs={4}></Grid>
                    <Grid item xs="auto">
                        {editMode && (
                            <Button
                                variant="outlined"
                                startIcon={<DeleteIcon/>}
                                sx={{
                                    position: "absolute",
                                    marginTop: 4.2,
                                    marginLeft: 40,
                                    backgroundColor: "#d11a2a",
                                    color: "whitesmoke",
                                    fontWeight: "bold",
                                    textTransform: "capitalize",
                                    "&:hover": {
                                        backgroundColor: "#b30000",
                                        color: "darkgrey",
                                        fontWeight: "bold",
                                    },
                                }}
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
                        "& > :not(style)": {
                            m: 1,
                            width: "25ch",
                            maxWidth: "100%",
                        },
                    }}
                    noValidate
                    border="1px solid #FFF200"
                    borderRadius="8px"
                    autoComplete="off"
                    backgroundColor="whitesmoke"
                    padding="25px"
                    color="#003C71"
                >
                    <Grid item xs="auto">
                        <Button
                            variant="outlined"
                            onClick={addNewRow}
                            startIcon={<AddIcon/>}
                            sx={{
                                position: "absolute",
                                marginLeft: 96,
                                color: "whitesmoke",
                                backgroundColor: "#4682B4",
                                fontWeight: "bold",
                                textTransform: "capitalize",
                                "&:hover": {
                                    backgroundColor: "#90CAF9",
                                    color: "#003C71",
                                    fontWeight: "bold",
                                },
                            }}
                        >
                            Add
                        </Button>
                        <Button
                            loading
                            variant="outlined"
                            onClick={onSubmitCase}
                            sx={{
                                position: "absolute",
                                marginLeft: 108,
                                color: "whitesmoke",
                                backgroundColor: "#4682B4",
                                fontWeight: "bold",
                                textTransform: "capitalize",
                                "&:hover": {
                                    backgroundColor: "#90CAF9",
                                    color: "#003C71",
                                    fontWeight: "bold",
                                },
                            }}
                        >
                            Submit
                        </Button>
                    </Grid>
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
                        label="Comment"
                    />
                </Box>
                <div className="box-divider"/>
                <Box
                    style={{paddingBottom: "1em"}}
                    border="1px solid #FFF200"
                    borderRadius="8px"
                    backgroundColor="whitesmoke"
                    paddingTop="1em"
                >
                    {sampleList &&
                    sampleList.map((sample, i) => {
                        return (
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
                        );
                    })}
                </Box>
            </div>
            <DialogView/>
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
        <div className="sample-row">
            <div className="row-item" style={{margin: "10px"}}>
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
                        sampleObj["KorQ"] = e.target.value;
                        setSampleObj(sampleObj);
                        setSampleType(e.target.value);
                    }}
                    value={sampleType}
                    label="K or Q"
                    sx={{m: 2, width: "10ch"}}
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
                    onChange={(e) => {
                        sampleObj["ScreeningId"] = e.target.value;
                        setSampleObj(sampleObj);
                        setScreening(e.target.value);
                    }}
                    value={screening}
                    label="Screening Method"
                    sx={{m: 2, width: "20ch"}}
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
                    onChange={(e) => {
                        sampleObj["KitId"] = e.target.value;
                        setSampleObj(sampleObj);
                        setKitId(e.target.value);
                    }}
                    value={kitId}
                    label="Kit Type"
                    sx={{m: 1, width: "20ch"}}
                >
                    {props.kitTypeData.map((kitType) => (
                        <MenuItem key={kitType.KitId} value={kitType.KitId}>
                            {kitType.KitName}
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