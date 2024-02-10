import './App.scss';
import { useState, useEffect } from 'react';
import * as bootstrap from 'react-bootstrap';

function Table({header, content}) {
  const headerNames = header.filter((el, idx) => idx % 2 === 1);
  const accessKeys = header.filter((el, idx) => idx % 2 === 0);

  const listOfTh = headerNames.map((fieldName) => 
    <th>{fieldName}</th>
  );
  
  const rows = content.map((obj) => 
    <tr>
      {accessKeys.map((key) => 
        <td>{obj[key]}</td>
      )}
    </tr>
  );

  return (
    <bootstrap.Table striped bordered hover>
      <thead>
        <tr>
          {listOfTh}
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </bootstrap.Table>
  );
}

function joinReviewsAndUsers(reviews, users) {
  function getReviewTypeDescription(rtype) {
    return rtype === 1 ? "положительное" : "отрицательное"; 
  }

  let idToUserNameMap = new Map();
  for (let user of users) {
    let userName = user["lastName"] + " " + user["firstName"];
    idToUserNameMap.set(user["userId"], userName);
  }

  let table = [];
  for (let review of reviews) {
    let userId = review["userId"];
    let userCol;
    if (idToUserNameMap.has(userId)) {
      userCol = idToUserNameMap.get(userId);
    } else {
      userCol = "Пользователь не найден";
    }

    table.push({"reviewId": review["id"],
                "reviewType": getReviewTypeDescription(review["reviewType"]),
                "reviewText": review["reviewText"],
                "userInfo": userCol,
                "userId": idToUserNameMap.has(userId) ? userId : null
    });
  }
  return table;
}

function sortTable(table, dropdownState) {
  if (dropdownState === "reviewId") {
    return table.sort((a, b) => a["reviewId"] > b["reviewId"] ? 1 : (a["reviewId"] < b["reviewId"] ? -1 : 0));
  } else if (dropdownState === "reviewType") {
    return table.sort((a, b) => a["reviewType"] > b["reviewType"] ? 1 : (a["reviewType"] < b["reviewType"] ? -1 : 0));
  } else if (dropdownState === "user") {
    return table.sort((a, b) => {
      if (a["userId"] === null) {
        return 1;
      } else if (b["userId"] === null) {
        return -1;
      } else {
        return a["userInfo"] > b["userInfo"] ? 1 : (a["userInfo"] < b["userInfo"] ? -1 : 0)
      }
    });
  } else {
    throw new Error('Wrong dropdown state: ' + dropdownState);
  }
}

function enumerateTable(table) {
  let counter = 1;
  for (let row of table) {
    row["idx"] = counter;
    counter += 1;
  }
}

function DropDown({dropDownState, setDropDownState}) {
  function onSelectHandler(eventKey, obj) {
    setDropDownState(eventKey);
  }

  let namesMap = {
    "reviewId": "по времени написания",
    "reviewType": "по типу ревью",
    "user": "по пользователю"
  };

  return (
    <bootstrap.Dropdown onSelect={onSelectHandler}>

      <bootstrap.Dropdown.Toggle variant="primary" id="dropdown-basic">
        Сортировать {namesMap[dropDownState]}
      </bootstrap.Dropdown.Toggle>
      
      <bootstrap.Dropdown.Menu>
        {["reviewId", "reviewType", "user"].map((key) => {
          return (
            <bootstrap.Dropdown.Item eventKey={key}>{namesMap[key]}</bootstrap.Dropdown.Item>
          );
        })}
      </bootstrap.Dropdown.Menu>

    </bootstrap.Dropdown>
  );
}

export default function App() {
  const [dropDownState, setDropDownState] = useState('reviewId');
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetch('http://www.filltext.com/?rows=50&id={number|1000}&userId={number|15}&reviewText={lorem|32}&reviewType={number|1}&delay=5')
    .then((res) => res.json())
    .then((data) => setReviews(data));

    fetch('http://www.filltext.com/?rows=12&userId={number|12}&firstName={firstName}&lastName={lastName}')
    .then((res) => res.json())
    .then((data) => setUsers(data));
  }, [setReviews, setUsers]);

  const header = [ "idx", "Индекс ревью",
                   // "reviewId", "Review ID",
                   "reviewType", "Тип ревью",
                   "reviewText", "Текст ревью",
                   "userInfo", "Фамилия и имя пользователя"];

  let tbl = joinReviewsAndUsers(reviews, users);
  tbl = sortTable(tbl, dropDownState);
  enumerateTable(tbl);

  return (
    <bootstrap.Container>
        <bootstrap.Row>
          <DropDown dropDownState={dropDownState} setDropDownState={setDropDownState} />
        </bootstrap.Row>

        <bootstrap.Row>
          <Table header={header} content={tbl} />
        </bootstrap.Row>
    </bootstrap.Container>
  );
}