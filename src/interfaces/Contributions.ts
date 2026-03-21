export interface ContributionsCollection {
    totalCommitContributions: number
    restrictedContributionsCount: number
    contributionCalendar: ContributionCalendar
}

export interface ContributionDay {
    contributionCount: number
    date: string
}

export interface ContributionWeek {
    contributionDays: ContributionDay[]
}

export interface ContributionCalendar {
    totalContributions: number
    weeks: ContributionWeek[]
}

export interface ContributedRepositories {
    repositoriesContributedTo: number
}
