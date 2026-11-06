import rawData from './data.json'

export interface ProfileData {
  name: string
  title: string
  badge: string
  bio: string
  shortBio: string
  aboutPreview: string
  avatarUrl: string
  email: string
  links: {
    github: string
    linkedin: string
    youtube: string
    portfolio: string
  }
}

export interface SiteData {
  title: string
  tagline: string
  hero: {
    badge: string
    heading: string
    headingHighlight: string
    description: string
  }
  terminal: {
    user: string
    whoami: string
    interests: string[]
    status: string
  }
  contact: {
    badge: string
    title: string
    description: string
    youtubeHandle: string
  }
  footer: {
    description: string
    hostingBadge: string
  }
}

export interface SkillCategory {
  category: string
  items: string[]
}

export interface ExperienceItem {
  role: string
  company: string
  period: string
  description: string
}

export interface SiteContent {
  profile: ProfileData
  site: SiteData
  skills: SkillCategory[]
  experience: ExperienceItem[]
}

export const siteData: SiteContent = rawData
export default siteData
