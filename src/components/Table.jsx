import * as bootstrap from 'react-bootstrap';
import { TABLE_INFO } from '../App';

export function Table({ content, evalTrKey }) {
  const evalTrKeyFunc = evalTrKey === undefined ? ((_, idx) => idx) : evalTrKey;
  
  return (
    <bootstrap.Table striped bordered hover>
      <thead>
        <tr>
          {Object.values(TABLE_INFO).map((fieldName) => <th key={fieldName}>{fieldName}</th>)}
        </tr>
      </thead>
      <tbody>
        {content.map((row, idx) => (
          <tr key={evalTrKeyFunc(row, idx)}>
            {Object.keys(TABLE_INFO).map((key, idx) => <td key={idx}>{row[key]}</td>)}
          </tr>
        ))}
      </tbody>
    </bootstrap.Table>
  );
}
