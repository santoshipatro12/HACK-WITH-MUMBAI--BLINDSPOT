import { StartupInput, Competitor } from '../types';

const competitorDatabase: Record<string, Competitor[]> = {
  saas: [
    { name: 'Notion', description: 'All-in-one workspace for notes, docs, and collaboration', threat: 'high' },
    { name: 'Airtable', description: 'Flexible database and project management', threat: 'high' },
    { name: 'Monday.com', description: 'Work OS for team collaboration', threat: 'medium' },
    { name: 'Slack', description: 'Business communication platform', threat: 'medium' },
  ],
  app: [
    { name: 'Existing Mobile Apps', description: 'Established apps with loyal user bases', threat: 'high' },
    { name: 'Super Apps', description: 'WeChat, Grab, Gojek that bundle services', threat: 'high' },
    { name: 'Progressive Web Apps', description: 'Web apps that work like native', threat: 'medium' },
  ],
  web: [
    { name: 'Google Suite', description: 'Docs, Sheets, Slides - free and integrated', threat: 'high' },
    { name: 'Microsoft 365', description: 'Enterprise productivity suite', threat: 'high' },
    { name: 'Canva', description: 'Design and content creation platform', threat: 'medium' },
  ],
  api: [
    { name: 'Twilio', description: 'Communication APIs', threat: 'high' },
    { name: 'Stripe', description: 'Payment processing APIs', threat: 'high' },
    { name: 'OpenAI API', description: 'AI and ML APIs', threat: 'high' },
    { name: 'AWS Services', description: 'Amazon Web Services APIs', threat: 'medium' },
  ],
};

const industryCompetitors: Record<string, Competitor[]> = {
  fintech: [
    { name: 'Stripe', description: 'Payment infrastructure', threat: 'high' },
    { name: 'PayPal', description: 'Digital payments', threat: 'high' },
    { name: 'Square', description: 'Financial services platform', threat: 'high' },
    { name: 'Plaid', description: 'Financial data APIs', threat: 'medium' },
    { name: 'Traditional Banks', description: 'Launching digital products', threat: 'medium' },
  ],
  healthtech: [
    { name: 'Epic Systems', description: 'Healthcare software', threat: 'high' },
    { name: 'Teladoc', description: 'Telehealth platform', threat: 'high' },
    { name: 'MyFitnessPal', description: 'Health tracking app', threat: 'medium' },
    { name: 'Hospital Systems', description: 'In-house digital solutions', threat: 'medium' },
  ],
  edtech: [
    { name: 'Coursera', description: 'Online learning platform', threat: 'high' },
    { name: 'Udemy', description: 'Course marketplace', threat: 'high' },
    { name: 'Khan Academy', description: 'Free educational content', threat: 'high' },
    { name: 'Duolingo', description: 'Language learning app', threat: 'medium' },
  ],
  ecommerce: [
    { name: 'Amazon', description: 'Everything store', threat: 'high' },
    { name: 'Shopify', description: 'E-commerce platform', threat: 'high' },
    { name: 'Alibaba', description: 'B2B and B2C marketplace', threat: 'high' },
    { name: 'Local Retailers', description: 'Going digital rapidly', threat: 'medium' },
  ],
  marketplace: [
    { name: 'Uber', description: 'Ride-hailing and delivery', threat: 'high' },
    { name: 'Airbnb', description: 'Accommodation marketplace', threat: 'high' },
    { name: 'Facebook Marketplace', description: 'Social commerce', threat: 'high' },
    { name: 'Craigslist', description: 'Classifieds platform', threat: 'medium' },
  ],
  social: [
    { name: 'Instagram', description: 'Photo and video sharing', threat: 'high' },
    { name: 'TikTok', description: 'Short-form video', threat: 'high' },
    { name: 'Twitter/X', description: 'Microblogging and news', threat: 'high' },
    { name: 'Discord', description: 'Community platform', threat: 'medium' },
    { name: 'LinkedIn', description: 'Professional networking', threat: 'medium' },
  ],
  productivity: [
    { name: 'Notion', description: 'All-in-one workspace', threat: 'high' },
    { name: 'Trello', description: 'Visual project management', threat: 'high' },
    { name: 'Asana', description: 'Work management platform', threat: 'high' },
    { name: 'Todoist', description: 'Task management', threat: 'medium' },
  ],
  ai: [
    { name: 'OpenAI/ChatGPT', description: 'AI assistants and APIs', threat: 'high' },
    { name: 'Google AI', description: 'Bard and ML tools', threat: 'high' },
    { name: 'Microsoft Copilot', description: 'AI integration across products', threat: 'high' },
    { name: 'Anthropic', description: 'Claude AI assistant', threat: 'medium' },
  ],
};

const hiddenCompetitors: Competitor[] = [
  { name: 'Excel/Google Sheets', description: 'The most dangerous competitor - people just use spreadsheets', threat: 'high' },
  { name: 'Email + Manual Process', description: 'Companies often stick with what works', threat: 'medium' },
  { name: 'WhatsApp Groups', description: 'Informal but effective coordination', threat: 'medium' },
  { name: 'Doing Nothing', description: 'Status quo is always a competitor', threat: 'high' },
];

export function findCompetitors(input: StartupInput): Competitor[] {
  const competitors: Competitor[] = [];

  // Add platform-based competitors
  const platformComps = competitorDatabase[input.platform] || [];
  competitors.push(...platformComps.slice(0, 2));

  // Add industry-based competitors
  const industryComps = industryCompetitors[input.industry] || [];
  competitors.push(...industryComps.slice(0, 3));

  // Always add some hidden competitors
  competitors.push(...hiddenCompetitors.slice(0, 2));

  // Remove duplicates and return
  const unique = competitors.filter((comp, index, self) =>
    index === self.findIndex(c => c.name === comp.name)
  );

  return unique.slice(0, 7);
}
