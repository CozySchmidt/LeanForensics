import React from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import {BsFillArrowDownCircleFill, BsFillArrowUpCircleFill} from "react-icons/bs";
import { GlobalFilter } from "./GlobalFilter";

export default function Table({ columns, data }) {

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
                      alert(`Do you wish to edit Sample ID: ${row.values['SampleId']}?`)
                    }}>Edit</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </>
      );
}