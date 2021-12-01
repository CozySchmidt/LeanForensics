import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { StatusView, CaseView, SampleView, BatchView } from "./";
import "./ViewHolderScreen.css";
import SouthWestIcon from "@mui/material/SvgIcon/SvgIcon";
import Grid from "@mui/material/Grid";

function ViewHolderScreen() {
  const history = useHistory();

  return (
    <div className="screen-holder">
      <Grid item xs="auto">
        <div className="add-buttons">
          <Button
            loading variant="outlined"
            startIcon={<AddIcon />}
            sx={{
              color: "white",
              backgroundColor: "#4682B4",
              fontWeight: "bold",
              textTransform: "capitalize",
              '&:hover': {
                backgroundColor: "#90CAF9",
                color: "#003C71",
                fontWeight: "bold"
              }
            }}
            onClick={() => history.push("/batch-editor")}
          >
            Add batch
          </Button>
          <div className="divider"/>
          <Button
            loading variant="outlined"
            startIcon={<AddIcon />}
            sx={{
              color: "white",
              backgroundColor: "#4682B4",
              fontWeight: "bold",
              textTransform: "capitalize",
              '&:hover': {
                backgroundColor: "#90CAF9",
                color: "#003C71",
                fontWeight: "bold"
              }
            }}
            onClick={() => history.push("/case-editor")}
          >
            Add case
          </Button>
        </div>
      </Grid>
      <ViewTabs />
      <div className="view-wrapper">
        <Switch>
          <Route path={`/case-view`} component={CaseView} />
          <Route path={`/sample-view`} component={SampleView} />
          <Route path={`/batch-view`} component={BatchView} />
          <Route component={StatusView} />
        </Switch>
      </div>
    </div>
  );
}
const ViewTabs = () => {
  const location = useLocation();
  let pathname = location.pathname;
  let currentUrl = "/" + pathname.split("/")[1];

  function handleChange() {
    switch (currentUrl) {
      case "/status-view":
        return 0;
      case "/sample-view":
        return 1;
      case "/batch-view":
        return 2;
      case "/case-view":
        return 3;
      default:
        return 0;
    }
  }

  return (
    <Box sx={{ width: "100%"}}>
      <Tabs
          value={handleChange()}>
        <Tab href="/status-view" label="Status View"
             sx={{
               color: "white",
               fontWeight: "bold",
               fontFamily: `"Roboto", sans-serif`,
               '&:hover': {
                 backgroundColor: "#D3D9DE",
                 color: "#003C71",
                 fontWeight: "bold"
               }
             }}
        />
        <Tab href="/sample-view" label="Sample View"
             sx={{
               color: "white",
               fontWeight: "bold",
               fontFamily: `"Roboto", sans-serif`,
               '&:hover': {
                 backgroundColor: "#D3D9DE",
                 color: "#003C71",
                 fontWeight: "bold"
               }
             }}
        />
        <Tab href="/batch-view" label="Batch View"
             sx={{
               color: "white",
               fontWeight: "bold",
               fontFamily: `"Roboto", sans-serif`,
               '&:hover': {
                 backgroundColor: "#D3D9DE",
                 color: "#003C71",
                 fontWeight: "bold"
               }
             }}
        />
        <Tab href="/case-view" label="Case View"
             sx={{
               color: "white",
               fontWeight: "bold",
               fontFamily: `"Roboto", sans-serif`,
               '&:hover': {
                 backgroundColor: "#D3D9DE",
                 color: "#003C71",
                 fontWeight: "bold"
               }
             }}
        />
      </Tabs>
    </Box>
  );
};

export default ViewHolderScreen;
