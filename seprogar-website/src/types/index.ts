export interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  items: string[];
  gradient: string;
}


export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface NavLinkProps {
  href: string;
  label: string;
}
