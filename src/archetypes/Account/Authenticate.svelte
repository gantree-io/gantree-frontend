<script>
  import { push } from 'svelte-spa-router'
  import { Icon } from '@smui/common';
  import Centered from '@layouts/Centered.svelte'
  import GantreeLogo from '@assets/GantreeLogo.svelte'
  import AccountStore, { AuthStatus } from '@archetypes/Account/store'

  AccountStore.subscribe(({authStatus}) => {
    if(authStatus === AuthStatus.UNAUTHENTICATED) push('/')
  })
</script>

<style lang="scss">
  :global(.layout.-centered.-authenticate) {
    justify-content: center !important;

    :global(.children) > :global(.gantree-logo){
       margin: 0 0 0.5em 0;
    }
  }

  h1{
    margin: 0;
  }

  h2{
    margin: 0;
  }

  :global(.material-icons.thumb){
    font-size: 4em;
    margin: 0.3em 0
  }
</style>

<Centered class={'-authenticate'}>
  <GantreeLogo/>
  <h2 class='mdc-typography--headline5'>Authenticating</h2>
  <Icon class="material-icons thumb -animation-pulse">fingerprint</Icon>
  <p class="mdc-typography--body1">You will be redirected to <strong>Gantree</strong> once authenticated</p>
</Centered>