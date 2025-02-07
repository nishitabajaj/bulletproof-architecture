import Agenda from 'agenda';
import config from '@/config';

export default ({ mongoConnection }) => {
  return new Agenda({
    mongo: mongoConnection,  // Pass the Mongo connection object directly
    db: { collection: config.agenda.dbCollection,
          address: config.databaseURL 
     },  // The collection name
    processEvery: config.agenda.pooltime,
    maxConcurrency: config.agenda.concurrency,
  });
};
