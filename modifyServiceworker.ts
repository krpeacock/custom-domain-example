import fs from "fs";
import { hostname } from "os";
import path from "path";

import prodCanisterIds from "./canister_ids.json";
import config from "./dfx.json";

const hostName = config.canisters.site.hostname;

const canisterId = prodCanisterIds.site.ic;
if (!canisterId) {
  console.error(
    "Site has not been deployed yet. Please deploy the canister to the IC before proceeding."
  );
  process.exit(1);
}

const pathName = path.join(
  __dirname,
  "ic",
  "typescript",
  "service-worker",
  "src",
  "sw",
  "http_request.ts"
);
const serviceworkerFile = fs.readFileSync(pathName);

if (!serviceworkerFile.toString().includes(hostName)) {
  const updated = serviceworkerFile.toString().replace(
    `'identity.ic0.app': ['rdmx6-jaaaa-aaaaa-aaadq-cai', 'ic0.app'],`,
    `'identity.ic0.app': ['rdmx6-jaaaa-aaaaa-aaadq-cai', 'ic0.app'],
  '${hostName}': ['${canisterId}', 'ic0.app'],`
  );

  fs.writeFileSync(pathName, updated);
  console.log("succesfully updated serviceworker!");
} else {
  console.log("Serviecworker was already updated");
}
