exports.formatDates = list => {
  return list.map(item => {
    const newList = { ...item };
    const dateObject = new Date(newList.created_at);
    newList.created_at = dateObject;
    return newList;
  });
};

exports.makeRefObj = list => {
  const newRefObj = {};
  for (let i = 0; i < list.length; i++) {
    newRefObj[list[i].title] = list[i].article_id;
  }
  return newRefObj;
};

exports.formatComments = (comments, articleRef) => {
  return [];
};
