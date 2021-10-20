import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import {
  ViewHolderScreen,
  BatchEditorScreen,
  CaseEditorScreen,
} from "./screens";

class App extends Component {
  render() {
    return (
      <div
        className="App"
        style={{
          height: "100%",
        }}
      >
        <Switch>
          <Route path="/batch-editor" component={BatchEditorScreen} />
          <Route path="/case-editor" component={CaseEditorScreen} />
          <Route path="/" component={ViewHolderScreen} />
        </Switch>
      </div>
    );
  }
}
export default App;
