import './App.scss';
import { useState, useEffect } from 'react';
import * as bootstrap from 'react-bootstrap';

let DataIsFetched = false;

const DropDownInfo = {
  "reviewId" : ["по времени написания", createFieldComparator("reviewId")],
  "reviewType" : ["по типу ревью", createFieldComparator("reviewType")],
  "userInfo" : ["по пользователю", createLexicOrder(createFieldComparator("userNotFound"), createFieldComparator("userInfo"))]
};

const TableInfo = {
  lineNumber: "Индекс ревью",
  // reviewId: "Review ID",
  reviewType: "Тип ревью",
  reviewText: "Текст ревью",
  userInfo: "Фамилия и имя пользователя"
};

function Table({ content, evalTrKey }) {
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

function joinReviewsAndUsers(reviews, users) {
  const getReviewTypeDescription = rtype => rtype === 1 ? "положительное" : "отрицательное";

  const idToUserNameMap = new Map(users.map(user => [
    user["userId"],
    `${user["lastName"]} ${user["firstName"]}`
  ]));

  return reviews.map(review => ({
    "reviewId": review["id"],
    "reviewType": getReviewTypeDescription(review["reviewType"]),
    "reviewText": review["reviewText"],
    "userInfo": idToUserNameMap.has(review["userId"]) ? idToUserNameMap.get(review["userId"]) : "Пользователь не найден",
    "userId": idToUserNameMap.has(review["userId"]) ? review["userId"] : null
  }));
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
    return v === 0 ? comp2(a, b) : v;
  }
}

function createFieldComparator(fieldName, order='asc') {
  let base = createBasicComparator(order);
  return (a, b) => base(a[fieldName], b[fieldName]);
}

function DropDown({dropDownState, setDropDownState}) {
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

  let tbl = null;
  if (users && reviews) {
    tbl = joinReviewsAndUsers(reviews, users)
      .map((row, idx) => ({
        ...row,
        uniqueIdx: idx,
        userNotFound: row.userId === null
      }))
      .sort(DropDownInfo[dropDownState][1])
      .map((row, idx) => ({
        ...row,
        lineNumber: idx
      }));
  }

  return (
    <bootstrap.Container>
      {(tbl === null) ? 
        ( <bootstrap.Row className="spinner-container">
            <bootstrap.Spinner className="spinner-border" animation="border" role="status"/>
          </bootstrap.Row> 
        ) : 
        ( <>
          <bootstrap.Row>
            <DropDown dropDownState={dropDownState} setDropDownState={setDropDownState}/>
          </bootstrap.Row>

          <bootstrap.Row>
            <Table content={tbl} evalTrKey={(row) => row["uniqueIdx"]}/>
          </bootstrap.Row>
          </>
        )
      }
    </bootstrap.Container>
  );
}