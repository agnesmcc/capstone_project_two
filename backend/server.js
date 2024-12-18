"use strict";

const app = require("./app");
const { PORT, JOB_QUEUE, FAKE_DATA_QUEUE, PG_BOSS_ENABLED } = require("./config");
const { boss } = require('./pgBoss');

(async () => {
  try {
    console.log("Starting pgBoss...");
    await boss.start() 

    await boss.createQueue(JOB_QUEUE);
    await boss.createQueue(FAKE_DATA_QUEUE);

    if (PG_BOSS_ENABLED === true) {
      await boss.schedule(FAKE_DATA_QUEUE, `*/5 * * * *`, null)

      /**
       * This worker processes jobs from the 'listingsToEnd' queue. Each job
       * contains the listing id that should be ended. The jobs are added
       * when a new listing is created and are scheduled to run at the end_datetime
       * of the listing. When the listing ends a winner is determined if there is one.
       */
      boss.work(JOB_QUEUE, async ([job]) => {
        console.log('processing job', job.id);
        const Listing = require('./models/listing');
        const result = await Listing.determineWinner(job.data.listingId);
        let msg = `Listing ${result.id} ended`;
        if (result.winner) msg += ` and was won by ${result.winner}`;
        console.log(msg);
      })

      /**
       * This worker processes jobs from the 'fakeData' queue. Jobs contain
       * no data and are added on a cron schedule. When a job is processed
       * it creates a new listing for each user in the FAKE_USERS list.
       *
       * For each user, it fetches a random product from the fake store API
       * and uses that random product to populate data about the fake listing.
       */
      boss.work(FAKE_DATA_QUEUE, async ([job]) => {
        console.log('processing job', job.id);
        const { FAKE_USERS } = require('./config');
        const Listing = require('./models/listing');
        const { getRandomProduct } = require('./helpers/fakeStoreApi');
        console.log('creating fake listings');
        console.log(FAKE_USERS);
        for (let user of FAKE_USERS) {
          console.log(`creating listing for ${user}`);
          const product = await getRandomProduct();
          const result = await Listing.addListing(
            {
              created_by: user,
              title: product.title,
              description: product.description,
              image: product.image,
              category: product.category
            }
          )
          console.log(result);
        }
      })
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

app.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});
