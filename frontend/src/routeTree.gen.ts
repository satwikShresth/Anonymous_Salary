/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as TableImport } from './routes/table'
import { Route as FormImport } from './routes/form'

// Create/Update Routes

const TableRoute = TableImport.update({
  path: '/table',
  getParentRoute: () => rootRoute,
} as any)

const FormRoute = FormImport.update({
  path: '/form',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/form': {
      preLoaderRoute: typeof FormImport
      parentRoute: typeof rootRoute
    }
    '/table': {
      preLoaderRoute: typeof TableImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([FormRoute, TableRoute])

/* prettier-ignore-end */
