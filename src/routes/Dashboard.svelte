<script>
  import { afterUpdate } from "svelte";
  import AuthRouter from "@components/AuthRouter.svelte";
  import _ from "lodash";
  import Drawer, {
    AppContent,
    Content,
    Header,
    Title,
    Subtitle
  } from "@smui/drawer";
  import List, { Item, Text, Separator, Graphic } from "@smui/list";
  import { Icon } from "@smui/common";
  import Button from "@smui/button";
  import GantreeLogo from "@assets/GantreeLogo.svelte";

  import AccountMenu from "@archetypes/Account/Menu.svelte";

  // routes
  import NetworkIndex from "@archetypes/Network/Index.svelte";
  import ChainspecIndex from "@archetypes/Chainspec/Index.svelte";
  // import ProviderIndex from "@archetypes/Providers/Index.svelte";
  import TeamIndex from "@archetypes/Team/Index.svelte";
  import BillingPage from "@archetypes/Pages/Billing.svelte";
  import DocsPage from "@archetypes/Pages/Docs.svelte";
  import ApiKeysPage from "@archetypes/Pages/ApiKeys.svelte";

  let active = {};

  const routes = {
    private: {
      "/": NetworkIndex,
      "/chainspecs": ChainspecIndex,
      // "/providers": ProviderIndex,
      "/team": TeamIndex,
      "/billing": BillingPage,
      "/docs": DocsPage,
      "/keys": ApiKeysPage
    }
  };

  const tabs = [
    {
      name: "Networks",
      icon: "blur_on",
      href: "#/dashboard"
    },
    // {
    // 	name: 'Chainspecs',
    // 	icon: 'code',
    // 	href: '#/dashboard/chainspecs',
    // },
    // {
    // 	name: 'Providers',
    // 	icon: 'vpn_key',
    // 	href: '#/dashboard/providers'
    // },
    {
      name: "Team",
      icon: "people",
      href: "#/dashboard/team"
    },
    // {
    // 	name: 'Billing',
    // 	icon: 'receipt',
    // 	href: '#/dashboard/billing'
    // },
    {
      name: "Docs",
      icon: "menu_book",
      href:
        "https://www.notion.so/flexdapps/Gantree-Dashboard-Docs-0d0fd1d69f9f4270bc2d163586ddb64b",
      target: "_blank"
    },
    {
      name: "Contact Us",
      icon: "send",
      href:
        "https://www.notion.so/flexdapps/Get-In-Touch-a4e8c3461eed4cbe835b3e2f98ea0c69",
      target: "_blank"
    },
    {
      name: "API Keys",
      icon: "send",
      href: "/#/dashboard/keys"
    }
  ];

  afterUpdate(() => {
    // set the active path
    //active = _.find(tabs, {href: `#${$location}`})
  });
</script>

<style lang="scss">
  main {
    min-height: 100vh;
    display: flex;
    position: relative;
    display: flex;
    width: 100%;
    overflow: hidden;
    z-index: 0;
    justify-content: stretch;

    > :global(.mdc-drawer) {
      min-height: 100vh;
      position: relative;
      overflow: visible;
      background-color: var(--color-theme-dark);

      > :global(.mdc-drawer__header) {
        padding: 24px 16px 16px 16px;
      }

      :global(.mdc-list-divider) {
        border-bottom-color: rgba(255, 255, 255, 0.1);
      }

      > :global(.mdc-drawer__content > .mdc-list) {
        &.bottom {
          position: absolute;
          bottom: 0;
          width: 100%;
        }

        > :global(.quote) {
          padding: 2em;
          opacity: 0.5;
          font-size: var(--font-size-xsmall);
        }
      }

      :global(.mdc-list-item) {
        margin: 0;
        padding: 0 1.2em;
        border-radius: 0;

        > :global(.material-icons.chevron) {
          position: absolute;
          right: 0.6em;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.7;
          transition: right 0.15s ease-in-out;
          margin: 0;
        }

        &:hover > :global(.material-icons.chevron) {
          right: 0.4em;
        }
      }

      /* theme */
      :global(.mdc-list-item > *),
      :global(.mdc-drawer__header > *),
      :global(.quote),
      :global(.account-menu) {
        color: var(--color-theme-white);
      }
    }

    > :global(.mdc-drawer-app-content) {
      width: 100%;
    }
  }
</style>

<main>
  <Drawer>
    <Header>
      <GantreeLogo on:click={() => push('/')} />
    </Header>
    <Content>
      <Separator nav />
      <List>
        {#each tabs as tab}
          <Item target={tab.target || ''} href={tab.href || '#'}>
            <Graphic class="material-icons">{tab.icon}</Graphic>
            <Text>{tab.name}</Text>
            <Graphic class="material-icons chevron">chevron_right</Graphic>
          </Item>
        {/each}
      </List>
      <List class="bottom">
        <Separator nav />
        <AccountMenu />
      </List>
    </Content>
  </Drawer>

  <AppContent>
    <AuthRouter {routes} prefix="/dashboard" />
  </AppContent>
</main>
