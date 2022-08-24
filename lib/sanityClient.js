import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: 'rwh4h9zi',
  dataset: 'production',
  apiVersion: 'v1',
  token:
    'sknKGcWtvdDJtmNhD6rPBUhjiQJ6ywa1ICxmODhbnxMFZIQd30QAGXaNongV6tNeiILzjrxH5MI4tOmOC5wgv3cpeE8jqI2e2uNC9ggZVWvb6W3GyUPm8pzzPHlPTgdwzwA7yxoX9uLPp6d3KSztaotWmeSib4hmBUgWE0ZR0UqScMGufe68',
  useCdn: false,
})