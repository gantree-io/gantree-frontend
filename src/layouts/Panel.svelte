<script>
  import { fade } from "svelte/transition";
  import _ from "lodash";

  import Drawer, {
    AppContent,
    Content,
    Header,
    Title,
    Subtitle
  } from "@smui/drawer";
  import List, { Item, Text, Separator, Graphic } from "@smui/list";
  import IconButton, { Icon as IconButtonIcon } from "@smui/icon-button";
  import Menu from "@smui/menu";

  import { Icon } from "@smui/common";
  import Button from "@smui/button";
  import Breadcrumbs from "@components/Breadcrumbs.svelte";

  export let header;
  export let showBreadcrumbs = false;

  let menu;
  let menuAnchor;

  let hasHeaderSlot = !!_.get(arguments, "[1].$$slots.subtitle", false);
</script>

<style lang="scss">
  .layout-panel {
    background: var(--color-theme-white);
    overflow: hidden;
    width: auto;
    height: auto;
    display: block;
    padding: 0;
    display: flex;
    flex-direction: column;
    max-height: 100vh;

    > .header {
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left {
        padding: 1em 1em 1em 2em;
        display: block;

        :global(.breadcrumbs) {
          margin: 0 0 0.5em 0.4em;
          color: var(--color-theme-xdark);
        }

        .title {
          display: flex;
          align-items: flex-end;

          h1,
          p {
            margin: 0;
            display: inline-block;
          }

          h1 {
            font-weight: 100;
            display: flex;
            align-items: flex-end;
            line-height: 1em;

            > :global(.material-icons) {
              line-height: inherit;
              font-size: inherit;
              vertical-align: bottom;
            }

            > :global(.material-icons.titleicon) {
              margin-right: 0.2em;
            }
            > :global(.material-icons.-animation-spin) {
              opacity: 0.2;
            }
          }

          :global(.mdc-typography--body2.-subtitle) {
            font-weight: 100;
            opacity: 0.8;
            margin: 0 0.5em;
            display: block;
            //white-space: nowrap;
            //overflow: hidden;
            //text-overflow: ellipsis;

            :global(*[slot="subtitle"]) {
              display: block;
              //white-space: nowrap;
              //overflow: hidden;
              //text-overflow: ellipsis;
            }
          }
        }
      }

      .right {
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        align-self: stretch;

        :global(.info) {
          margin-right: 1em;
        }

        .menu {
          margin-right: 1em;
          :global(.mdc-icon-button) {
            opacity: 0.4;
            &:hover {
              opacity: 1;
            }
          }
        }
      }
    }

    > .body {
      padding: 1.5em 2em;
      height: 100vh;
      overflow: scroll;
    }
  }
</style>

<section class="layout-panel" transition:fade={{ delay: 0, duration: 150 }}>
  {#if header}
    <header class="header">
      <span class="left">
        {#if showBreadcrumbs}
          <Breadcrumbs />
        {/if}
        <div class="title">
          <h1 class="mdc-typography--headline4">
            {#if header.icon}
              <Icon class="material-icons titleicon">{header.icon}</Icon>
            {/if}
            <!-- {#if header.title} -->
            {header.title}
            <!-- {:else} -->
            <!-- <Icon class="material-icons -animation-spin">autorenew</Icon> -->
            <!-- {/if} -->
          </h1>

          {#if header.subtitle}
            <p class="mdc-typography--body2 -subtitle">// {header.subtitle}</p>
          {/if}

          <!-- Can also insert subtitle by slot -->
          {#if hasHeaderSlot}
            <p class="mdc-typography--body2 -subtitle">
              <slot name="subtitle" />
            </p>
          {/if}
        </div>
      </span>

      <span class="right">
        <span class="info">
          <slot name="info" />
        </span>

        {#if header.actions}
          <div class="menu" bind:this={menuAnchor}>
            <IconButton on:click={() => menu.setOpen(true)}>
              <IconButtonIcon class="material-icons">menu</IconButtonIcon>
            </IconButton>
            <Menu
              bind:this={menu}
              bind:anchorElement={menuAnchor}
              anchorCorner="BOTTOM_LEFT">
              <List dense>
                {#each header.actions || [] as action}
                  <Item
                    on:click={() => {
                      action.callback && action.callback();
                    }}>
                    <Graphic class="material-icons">{action.icon}</Graphic>
                    <Text>{action.text}</Text>
                  </Item>
                {/each}
              </List>
            </Menu>
          </div>
        {/if}
      </span>
    </header>
  {/if}

  <div class="body">
    <slot />
  </div>
</section>
