import * as bootstrap from 'react-bootstrap';
import { DROPDOWN_INFO } from '../App';

export function DropDown({ dropDownState, setDropDownState }) {
  return (
    <bootstrap.Dropdown onSelect={(eventKey) => setDropDownState(eventKey)}>
      <bootstrap.Dropdown.Toggle variant="primary" id="dropdown-basic">
        Сортировать {DROPDOWN_INFO[dropDownState][0]}
      </bootstrap.Dropdown.Toggle>

      <bootstrap.Dropdown.Menu>
        {Object.keys(DROPDOWN_INFO).map((key) => {
          return (
            <bootstrap.Dropdown.Item key={key} eventKey={key}>{DROPDOWN_INFO[key][0]}</bootstrap.Dropdown.Item>
          );
        })}
      </bootstrap.Dropdown.Menu>
    </bootstrap.Dropdown>
  );
}
