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
  if (comments.length === 0) return [];
  const items = comments.map(item => {
    let newComments = { ...item };
    newComments.author = newComments.created_by;
    delete newComments.created_by;
    newComments.created_at = new Date(newComments.created_at);
    newComments.article_id = articleRef[newComments.belongs_to];
    delete newComments.belongs_to;
    return newComments;
  });
  return items;
};
