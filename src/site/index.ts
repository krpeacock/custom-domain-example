import { AuthClient } from "@dfinity/auth-client";
import { renderIndex } from "./views";
import { renderLoggedIn } from ".//views/loggedIn";
import { canisterId, createActor } from "../declarations/whoami";
import { Actor, Identity } from "@dfinity/agent";

const init = async () => {
  const authClient = await AuthClient.create({
    /**
     * Configure the IdleManager
     * By default, after 10 minutes, invalidates the identity and logs out
     **/
    idleOptions: {
      disableIdle: true,
    },
  });

  const logout = async () => await authClient.logout();
  if (await authClient.isAuthenticated()) {
    handleAuthenticated(authClient);
  }
  renderIndex();
  setupToast();

  const loginButton = document.getElementById(
    "loginButton"
  ) as HTMLButtonElement;

  const days = BigInt(1);
  const hours = BigInt(24);
  const nanoseconds = BigInt(3600000000000);

  loginButton.onclick = () => {
    authClient.login({
      // Key for alternate URL - should be the canister
      derivationOrigin: "https://k6piv-oiaaa-aaaab-qag2q-cai.ic0.app",
      onSuccess: async () => {
        handleAuthenticated(authClient);
      },
      // Maximum authorization expiration is 8 days
      maxTimeToLive: days * hours * nanoseconds,
    });
  };
};

async function setupToast() {
  const header = document.getElementById("header");
  const status = document.getElementById("status");
  const content = document.getElementById("content");
  const closeButton = status?.querySelector("button");
  closeButton?.addEventListener("click", () => {
    status?.classList.add("hidden");
  });
}

async function handleAuthenticated(authClient: AuthClient) {
  const identity = (await authClient.getIdentity()) as unknown as Identity;
  const whoami_actor = createActor("ivcos-eqaaa-aaaab-qablq-cai", {
    agentOptions: {
      identity,
      host: "https://ic0.app",
    },
  });
  // Invalidate identity then render login when user goes idle
  authClient.idleManager?.registerCallback(() => {
    Actor.agentOf(whoami_actor)?.invalidateIdentity?.();
    renderIndex();
  });

  renderLoggedIn(whoami_actor, authClient);
}

init();
