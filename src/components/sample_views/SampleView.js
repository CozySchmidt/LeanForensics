import React from "react";
import data from '../../constants/mock_samples.json';
import { useState } from 'react';
import './SampleView.css';

const SampleView = () => {

  const [samples, setSamples] = useState(data);

  return (
    <div className="samples--container">
      <table className="table--samples">
        <thead className="table--samples--header">
          <tr>
            <th>Sample Number</th>
            <th>Current Status</th>
            <th>Case Number</th>
            <th>Batch Number</th>
            <th>Submitted On</th>
            <th>Created On</th>
            <th>Reported On</th>
          </tr>
        </thead>
        <tbody className="table--samples--body">
          {samples.map((sample) => (
            <tr>
              <td>{sample.sampleNumber}</td>
              <td>{sample.currentStatus}</td>
              <td>{sample.caseNumber}</td>
              <td>{sample.batchNumber}</td>
              <td>{sample.submitted}</td>
              <td>{sample.created}</td>
              <td>{sample.reported}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SampleView;
