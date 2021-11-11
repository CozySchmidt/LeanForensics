import React, { useMemo, useState } from "react";
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MOCK_DATA from '../../constants/mock_case.json';
import COLUMNS from './CaseColumn';
import './CaseView.css';
import { GlobalFilter } from "./GlobalFilter";
import {BsFillArrowDownCircleFill, BsFillArrowUpCircleFill} from "react-icons/bs";

function CaseView() {
  const data = useMemo(() => MOCK_DATA, []);
  const columns = useMemo(() => COLUMNS, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);

  const { globalFilter } = state;

  const [openModal, setOpenModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const handleModalOpen = (data) => {
    setOpenModal(true);
    setSelectedCase(data.original);
  };
  const handleModalClose = () => setOpenModal(false);

  const ModalView = () => {
    const style = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Case Number: {selectedCase && selectedCase.caseNumber}
          </Typography>
          {selectedCase &&
            selectedCase.samples.map((sample, i) => {
              return <div key={i}>ID: {sample.sampleNumber}, Batch #:{sample.batchNumber}</div>;
            })}
        </Box>
      </Modal>
    );
  };

  return (
    <div className="viewHolder">
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
              <th>View Samples</th>
              <th>Edit</th>
            </tr>
          ))}
        </thead>
        <tbody className="table--samples--body" {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
                <td>
                  <button onClick={() => handleModalOpen(row)}>
                    View Samples
                  </button>
                </td>
                <td>
                  <button onClick={() => {
                    alert(`Do you wish to edit Case ${row.values['caseNumber']}?`)
                  }}>Edit</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <ModalView />
    </div>
  )
}

export default CaseView;
