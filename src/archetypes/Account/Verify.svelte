<script>
  import { onMount } from 'svelte'
  import { push, querystring } from 'svelte-spa-router'
  import Centered from '@layouts/Centered.svelte'
  import Form, { Field, validate } from '@components/Form'
  import { toast } from '@components/Toaster.svelte'
  import Account, { AccountStatus } from '@archetypes/Account/store'
  import Button, { Label } from '@smui/button';
  import GantreeLogo from '@assets/GantreeLogo.svelte'

  const handleSubmit = async ({fields, hasErrors, errors, setLoading}) => {
    let _t = toast.loading(`Verifying your account...`)
    if(!hasErrors){
      setLoading(true)
      Account.verify(fields)
        .then(() => {
          setLoading(false)
          _t.success('Successfully verified')
          //push('/dashboard')
        })
        .catch(msg => {
          setLoading(false)
          _t.warning(msg)
        })
    }else{
      _t.warning(`Some fields have errors`)
    }
  }

  // if authenticated, push to dashboard
  Account.subscribe(({user}) => {
    if(user.status === AccountStatus.COMPLETE) push('/dashboard')
  })
</script>

<Centered
  icon='account_circle'
  title='Verify'
  subtitle='Awaiting account verification',
  copy='You should receive an email containing your verification code. Enter it below to verify your account.'
  >
  <span slot='header'>
    <GantreeLogo on:click={() => push('/')}/>
  </span>

  <Form
    onSubmit={handleSubmit}
    buttons={{
      submit: 'Verify Account',
    }}
    >
    <Field
      title='Your 6 digit code'
      required
      validation={{
        'Code must be 6 digits': value => validate.length(value, 6),
        'Code must be a number': validate.int
      }}
      input={{
        id: 'verificationCode',
        type: 'number',
      }}
    />
  </Form>
  <span slot="footer"><div/></span>
</Centered>