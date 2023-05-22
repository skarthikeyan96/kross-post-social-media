import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    // check if the "ready to publish" tag is present
    // if the tag is not present do not run the action
    // if the tag is present start the action
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
