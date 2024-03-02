import { useState, useEffect } from 'react';
import * as bootstrap from 'react-bootstrap';

import { DropDown } from './components/DropDown';
import { Table } from './components/Table';
import { joinReviewsAndUsers } from './functions/joinReviewsAndUsers';
import { createLexicOrder } from './functions/createLexicOrder';
import { createFieldComparator } from './functions/createFieldComparator';

import './assets/styles/App.scss';

export const DROPDOWN_INFO = {
  reviewId : ["по времени написания", createFieldComparator("reviewId")],
  reviewType : ["по типу ревью", createFieldComparator("reviewType")],
  userInfo : ["по пользователю", createLexicOrder(createFieldComparator("userNotFound"), createFieldComparator("userInfo"))]
};

export const TABLE_INFO = {
  lineNumber: "Индекс ревью",
  // reviewId: "Review ID",
  reviewType: "Тип ревью",
  reviewText: "Текст ревью",
  userInfo: "Фамилия и имя пользователя"
};

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
    .then(([reviewsData, usersData]) => {
      setReviews(reviewsData);
      setUsers(usersData);
    });
  }, []);

  let tbl = null;
  if (reviews && users) {
    tbl = joinReviewsAndUsers(reviews, users)
      .map((row, idx) => ({
        ...row,
        uniqueIdx: idx,
        userNotFound: row.userId === null
      }))
      .sort(DROPDOWN_INFO[dropDownState][1])
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