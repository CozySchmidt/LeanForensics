import React, { useMemo, useState } from "react";
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MOCK_DATA from '../../constants/mock_batch.json';
import COLUMNS from './BatchColumn';
import './BatchView.css';
import { GlobalFilter } from "./GlobalFilter";
import {BsFillArrowDownCircleFill, BsFillArrowUpCircleFill} from "react-icons/bs";

const BatchView = () => {

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
  const [selectedBatch, setSelectedBatch] = useState(null);

  const handleModalOpen = (batch) => {
    setOpenModal(true);
    setSelectedBatch(batch.original);
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
            Batch Number: {selectedBatch && selectedBatch.batchNumber}
          </Typography>
          {selectedBatch &&
            selectedBatch.samples.map((sample, i) => {
              return <div key={i}>{sample.sampleNumber}, {sample.currentStatus}</div>;
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
                    alert(`Do you wish to edit ${row.values['batchNumber']}?`)
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

  
  // const [samples, setSamples] = useState(MOCK_DATA);

  // return (
  //   <div className="samples--container">
  //     <Filter></Filter>
  //     <table className="table--samples">
  //       <thead className="table--samples--header">
  //         <tr>
  //           <th>Sample Number</th>
  //           <th>Current Status</th>
  //           <th>Case Number</th>
  //           <th>Batch Number</th>
  //           <th>Submitted On</th>
  //           <th>Created On</th>
  //           <th>Reported On</th>
  //         </tr>
  //       </thead>
  //       <tbody className="table--samples--body">
  //         {samples.map((sample) => (
  //           <tr>
  //             <td>{sample.sampleNumber}</td>
  //             <td>{sample.currentStatus}</td>
  //             <td>{sample.caseNumber}</td>
  //             <td>{sample.batchNumber}</td>
  //             <td>{sample.submitted}</td>
  //             <td>{sample.created}</td>
  //             <td>{sample.reported}</td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>
  // );

};

export default BatchView;
