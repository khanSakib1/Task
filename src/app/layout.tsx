"use client";

import '../styles/globals.css'
import React from 'react'
import { Provider } from 'react-redux'
import store from '../store'
import { CssBaseline, Container } from '@mui/material'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <CssBaseline />
          <Container className="container">
            {children}
          </Container>
        </Provider>
      </body>
    </html>
  )
}
