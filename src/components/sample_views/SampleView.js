import React, { useMemo } from "react";
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import MOCK_DATA from '../../constants/mock_samples.json';
import COLUMNS from './Columns';
import './SampleView.css';
import { GlobalFilter } from "./GlobalFilter";
import {BsFillArrowDownCircleFill, BsFillArrowUpCircleFill} from "react-icons/bs";

const SampleView = () => {

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
                  <button onClick={() => {
                    alert(`Do you wish to edit ${row.values['sampleNumber']}?`)
                  }}>Edit</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
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

export default SampleView;
