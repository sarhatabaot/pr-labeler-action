// __tests__/labeler.test.js
const { run } = require('../index');

describe('Checkbox Labeler', () => {
    test('should add labels based on checkboxes', async () => {
        const prBody = `
      ### Description
      Test PR.

      ### Labels
      Select the appropriate labels for this PR:

      - [x] bug
      - [ ] enhancement
    `;

        // Mock GitHub API calls
        const mockAddLabels = jest.fn();
        jest.mock('@actions/github', () => ({
            getOctokit: () => ({
                rest: {
                    issues: {
                        addLabels: mockAddLabels,
                    },
                },
            }),
        }));

        // Run the action
        await run();

        // Verify the expected labels were added
        expect(mockAddLabels).toHaveBeenCalledWith({
            owner: 'sarhatabaot',
            repo: 'checkbox-labeler',
            issue_number: 1,
            labels: ['bug'],
        });
    });
});