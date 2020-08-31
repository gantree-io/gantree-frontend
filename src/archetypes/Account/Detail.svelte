<script>
  import { onMount } from 'svelte';
  import { pop, push } from 'svelte-spa-router'
  import Button, { Label, Icon } from '@smui/button';
  import PanelLayout from '@layouts/Panel.svelte'
  import Form, { Field } from '@components/Form'
  import AccountStore, { updateAccount } from '@archetypes/Account/store'

  import { toast } from '@components/Toaster.svelte'
  import { dialog } from '@components/Dialog.svelte'

  let name
  let email
  let subscribed

  const onSubmit = async ({fields, hasErrors, errors, setLoading}) => {
     let _t = toast.loading(`Updating your account...`)

     if(!hasErrors){
       setLoading(true)
       AccountStore.query(updateAccount, fields).then(data => {
        _t.success(`Details saved`)
        setLoading(false)
        //pop()
      }).catch( e => {
        _t.warning(e.message)
      })
     }else{
       _t.warning(`Some fields have errors`)
     }
  }
  
  onMount(async () => {
    AccountStore.subscribe(({user}) => {
      name = user.name
      subscribed = user.subscribed
    })
  })
</script>

<style lang="scss">
  :global(button.delete){
    position: absolute;
    bottom: 0.5em;
    left: 0;
    /*transform: translateX(-50%);*/
    font-weight: 400;

    :global(.mdc-button__label),
    :global(.mdc-button__icon){
      color: var(--color-status-error);
    }
  }
</style>

<PanelLayout 
  header={{
    title: 'Account Settings',
    subtitle: 'Update your account',
    actions: [
       {
        text: 'Delete my account',
        icon: 'delete',
        callback: () => dialog.warning({
          title: "Delete your account",
          subtitle: "You're about to delete your account. This cannot be undone.",
          confirmButton: 'Confirm Delete',
          onConfirm: () => toast.error(`Feature not yet enabled...`),
          cancelButton: 'back',
          confirmWord: 'DELETE'
        })
       }
     ]
  }}
  >
  <Form 
    onSubmit={onSubmit}
    buttons={{
      submit: 'Update Account',
    }}
    >
    <Field
      title='Your Name'
      required
      input={{
        id: 'name',
        type: 'text',
        placeholder: "JoeBloggs@example.com",
        value: name
      }}
    />

    <Field
      title='Send me product updates via email'
      required
      input={{
        id: 'subscribed',
        type: 'switch',
        value: subscribed,
        off: 'No',
        on: 'Yes'
      }}
    />
  </Form>
</PanelLayout>