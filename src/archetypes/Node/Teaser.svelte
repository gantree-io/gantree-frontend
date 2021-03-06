<script>
  import { onMount } from "svelte";
  import { writable, get } from "svelte/store";
  import copy from "copy-to-clipboard";
  import _ from "lodash";
  import moment from "moment";
  import Paper, { Title, Subtitle, Content } from "@smui/paper";
  import Menu from "@smui/menu";
  import List, { Item, Text, Separator, Graphic } from "@smui/list";
  import IconButton, { Icon as IconButtonIcon } from "@smui/icon-button";
  import { Icon } from "@smui/common";
  import Badge from "@components/Badge.svelte";
  import Hotwire from "@components/Hotwire.svelte";
  import Tooltip from "@components/Tooltip.svelte";
  import Expanda from "@components/Expanda.svelte";
  import Elapsed from "@components/Elapsed.svelte";
  import NodeStats from "./Stats.svelte";
  import Telemetry from "@util/telemetry";
  import Node, { Status, deleteOne } from "./store";

  export let _id;
  export let instance;
  export let clientId;
  export let status;
  // export let provider;
  // export let validator;

  let { ip } = instance;

  // let updated = moment();
  let tick = false;
  let menu;
  let menuAnchor;
  let copied = false;
  let statusProps = Status["DEPLOYING"];
  let telemetry;
  let BlockNumber;
  let NodeData;

  const updateNodeProps = (props) => {
    clientId = props.clientId;
    ip = props.instance.ip;
    provider = props.provider;
    status = props.status;
    validator = props.validator;
    statusProps = Status[props.status];
  };

  const copyIp = () => {
    copy(ip);
    copied = true;
    setTimeout(() => (copied = false), 1500);
  };

  const deleteNode = async (_id) => {
    await Node.query(deleteOne, { _id: _id });
  };

  onMount(() => {
    statusProps = Status[status];

    // telemetry = new Telemetry(ip);
    // telemetry.listen("AddedChain", ({ ChainLabel }) => {
    //   telemetry.subscribe(ChainLabel);
    // });
    // telemetry.listen("FinalizedBlock", data => {
    //   BlockNumber = data.BlockNumber;
    //   updated = moment();
    //   tick = !tick;
    // });

    // telemetry.listen("AddedNode", data => (NodeData = data));

    // return () => telemetry.close();
  });
</script>

<style lang="scss">
  @keyframes tick0 {
    0% {
      color: var(--color-status-success);
    }
    100% {
      color: var(--color-status-warning);
    }
  }

  @keyframes tick1 {
    0% {
      color: var(--color-status-success);
    }
    100% {
      color: var(--color-status-warning);
    }
  }

  :global(.node-teaser.smui-paper) {
    border-left: 4px solid var(--color-status-neutral);
    cursor: auto;
    flex-wrap: wrap;

    .controls {
      .info {
        margin-right: 1em;

        > span.-block,
        > span.-updated {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          line-height: 1.3em;
          font-weight: 100;
        }

        :global(.material-icons.-loading) {
          font-size: 1em;
          opacity: 0.5;
        }

        /* animation */
        &[data-tick="true"] > span.-updated,
        &[data-tick="false"] > span.-updated {
          animation-duration: 10000ms;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
        &[data-tick="true"] > span.-updated {
          animation-name: tick0;
        }
        &[data-tick="false"] > span.-updated {
          animation-name: tick1;
        }

        /* just the tip color */
        > :global(.tooltip > .tip) {
          background: var(--color-theme-mid);
        }
        > :global(.tooltip > .tip:after) {
          border-top-color: var(--color-theme-mid);
        }
      }
    }

    > :global(.expanda.-telemetry) {
      width: 100%;

      :global(.trigger) {
        font-size: var(--font-size-xsmall);
        opacity: 0.5;
        text-transform: uppercase;
        height: 0;
        transform: translateY(0.7em);
      }
    }

    /* status colours */
    &[data-status="configuring"],
    &[data-status="shutdown"] {
      > .title :global(.material-icons.status) {
        opacity: 0.6;
        filter: saturate(40%);
        animation-name: spin;
        animation-duration: 3000ms;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
      }
    }
    &[data-status="deploying"],
    &[data-status="shutdown"] {
      opacity: 0.8;
      filter: saturate(70%);
      pointer-events: none;
      cursor: not-allowed;
    }
  }

  .info {
    text-align: right;
    display: flex;
    align-items: center;
  }
</style>

<Hotwire
  subscriptions={[{ name: _id, event: `UPDATE`, callback: updateNodeProps }]}>
  <Paper
    class="node-teaser"
    data-status={status.toLowerCase()}
    style={`border-left-color: var(--color-status-${statusProps.color})`}
    elevation="0">
    <div class="title">
      <Icon
        class={`material-icons status`}
        style={`color: var(--color-status-${statusProps.color})`}>
        {statusProps.icon}
      </Icon>
      {#if clientId}
        <Title>{clientId}</Title>
      {/if}
    </div>

    <div class="controls">
      <div class="info" data-tick={tick}>
        <Tooltip text={copied ? 'Copied' : 'Click to copy'} position={'top'}>
          <span class="mdc-typography--caption -ip" on:click={copyIp}>
            IP: {ip}
          </span>
        </Tooltip>
        <!-- <span class="mdc-typography--caption -block">
          Current Block:
          {#if BlockNumber}
            {BlockNumber}
          {:else}
            <Icon class={`material-icons -loading`}>autorenew</Icon>
          {/if}
        </span> -->
        <!-- <span class="mdc-typography--caption -updated">
          Last Checkin:
          <Elapsed anchor={updated} />
        </span> -->

        <!-- <span class="mdc-typography--caption -updated">Last Updated: {updated}</span> -->
      </div>

      <!-- FIXME: add a note to the user to stop GNW on the node or implement a way on back-end to securely
        tell the GNW server to shut itself down whilst still conforming to the pull model -->
      <div class="menu" bind:this={menuAnchor}>
        <IconButton on:click={() => menu.setOpen(true)}>
          <IconButtonIcon class="material-icons">menu</IconButtonIcon>
        </IconButton>
        <Menu
          bind:this={menu}
          bind:anchorElement={menuAnchor}
          anchorCorner="BOTTOM_LEFT">
          <List dense>
            <Item on:click={() => deleteNode(_id)}>
              <Graphic class="material-icons">delete</Graphic>
              <Text>Delete node</Text>
            </Item>
          </List>
        </Menu>
      </div>
    </div>

    <!-- <Expanda
      class="-telemetry"
      openTrigger={{ text: 'Show telemetry', icon: 'expand_more' }}
      closeTrigger={{ text: 'Hide telemetry', icon: 'expand_less' }}>
      <NodeStats {ip} />
    </Expanda> -->
  </Paper>
</Hotwire>
