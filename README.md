# Custom IC Domain Example

For this example, I'll be using Netlify. Important - this requires Node version 17 or higher for the serviceworker dependency!

To get started, install the Netlify CLI with `npm install netlify-cli -g`. 

Run the command `netlify init`, login (or sign up), and specify a team to use.

Configure your netlify site to use your hostname, or just use the auto-generated one they provide.


first, deploy your canister with 
`dfx deploy --network ic`.

Configure the new domain you will be using in dfx.json under <canister-name>.hostname

Then, run `script.sh` to build your custom serviceworker.

Finally, deploy your frontend with netlify deploy.
