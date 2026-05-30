import { defineConfig } from '@trigger.dev/sdk/v3'

export default defineConfig({
  project: process.env.TRIGGER_PROJECT_ID ?? 'your-project-id',
  runtime: 'node',
  dirs: ['./triggers'],
})
