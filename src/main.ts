import * as core from '@actions/core'
import {Octokit} from '@octokit/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    // get the pull request details
    const github_token = core.getInput('GITHUB_TOKEN')

    const octokit = new Octokit({
      auth: github_token
    })

    const {repo, owner, number} = github.context.issue
    try {
      const response = await octokit.request(
        'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
        {
          owner,
          repo,
          pull_number: number,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        }
      )

      console.log(response)
    } catch (err) {
      if (err instanceof Error) core.setFailed(err.message)
    }
    // get the markdown files
    // based on the api key provided make the social media request
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
