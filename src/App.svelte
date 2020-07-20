<script>
  import { get } from "svelte/store";
  import ApolloClient from "apollo-boost";
  import _ from "lodash";
  import { parse } from "qs";
  import { configure as configureGraphQL } from "@util/graphql";
  import {
    configure as configureHotwire,
    subscribe as hotwireSubscribe
  } from "@components/Hotwire.svelte";
  import AuthRouter, {
    configure as configureAuthRouter,
    triggerError,
    location,
    push,
    querystring
  } from "@components/AuthRouter.svelte";
  import Account, {
    AuthStatus,
    AccountStatus
  } from "@archetypes/Account/store";

  // ---> global components
  import Drawer from "@components/Drawer.svelte";
  import Modal from "@components/Modal.svelte";
  import Toaster, { toast } from "@components/Toaster.svelte";
  import Dialog from "@components/Dialog.svelte";

  // ---> routes
  import Home from "@routes/Home.svelte";
  import Dashboard from "@routes/Dashboard.svelte";
  import AccountAuthenticate from "@archetypes/Account/Authenticate.svelte";
  import AccountSetup from "@archetypes/Account/Setup.svelte";
  import AccountDetail from "@archetypes/Account/Detail.svelte";
  import AccountCreate from "@archetypes/Account/Create.svelte";
  import AccountVerify from "@archetypes/Account/Verify.svelte";
  import AccountLogin from "@archetypes/Account/Login.svelte";
  import Error404 from "@routes/Error404.svelte";
  import Error503 from "@routes/Error503.svelte";

  // configure graphql
  configureGraphQL({
    uri: _env.GRAPHQL_URL,
    token: () => _.get(get(Account), "user.tokens.auth"),
    onNetworkError: msg => triggerError(503),
    onGraphQLError: e => {
      if (e.code === "UNAUTHENTICATED") {
        if ($location === "/authenticate") {
          /// hmmm
        } else {
          push(`/authenticate`);
        }
      }
    }
  });

  // configure the router
  configureAuthRouter({
    errorRoutes: {
      404: Error404,
      503: Error503
    },
    onPrivateRoute: ({ location }) => {
      Account.subscribe(({ user, authStatus, accountStatus }) => {
        // if we're already on the authenticate path, do nothing
        if ($location === "/authenticate") {
        }
        // not authenticated? push to auth page
        else if (authStatus !== AuthStatus.AUTHENTICATED)
          push(`/authenticate?redirect=${$location}`);
        // account unverified
        else if (user.status === AccountStatus.UNVERIFIED)
          push(`/account/verify`);
        // account not complete? push to account/setup page
        else if (accountStatus === AccountStatus.INCOMPLETE)
          push(`/account/setup`);
      });
    }
  });

  // configure routes
  const routes = {
    public: {
      "/": Home,
      "/authenticate": AccountAuthenticate,
      "/login": AccountLogin,
      "/account/create": AccountCreate,
      "/account/verify": AccountVerify
    },
    private: {
      "/dashboard": Dashboard,
      "/dashboard/*": Dashboard,
      "/account": AccountDetail,
      "/account/setup": AccountSetup
    }
  };

  let _t;
  Account.configure({
    onAuthAttempt: () => {
      _t = toast.loading("... authenticating");
    },
    onAuthSuccess: user => {
      _t.success(`Logged in!`);

      // configure hotwire
      configureHotwire({
        prefix: user.team._id,
        url: _env.SOCKETIO_URL,
        onDisconnect: () =>
          toast.warning(
            `Hotwire disconnected: You are no longer receiving live updates from the server`
          ),
        onReconnect: () =>
          toast.success(
            `Hotwire reconnected: You are now receiving live updates from the server`
          )
      });

      // subscribe to updates on this user
      hotwireSubscribe(user._id, `UPDATE`, ({ name, subscribed }) =>
        Account.setUserPreferences(name, subscribed)
      );

      // redirect
      push(parse($querystring).redirect || "/dashboard");
    },
    onAuthFailure: () => {
      push("/");
      _t.error("Authentication failed!");
    },
    onSignout: () => {
      toast.success(`Logged out!`);
      push(`/`);
    }
  });
</script>

