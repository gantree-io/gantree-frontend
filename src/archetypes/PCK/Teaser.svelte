<script>
  import _ from "lodash";
  import Paper, { Title } from "@smui/paper";
  import { Icon } from "@smui/common";
  import Menu from "@smui/menu";
  import List, { Item, Text, Separator, Graphic } from "@smui/list";
  import IconButton, { Icon as IconButtonIcon } from "@smui/icon-button";
  import { open as OpenDrawer } from "@components/Drawer.svelte";
  import Badge from "@components/Badge.svelte";
  import Hotwire from "@components/Hotwire.svelte";
  import Pender from "@components/Pender.svelte";
  import { toast } from "@components/Toaster.svelte";
  import { dialog } from "@components/Dialog.svelte";
  import PCK, { fetchOneById, deregisterPck } from "./store.js";

  export let _id = null;
  export let name;
  export let pckrc;
  let menu;
  let menuAnchor;

</script>

<style lang="scss">
  // :global(.network-teaser.smui-paper) {
  //   * :global(.badge) {
  //     display: inline-flex;
  //     margin-left: 0.5em;

  //     :global(.value) {
  //       color: var(--color-dark);
  //     }

  //     :global(.label) {
  //       text-transform: uppercase;
  //       color: var(--color-grey);
  //     }
  //   }

 // }
</style>

<Paper
  class="pck-teaser"
  elevation="0"
  >
 
  <div class="title">
    <Icon
      class={`material-icons status`}
      >
      vpn_key
    </Icon>
    <Title>{name}</Title>
  </div>

  <div class="controls">
    <div class="info">
      {pckrc}
    </div>

    <div class="menu" bind:this={menuAnchor}>
      <IconButton on:click={() => menu.setOpen(true)}>
        <IconButtonIcon class="material-icons">menu</IconButtonIcon>
      </IconButton>
      <Menu
        bind:this={menu}
        bind:anchorElement={menuAnchor}
        anchorCorner="BOTTOM_LEFT">
        <List dense>
          <Item 
            on:click={() => {
              dialog.warning({
                title: "Confirm deletion",
                subtitle: `Removing this PCK will no longer allow you to .... [TODO]`,
                confirmButton: 'Delete PCK',
                onConfirm: () => PCK.query(deregisterPck, { _id: _id }).then(() => toast.warning(`PCK deleted`)),
                cancelButton: 'Take me back!',
                confirmWord: 'DELETE'
              })
            }}
            >
            <Graphic class="material-icons">delete</Graphic>
            <Text>Delete PCK</Text>
          </Item>
        </List>
      </Menu>
    </div>
  </div>
</Paper>