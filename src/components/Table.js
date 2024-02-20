import * as bootstrap from 'react-bootstrap';
import { TableInfo } from '../App';

export function Table({ content, evalTrKey }) {
  const evalTrKeyFunc = evalTrKey === undefined ? ((_, idx) => idx) : evalTrKey;
  
  return (
    <bootstrap.Table striped bordered hover>
      <thead>
        <tr>
          {Object.values(TableInfo).map((fieldName) => <th key={fieldName}>{fieldName}</th>)}
        </tr>
      </thead>
      <tbody>
        {content.map((row, idx) => (
          <tr key={evalTrKeyFunc(row, idx)}>
            {Object.keys(TableInfo).map((key, idx) => <td key={idx}>{row[key]}</td>)}
          </tr>
        ))}
      </tbody>
    </bootstrap.Table>
  );
}
