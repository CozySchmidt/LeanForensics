import React from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import {BsFillArrowDownCircleFill, BsFillArrowUpCircleFill} from "react-icons/bs";
import { GlobalFilter } from "./GlobalFilter";
import Button from "@mui/material/Button";

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
                    return <td {...cell.getCellProps({
                      style: {
                        width: cell.column.width
                      }
                    })}>{cell.render('Cell')}</td>
                  })}
                  <td align="center">
                    <Button onClick={() => {
                      window.location.href = `/case-editor?caseId=${row.values['CaseId']}`
                    }}>Edit</Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      );
}