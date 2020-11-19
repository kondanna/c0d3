import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient } from '@apollo/client'
import App from './App'

const client = new ApolloClient({ uri: '/graphql' })

ReactDOM.render(<ApolloClient client={client}><App /></ApolloClient>, $root)