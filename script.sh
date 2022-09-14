git clone https://github.com/dfinity/ic
npx ts-node modifyServiceworker.ts
pushd ic/typescript/service-worker
npm install
npm run build

pushd

cp -r ic/typescript/service-worker/dist-prod/ serviceworker/
