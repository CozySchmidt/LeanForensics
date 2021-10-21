import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import { batchSampleData } from "../constants/testData";

import "./BatchEditorScreen.css";

const columns = [
  {
    field: "sampleId",
    headerName: "Sample ID",
    width: 200,
  },
  {
    field: "screening",
    headerName: "Screening Method",
    width: 200,
  },
  {
    field: "number",
    headerName: "# of Samples",
    width: 130,
  },
  {
    field: "kit",
    headerName: "Kit Type",
    width: 150,
  },
  {
    field: "hold",
    headerName: "On Hold",
    width: 150,
  },
  {
    field: "date",
    headerName: "Created Date",
    width: 300,
  },
];

function BatchEditorScreen() {
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [pageSize, setPageSize] = React.useState(15);

  useEffect(() => {}, []);

  return (
    <Container className="screen-holder">
      <Row lg={4}>
        <Col className="tool-bar">Empty area</Col>
      </Row>
      <div className="content-wrapper">
        <DataGrid
          rows={batchSampleData}
          columns={columns}
          getRowId={(r) => r.sampleId}
          checkboxSelection
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          pagination
          rowsPerPageOptions={[15, 20, 50]}
          onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
            console.log(selectionModel);
          }}
          selectionModel={selectionModel}
        />
      </div>
    </Container>
  );
}

export default BatchEditorScreen;
