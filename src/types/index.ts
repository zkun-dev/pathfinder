export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  projects: Project[];
  socialLinks: SocialLink[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
}

export interface SocialLink {
  name: string;
  icon: string;
  url: string;
}

export interface NavItem {
  label: string;
  href: string;
}
