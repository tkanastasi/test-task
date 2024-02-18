import './App.scss';
import { useState, useEffect } from 'react';
import * as bootstrap from 'react-bootstrap';

let DataIsFetched = false;

const DropDownInfo = {
  "reviewId" : ["по времени написания", createFieldComparator("reviewId")],
  "reviewType" : ["по типу ревью", createFieldComparator("reviewType")],
  "userInfo" : ["по пользователю", createLexicOrder(createFieldComparator("userNotFound"), createFieldComparator("userInfo"))]
};

function Table({ header, content, evalTrKey }) {
  const headerNames = Array.from(header.values());
  const accessKeys = Array.from(header.keys());

  const evalTrKeyFunc = evalTrKey === undefined ? ((_, index) => index) : evalTrKey;

  return (
    <bootstrap.Table striped bordered hover>
      <thead>
        <tr>
          {headerNames.map((fieldName) => <th key={fieldName}>{fieldName}</th>)}
        </tr>
      </thead>
      <tbody>
        {content.map((obj, index) => (
          <tr key={evalTrKeyFunc(obj, index)}>
            {accessKeys.map((key) => <td key={key}>{obj[key]}</td>)}
          </tr>
        ))}
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

function createBasicComparator(order='asc') {
  if (order === 'asc') {
    return (a, b) => a > b ? 1 : a < b ? -1 : 0;
  } else if (order === 'desc') {
    return (a, b) => a > b ? -1 : a < b ? 1 : 0;
  }
}

function createLexicOrder(comp1, comp2) {
  return (a, b) => {
    let v = comp1(a, b);
    return v === 0 ? comp2(a, b) : v
  }
}

function createFieldComparator(fieldName, order='asc') {
  let base = createBasicComparator(order);
  return (a, b) => base(a[fieldName], b[fieldName])
}

function DropDown({dropDownState, setDropDownState}){
  function onSelectHandler(eventKey, obj) {
    setDropDownState(eventKey);
  }

  return (
    <bootstrap.Dropdown onSelect={onSelectHandler}>
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

export default function App() {
  const [dropDownState, setDropDownState] = useState("reviewId");
  const [reviews, setReviews] = useState(null);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const reviewsUri = 'http://www.filltext.com/?rows=50&id={number|1000}&userId={number|15}&reviewText={lorem|32}&reviewType={number|1}&delay=5';
    const usersUri = 'http://www.filltext.com/?rows=12&userId={number|12}&firstName={firstName}&lastName={lastName}';

    const fetchData = async (uri) => {
      let res = await fetch(uri);
      let data = await res.json();
      return data;
    };
   
    Promise.all([reviewsUri, usersUri].map(fetchData))
    .then((data) => {
      const [reviews, users] = data;
      if (DataIsFetched) {
        return;
      }
      setReviews(reviews);
      setUsers(users);
      DataIsFetched = true;
    });
  }, []);

  const header = new Map ([
    ["lineNumber", "Индекс ревью"],
    ["reviewId", "Review ID"],
    ["reviewType", "Тип ревью"],
    ["reviewText", "Текст ревью"],
    ["userInfo", "Фамилия и имя пользователя"]
  ]);

  let tbl = null;
  if (users != null && reviews != null) {
    tbl = joinReviewsAndUsers(reviews, users)
      .map((row, idx) => Object.assign({}, row, 
          { uniqueIdx: idx, 
            userNotFound: row["userId"] === null ? true : false}))
      .sort(DropDownInfo[dropDownState][1])
      .map((row, index) => Object.assign({}, row, {lineNumber: index}))
  }

  return (
    <bootstrap.Container>
      {(tbl === null) ? 
        ( <bootstrap.Row>
            <bootstrap.Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </bootstrap.Spinner>
          </bootstrap.Row> ) : 
        ( <>
          <bootstrap.Row>
            <DropDown dropDownState={dropDownState} setDropDownState={setDropDownState} />
          </bootstrap.Row>

          <bootstrap.Row>
            <Table header={header} content={tbl} evalTrKey={(row, _) => row["uniqueIdx"]} />
          </bootstrap.Row>
          </>
        )
      }
    </bootstrap.Container>
  );
}