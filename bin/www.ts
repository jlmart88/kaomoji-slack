#!/usr/bin/env node
import Debug from "debug";
const debug = Debug("kaomoji-slack");
import app from "@/app";

app.set("port", process.env.PORT || 3000);

const server = app.listen(app.get("port"), function () {
  debug("Express server listening on port " + app.get("port"));
});
