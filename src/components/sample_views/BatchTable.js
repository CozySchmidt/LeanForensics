import React, {useState} from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import {BsFillArrowDownCircleFill, BsFillArrowUpCircleFill} from "react-icons/bs";
import { GlobalFilter } from "./GlobalFilter";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";

import { getSamplesByBatchId } from "../../api/BatchApi";

export default function BatchTable({ columns, data }) {
    const [pageSize, setPageSize] = useState(15);

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
    const [selectedBatch, setSelectedBatch] = useState(null);

    const handleModalOpen = async (selectedBatch) => {
        let batch = await getSamplesByBatchId(selectedBatch.original.BatchId);
        setSelectedBatch(batch);
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
                <Typography id="modal-modal-title" variant="h6" component="h2" color="#003C71">
                    Batch ID: {selectedBatch && selectedBatch.BatchId}
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
                    (window.location.href = `/batch-editor?batchId=${selectedBatch.BatchId}`)
                  }
                >
                  Edit batch
                </Button>

                {selectedBatch && (
                    <DataGrid
                    rows={selectedBatch.Samples}
                    columns={sampleColumns}
                    getRowId={(r) => r.CaseId + "-" + r.SampleId}
                    pageSize={pageSize}
                    disableSelectionOnClick
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    pagination
                    rowsPerPageOptions={[15, 20, 50]}
                    style={{ height: "70%", marginTop: "10px" }}
                    />
                )}
                </Box>
            </Modal>
        );
    };

    return (
      <>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
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
                <tr {...row.getRowProps({})} onClick={() => handleModalOpen(row)} onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "yellow";
                }} onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "";
                }}>
                    {row.cells.map(cell => {
                            return (
                                <td {...cell.getCellProps({
                                    style: {
                                      width: cell.column.width
                                    }
                                  })}>
                                    {cell.render('Cell')}
                                </td>
                            )
                    })}
                </tr>
                )
            })}
            </tbody>
        </table>
        <ModalView />
      </>
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
        width: 150,
    },
    {
        field: "Comment",
        headerName: "Comment",
        width: 150,
    },
    {
        field: "KorQ",
        headerName: "K or Q",
        width: 100,
    },
    {
        field: "BatchId",
        headerName: "Batch ID",
        width: 150,
    },
    {
        field: "ScreeningName",
        headerName: "Screening Name",
        width: 190,
    },
    {
        field: "KitName",
      headerName: "Kit Name",
      width: 150,
    },
    {
        field: "CaseId",
        headerName: "Case ID",
        width: 150,
    },
    {
        field: "OnHold",
        headerName: "On Hold",
        width: 150,
        renderCell: (cellValues) => {
          return (
            cellValues.value === 1 && (
              <Button variant="contained" color="warning">
                On Hold
              </Button>
            )
          );
        },
    },
];