import React from "react";
import { Container, Row, Nav, Col, Tab, Button } from "react-bootstrap";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { StatusView, CaseView, SampleView, BatchView } from "./";

import "./ViewHolderScreen.css";

const ViewHolderScreen = () => {
  const history = useHistory();

  return (
    <Container className="screen-holder">
      <Row lg={4}>
        <Col className="tool-bar">Tool bar area</Col>
        <Button as={Col} onClick={() => history.push("/batch-editor")}>
          Add batch
        </Button>
        <Button as={Col} onClick={() => history.push("/case-editor")}>
          Add case
        </Button>
      </Row>
      <ViewTabs />
      <div className="view-wrapper">
        <Container>
          <Switch>
            <Route path={`/case-view`} component={CaseView} />
            <Route path={`/sample-view`} component={SampleView} />
            <Route path={`/batch-view`} component={BatchView} />
            <Route component={StatusView} />
          </Switch>
        </Container>
      </div>
    </Container>
  );
};

const ViewTabs = () => {
  const location = useLocation();
  let pathname = location.pathname;
  let currentUrl = "/" + pathname.split("/")[1];
  // let currentUrl =
  //   pathname.slice(-1) === "/"
  //     ? pathname.substring(0, pathname.length - 1)
  //     : pathname;

  return (
    <div>
      <Tab.Container
        activeKey={
          currentUrl !== "/status-view" &&
          currentUrl !== "/sample-view" &&
          currentUrl !== "/batch-view" &&
          currentUrl !== "/case-view"
            ? "/status-view"
            : currentUrl
        }
      >
        <Nav variant="tabs">
          <Nav.Link href="/status-view">Status View</Nav.Link>
          <Nav.Link href="/sample-view">Sample View</Nav.Link>
          <Nav.Link href="/batch-view">Batch View</Nav.Link>
          <Nav.Link href="/case-view">Case View</Nav.Link>
        </Nav>
      </Tab.Container>
    </div>
  );
};

export default ViewHolderScreen;
