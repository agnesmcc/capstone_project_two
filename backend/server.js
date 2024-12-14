"use strict";

const app = require("./app");
const { PORT, JOB_QUEUE, FAKE_DATA_QUEUE } = require("./config");
const { boss } = require('./pgBoss');

boss.start();
boss.createQueue(JOB_QUEUE);
boss.createQueue(FAKE_DATA_QUEUE);

boss.schedule(FAKE_DATA_QUEUE, `*/5 * * * *`, null)

boss.work(JOB_QUEUE, async ([job]) => {
  console.log('processing job', job.id);
  const Listing = require('./models/listing');
  const result = await Listing.determineWinner(job.data.listingId);
  let msg = `Listing ${result.id} ended`;
  if (result.winner) msg += ` and was won by ${result.winner}`;
  console.log(msg);
})

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

app.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});
