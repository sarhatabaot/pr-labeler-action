// Copyright (C) 2025 Omer Oreg
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
//     You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const yaml = require('js-yaml');

async function run() {
    try {
        // Get inputs
        const token = core.getInput('github-token');
        const prNumber = core.getInput('pr-number');
        const prBody = core.getInput('pr-body');

        // Read the configuration file
        const configPath = '.github/pr-labels.yml';
        if (!fs.existsSync(configPath)) {
            core.setFailed(`Configuration file not found: ${configPath}`);
            return;
        }

        const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
        if (!config.labels || !Array.isArray(config.labels)) {
            core.setFailed('Invalid configuration file: "labels" must be an array.');
            return;
        }

        // Initialize Octokit (GitHub API client)
        const octokit = github.getOctokit(token);

        // Determine which labels to add
        const labelsToAdd = config.labels
            .filter(label => prBody.includes(label.checkbox))
            .map(label => label.name);

        // Add labels to the PR
        if (labelsToAdd.length > 0) {
            await octokit.rest.issues.addLabels({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                issue_number: prNumber,
                labels: labelsToAdd,
            });
            core.info(`Added labels: ${labelsToAdd.join(', ')}`);
        } else {
            core.info('No labels to add.');
        }
    } catch (error) {
        core.setFailed(`Action failed: ${error.message}`);
    }
}

run();