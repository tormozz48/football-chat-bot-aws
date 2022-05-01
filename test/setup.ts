module.exports = async () => {
  process.env.IS_OFFLINE = 'true';
  process.env.EVENTS_TABLE = 'events-table-dev';
};
