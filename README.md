# Checkbox Labeler

![GitHub](https://img.shields.io/github/license/sarhatabaot/pr-labeler-action?color=blue)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/sarhatabaot/pr-labeler-action)

A GitHub Action that allows users to add labels to pull requests (PRs) even if they don't have write access to the repository. Users can select labels by checking boxes in the PR description.

---

## Features

- **Checkbox-Based Labeling**: Users can add labels by checking boxes in the PR description.
- **Customizable Labels**: Define your own labels and checkboxes in a configuration file (`.github/checkbox-labels.yml`).
- **No Write Access Required**: Contributors without write access can still add labels.

---

## Usage

### 1. Add the Configuration File

Create a `.github/checkbox-labels.yml` file in your repository to define the labels and their corresponding checkboxes. For example:

```yaml
labels:
  - name: bug
    checkbox: "- [x] bug"
  - name: enhancement
    checkbox: "- [x] enhancement"
  - name: documentation
    checkbox: "- [x] documentation"
  - name: question
    checkbox: "- [x] question"
  - name: wontfix
    checkbox: "- [x] wontfix"
```

### 2. Add the PR Template

Create a .github/PULL_REQUEST_TEMPLATE.md file to include checkboxes in the PR description. For example:

```markdown
### Description
Please describe the purpose of this pull request.

### Labels
Select the appropriate labels for this PR:

- [ ] bug
- [ ] enhancement
- [ ] documentation
- [ ] question
- [ ] wontfix
```

### 3. Add the Workflow

Add the following workflow to your repository (e.g., .github/workflows/checkbox-labeler.yml):
```yml
name: Checkbox Labeler

on:
  pull_request:
    types: [opened, edited]

jobs:
  label-pr:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Run PR Labeler Action
        uses: your-username/pr-labeler-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          pr-number: ${{ github.event.pull_request.number }}
          pr-body: ${{ github.event.pull_request.body }}
```

### Example

When a contributor opens a PR with the following description:
```markdown
### Description
This PR fixes a bug in the login functionality.

### Labels
Select the appropriate labels for this PR:

- [x] bug
- [ ] enhancement
- [ ] documentation
- [ ] question
- [ ] wontfix
```
The action will automatically add the `bug` label to the PR.
