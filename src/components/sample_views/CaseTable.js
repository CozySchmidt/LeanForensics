import React, {useState} from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import {BsFillArrowDownCircleFill, BsFillArrowUpCircleFill} from "react-icons/bs";
import { GlobalFilter } from "./GlobalFilter";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";

import { getSamplesByCaseId } from "../../api/CaseApi";

export default function CaseTable({ columns, data }) {
    const [pageSize, setPageSize] = React.useState(15);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
    } = useTable({
        columns,
        data
    }, useGlobalFilter, useSortBy);

    const {globalFilter} = state;

    const [openModal, setOpenModal] = useState(false);
    const [selectedCase, setSelectedCase] = useState(null);

    const handleModalOpen = async (selected_case) => {
        let caseSamples = await getSamplesByCaseId(selected_case.original.CaseId);
        console.log(caseSamples);
        setSelectedCase(caseSamples);
        setOpenModal(true);
    };

    const handleModalClose = () => setOpenModal(false);

    const ModalView = () => {
        const style = {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "70%",
            height: "70%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
        };

    return (
        <Modal
            open={openModal}
            onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" color="#60636c" fontWeight="bold">
                Case Number: {selectedCase && selectedCase.CaseId}
            </Typography>

                <Button
                  sx={{
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
                  size="medium"
                  variant="outlined"
                  onClick={() =>
                    (window.location.href = `/case-editor?caseId=${selectedCase.CaseId}`)
                  }
                >
                  Edit
                </Button>

            {selectedCase && (
                <DataGrid
                rows={selectedCase.Samples}
                columns={sampleColumns}
                getRowId={(r) => r.CaseId + "-" + r.SampleId}
                pageSize={pageSize}
                disableSelectionOnClick
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                pagination
                rowsPerPageOptions={[15, 20, 50]}
                style={{ height: "70%", marginTop: "10px", color: "#003C71" }}
                />
            )}
            </Box>
        </Modal>
        );
    };

    return (
      <div className="table--holder">
        <div className="table--filter">
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
        </div>
        <table className="table--samples" {...getTableProps()}>
            <thead className="table--samples--header">
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span className="table--samples--header--sorted">
                        {column.isSorted ? (column.isSortedDesc ? <BsFillArrowDownCircleFill/> : <BsFillArrowUpCircleFill/>) : ''}
                    </span>
                    </th>
                ))}
                </tr>
            ))}
            </thead>
            <tbody className="table--samples--body" {...getTableBodyProps()}>
            {rows.map(row => {
                prepareRow(row);
                return (
                <tr {...row.getRowProps()} onClick={() => handleModalOpen(row)}  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#e4e5e7";
                    e.currentTarget.style.cursor = "pointer";
                }} onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "";
                }}>
                    {row.cells.map(cell => {
                    return <td {...cell.getCellProps({
                      style: {
                        height: 30,
                      }
                    })}>{cell.render('Cell')}</td>
                    })}
                </tr>
                )
            })}
            </tbody>
        </table>
        <ModalView />
      </div>
    );
}

const sampleColumns = [
    {
      field: "SampleId",
      headerName: "Sample ID",
      width: 100,
    },
    {
      field: "SampleName",
      headerName: "Sample Name",
      width: 200,
    },
    {
        field: "KorQ",
        headerName: "K or Q",
        width: 100,
    },
    {
      field: "CaseId",
      headerName: "Case ID",
      width: 90,
    },
    {
      field: "Comment",
      headerName: "Comment",
      width: 200,
    },
    {
      field: "OnHold",
      headerName: "On Hold",
      width: 150,
      renderCell: (cellValues) => {
        return (
          cellValues.value === 1 && (
              <Button loading variant="contained" color="warning"
                      style={{ cursor: 'not-allowed', pointerEvents: "none" }}
              >
                  On Hold
              </Button>
          )
        );
      },
    },
];