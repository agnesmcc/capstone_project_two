"use strict";

const app = require("./app");
const { PORT, JOB_QUEUE } = require("./config");
const { boss } = require('./pgBoss');

boss.start();
boss.createQueue(JOB_QUEUE);
boss.work(JOB_QUEUE, async ([job]) => {
  console.log('processing job', job.id);
  const Listing = require('./models/listing');
  const result = await Listing.determineWinner(job.data.listingId);
  let msg = `Listing ${result.id} ended`;
  if (result.winner) msg += ` and was won by ${result.winner}`;
  console.log(msg);
})

app.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});
