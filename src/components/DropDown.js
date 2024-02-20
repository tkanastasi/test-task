import * as bootstrap from 'react-bootstrap';
import { DropDownInfo } from '../App';

export function DropDown({ dropDownState, setDropDownState }) {
  return (
    <bootstrap.Dropdown onSelect={(eventKey) => setDropDownState(eventKey)}>
      <bootstrap.Dropdown.Toggle variant="primary" id="dropdown-basic">
        Сортировать {DropDownInfo[dropDownState][0]}
      </bootstrap.Dropdown.Toggle>

      <bootstrap.Dropdown.Menu>
        {Object.keys(DropDownInfo).map((key) => {
          return (
            <bootstrap.Dropdown.Item key={key} eventKey={key}>{DropDownInfo[key][0]}</bootstrap.Dropdown.Item>
          );
        })}
      </bootstrap.Dropdown.Menu>
    </bootstrap.Dropdown>
  );
}
