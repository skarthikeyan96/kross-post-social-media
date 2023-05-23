import * as core from '@actions/core'
import {Octokit} from '@octokit/core'
import * as github from '@actions/github'
import frontmatter from 'front-matter'
import http from 'http'

async function getFileContents(blogContent: any) {
  const content = await http.get(blogContent.raw_url)
  console.log(content)
  return ''
}
async function run(): Promise<void> {
  try {
    // get the pull request details
    const github_token = core.getInput('GITHUB_TOKEN')
    // const primary_source: 'dev.to' | 'hashnode' | string =
    //   core.getInput('PRIMARY_SOURCE') // defaults to dev.to
    const forem_api_key = core.getInput('DEV_TO_API_KEY')
    // const hashnode_api_key = core.getInput('HASHNODE_API_KEY')

    if (!forem_api_key || forem_api_key.length === 0) {
      core.setFailed('Please input the dev.to API key')
      return
    }

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

      // get the mdx files and contents

      const data = response.data.filter(file => {
        return file.filename.match(/\.*(md|mdx)$/gim)
      })

      // loop over the files

      for (let index = 0; index < data.length; index++) {
        const blogContent = data[index]

        // parse the markdown and get the front matter and the content

        const content = getFileContents(blogContent)

        console.log(content)
      }
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