<style lang="scss">
  :root {
    /* base */
    --color-dark: #181729;
    --color-light: #fbfbfb;

    /* greyscale */
    --color-xdark-grey: #181729;
    --color-dark-grey: #252444;
    --color-grey: #6d7679;
    --color-light-grey: #cdceea;
    --color-xlight-grey: #f1eef5;

    /* colours */
    --color-mid-blue: #2196f3;
    --color-light-blue: #8bc2d4;
    --color-green: #4caf50;
    --color-orange: #ff9800;
    --color-red: #f44336;
    --color-blue: #40a8de;
    --color-yellow: #fadb14;
    --color-purple: #3d3b78;

    /* theme: https://coolors.co/0c0c19-1d1d3a-3d3b78-6d6bd9-7f7cff; */
    --color-theme-black: #02021d;
    --color-theme-xdark: #0c0c19;
    --color-theme-dark: #1d1d3a;
    --color-theme-mid: var(--color-purple);
    --color-theme-light: #6d6bd9;
    --color-theme-xlight: #7f7cff;
    --color-theme-white: #e9e9f5;
    --color-theme-highlight: #dcb764;

    /* highlights */
    --color-highlight: var(--color-light-purple);

    /* status colors */
    --color-status-success: var(--color-green);
    --color-status-warning: var(--color-orange);
    --color-status-error: var(--color-red);
    --color-status-notification: var(--color-mid-blue);
    --color-status-neutral: var(--color-light-grey);

    /* font sizes */
    --font-size-xxlarge: 3.1rem;
    --font-size-xlarge: 2.2rem;
    --font-size-large: 1.5rem;
    --font-size-medium: 1rem;
    --font-size-small: 0.9rem;
    --font-size-xsmall: 12px;
    --font-size-xxsmall: 11px;

    :global(.mdc-typography--body1) {
      font-weight: 300;
    }
  }

  :global(body) {
    color: var(--color-dark);
    background: var(--color-light);
    font-family: "Roboto", sans-serif;
    font-weight: 100;

    :global(strong) {
      font-weight: 500;
    }

    :global(*) {
      box-sizing: border-box;
    }
  }

  :global(.material-icons.-animation-spin) {
    animation-name: spin;
    animation-duration: 4000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  :global(.mdc-list .mdc-list-item__graphic),
  :global(.mdc-list.mdc-list--dense .mdc-list-item__graphic) {
    margin-right: 0.8em;
  }

  @keyframes -global-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes -global-pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.2;
    }
    100% {
      opacity: 1;
    }
  }

  /* scoped to body for heirarchy*/
  :global(body) {
    :global(.mdc-button.-minimal),
    :global(.mdc-button.mdc-button--dense) {
      color: var(--color-light);
      font-weight: 100;
      &:hover {
        color: var(--color-theme-highlight) !important;
      }
    }

    :global(.smui-paper) {
      background-color: var(--color-theme-dark);
      color: var(--color-theme-white);
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      margin-bottom: 0.6em;
      padding: 1.6rem;
      position: relative;
      z-index: 1;

      &:hover {
        z-index: 2;
      }

      :global(> *) {
        display: flex;

        &:first-child {
          align-items: flex-end;

          :global(.material-icons) {
            & + :global(.smui-paper__title) {
              margin: 0 0 0 0.5em;
            }
          }

          :global(.smui-paper__title) {
            display: flex;
            align-items: flex-end;
            line-height: 1em;
            margin: 0;
          }

          :global(.smui-paper__content) {
            font-size: var(--font-size-small);
            font-weight: 300;
            line-height: 1em;
            opacity: 0.9;
            margin: 0 1em;
            display: flex;
            align-items: flex-end;

            > :global(*) {
              line-height: 1em;
              margin-right: 0.4rem;
            }
          }
        }

        &:last-child {
          align-items: center;
        }
      }

      &:hover {
        background-color: var(--color-theme-xdark);
        box-shadow: none;
      }
    }

    :global(.material-icons.-animation-pulse) {
      animation-name: pulse;
      animation-duration: 1000ms;
      animation-iteration-count: infinite;
      animation-timing-function: ease;
    }

    :global(.material-icons.-animation-spin) {
      animation-name: spin;
      animation-duration: 3000ms;
      animation-iteration-count: infinite;
      animation-timing-function: ease;
    }

    :global(.material-icons.-loading) {
      animation-name: spin;
      animation-duration: 1500ms;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }

    :global(.inline-link) {
      color: var(--color-theme-light);
      font-weight: 400;
      cursor: pointer;
    }

    :global(*[class^="mdc-typography"]) {
      :global(.smaller) {
        font-size: var(--font-size-small);
      }
    }
  }
</style>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/icon?family=Material+Icons" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto+Mono" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Monda:wght@400&display=swap" />
  <link
    rel="stylesheet"
    href="https://unpkg.com/tachyons@4.12.0/css/tachyons.min.css" />
</svelte:head>
<AuthRouter {routes} />
<Drawer />
<Modal />
<Toaster />
<Dialog />
