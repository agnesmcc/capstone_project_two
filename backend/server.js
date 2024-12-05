"use strict";

const app = require("./app");
const { PORT, JOB_QUEUE } = require("./config");
const { boss } = require('./pgBoss');

boss.start();

boss.createQueue(JOB_QUEUE);

boss.work(JOB_QUEUE, async ([job]) => {
  console.log('processing job', job.id);
  const Listing = require('./models/listing');
  const res = await Listing.getListing(job.data.listingId);
  console.log(res);
})

app.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});
