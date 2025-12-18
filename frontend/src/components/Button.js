import React from 'react'
import { Button, Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { Link } from 'react-router-dom';
import './Button.css'
const options = [
  { key: 'gene',  text: 'Gene', value: 'gene', as: Link, to: '/Gene' },
  { key: 'protein', text: 'Protein', value: 'protein', as: Link, to: '/Protein' },
  { key: 'miRNA', text: 'miRNA', value: 'miRNA', as: Link, to: '/miRNA' },
  { key: 'lipid', text: 'Lipid', value: 'lipid', as: Link, to: '/Lipid' },
]

const optionsCancerType = [
  { key: 'lung',  text: 'Lung', value: 'lung', as: Link, to: '/Lung' },
  { key: 'breast', text: 'Breast', value: 'breast', as: Link, to: '/Breast' },
  { key: 'colon', text: 'Colon', value: 'colon', as: Link, to: '/Colon' },
]

export const CancerType = () => (
  <Button.Group color='teal'>
    <Button >Browse Cancer Type</Button>

    <Dropdown
      className='button icon'
      floating
      options={optionsCancerType}
      trigger={<></>}
    />
  </Button.Group>
)

export const Content = () => (
  <Button.Group color='teal'>
    <Button >Browse Content Type</Button>
    <Dropdown
      className='button icon'
      floating
      options={options}
      trigger={<></>}
    />
  </Button.Group>
)