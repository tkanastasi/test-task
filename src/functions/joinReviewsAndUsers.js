export function joinReviewsAndUsers(reviews, users) {
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
