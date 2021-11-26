import React, { useMemo, useState, useEffect } from "react";
import MOCK_DATA from '../../constants/mock_case.json';
import COLUMNS from './CaseColumn';
import './CaseView.css';

import {getAllCases} from "../../api/CaseApi";
import CaseTable from "./CaseTable.js";

function CaseView() {
  // const data = useMemo(() => MOCK_DATA, []);
  // const columns = useMemo(() => COLUMNS, []);
  let [caseList, setCaseList] = useState(null);

  useEffect(() => {
    retrieveCases();
  }, []);

  async function retrieveCases() {
    let caseList = await getAllCases();
    console.log(caseList);
    setCaseList(caseList);
  }

  const columns = useMemo(() => [
    {
      accessor: "CaseId",
      Header: "Case ID",
      width: 50,
    },
    {
      accessor: "CaseFile",
      Header: "Case File",
      width: 200,
    },
    {
      accessor: "CreatedDate",
      Header: "Created Date",
      width: 110,
    },
  ], []);

  // const {
  //   getTableProps,
  //   getTableBodyProps,
  //   headerGroups,
  //   rows,
  //   prepareRow,
  //   state,
  //   setGlobalFilter,
  // } = useTable({ columns, data }, useGlobalFilter, useSortBy);

  // const { globalFilter } = state;

  // const [openModal, setOpenModal] = useState(false);
  // const [selectedCase, setSelectedCase] = useState(null);

  // const handleModalOpen = (data) => {
  //   setOpenModal(true);
  //   setSelectedCase(data.original);
  // };
  // const handleModalClose = () => setOpenModal(false);

  // const ModalView = () => {
  //   const style = {
  //     position: "absolute",
  //     top: "50%",
  //     left: "50%",
  //     transform: "translate(-50%, -50%)",
  //     width: 400,
  //     bgcolor: "background.paper",
  //     border: "2px solid #000",
  //     boxShadow: 24,
  //     p: 4,
  //   };

    while (caseList == null) {
      return (
        <div>

        </div>
      )
    }
    return (
      <div className="viewHolder">
        <CaseTable columns={columns} data={caseList}/>
      </div>
  )
}

export default CaseView;
