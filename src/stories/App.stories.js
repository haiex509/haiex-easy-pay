import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'

import { Payment } from '../index'

const stories = storiesOf('App Payment Modules', module)

stories.add('Payment', () => {
  return (
    <>
      <Payment
        amount={'10.5'}
        onLogged={data => {
          console.log(data)
        }}
        onDisconnected={data => {
          console.log(data)
        }}
        onPaid={data => {
          console.log(data)
        }}
      />
    </>
  )
})
