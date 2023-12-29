const returningId = async (dbPool, query) => {
  const result = await dbPool.query(query);
  if (!result.rowCount) {
    return null;
  }
  return result.rows[0].id;
};

module.exports = { returningId };
