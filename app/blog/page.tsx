import { Navbar } from '@/components/navbar';
import Link from 'next/link';
import { Clock, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Blog - NotiRest | Notion API Tips & Tutorials',
  description: 'Read articles about building APIs with Notion, integrations, and best practices.',
};

const blogPosts = [
  {
    id: 'getting-started',
    title: 'Getting Started with NotiRest: Create Your First API in 5 Minutes',
    excerpt: 'Learn how to quickly set up your first REST API from a Notion database with NotiRest.',
    date: '2026-04-20',
    readTime: 5,
    category: 'Tutorial',
  },
  {
    id: 'rest-api-best-practices',
    title: 'REST API Best Practices: Design Patterns for Scalability',
    excerpt: 'Discover essential patterns and practices for building scalable REST APIs with NotiRest.',
    date: '2026-04-18',
    readTime: 8,
    category: 'Guide',
  },
  {
    id: 'notion-automation',
    title: 'Automating Your Workflows: Notion + NotiRest Integration',
    excerpt: 'Automate complex workflows by integrating NotiRest APIs into your tools and applications.',
    date: '2026-04-15',
    readTime: 6,
    category: 'Automation',
  },
  {
    id: 'api-security',
    title: 'Securing Your NotiRest APIs: Authentication & Authorization',
    excerpt: 'A comprehensive guide to implementing secure API key management and access control.',
    date: '2026-04-12',
    readTime: 10,
    category: 'Security',
  },
  {
    id: 'performance-optimization',
    title: 'Performance Optimization: Handling High-Traffic Notion APIs',
    excerpt: 'Learn caching strategies, rate limiting, and database optimization techniques.',
    date: '2026-04-10',
    readTime: 9,
    category: 'Performance',
  },
  {
    id: 'database-schema',
    title: 'Designing Effective Database Schemas for Your Notion APIs',
    excerpt: 'Best practices for structuring your Notion databases to maximize API efficiency.',
    date: '2026-04-08',
    readTime: 7,
    category: 'Design',
  },
  {
    id: 'error-handling',
    title: 'Robust Error Handling in REST APIs',
    excerpt: 'Implement proper error codes, logging, and recovery strategies in your NotiRest APIs.',
    date: '2026-04-05',
    readTime: 8,
    category: 'Development',
  },
  {
    id: 'testing-apis',
    title: 'Testing Your NotiRest APIs: Unit, Integration & E2E',
    excerpt: 'Comprehensive testing strategies to ensure your APIs work reliably in production.',
    date: '2026-04-01',
    readTime: 12,
    category: 'Testing',
  },
  {
    id: 'webhooks',
    title: 'Building Real-Time Apps with NotiRest Webhooks',
    excerpt: 'Implement webhooks to trigger events and build real-time integrations.',
    date: '2026-03-28',
    readTime: 9,
    category: 'Advanced',
  },
  {
    id: 'migration-guide',
    title: 'Migrating from Other API Platforms to NotiRest',
    excerpt: 'Step-by-step guide for migrating your existing APIs to NotiRest infrastructure.',
    date: '2026-03-25',
    readTime: 11,
    category: 'Migration',
  },
  {
    id: 'pagination',
    title: 'Implementing Pagination: Best Practices for Large Datasets',
    excerpt: 'Learn efficient pagination strategies for handling millions of database records.',
    date: '2026-03-22',
    readTime: 7,
    category: 'Technical',
  },
  {
    id: 'versioning',
    title: 'API Versioning Strategies for Long-Term Stability',
    excerpt: 'Maintain backward compatibility while evolving your APIs with effective versioning.',
    date: '2026-03-19',
    readTime: 8,
    category: 'Architecture',
  },
  {
    id: 'monitoring',
    title: 'Monitoring & Analytics: Track Your API Performance',
    excerpt: 'Set up comprehensive monitoring to track metrics, errors, and user behavior.',
    date: '2026-03-16',
    readTime: 10,
    category: 'Monitoring',
  },
  {
    id: 'rate-limiting',
    title: 'Rate Limiting Strategies to Prevent API Abuse',
    excerpt: 'Protect your APIs with smart rate limiting and quota management.',
    date: '2026-03-13',
    readTime: 6,
    category: 'Security',
  },
  {
    id: 'caching-strategies',
    title: 'Advanced Caching Strategies for Maximum Performance',
    excerpt: 'Implement Redis, CDN, and application-level caching for blazing-fast APIs.',
    date: '2026-03-10',
    readTime: 9,
    category: 'Performance',
  },
  {
    id: 'graphql-vs-rest',
    title: 'GraphQL vs REST: Choosing the Right API Style',
    excerpt: 'Compare GraphQL and REST APIs to determine the best approach for your use case.',
    date: '2026-03-07',
    readTime: 8,
    category: 'Architecture',
  },
  {
    id: 'documentation',
    title: 'Writing API Documentation That Developers Love',
    excerpt: 'Best practices for creating clear, comprehensive API documentation.',
    date: '2026-03-04',
    readTime: 7,
    category: 'Documentation',
  },
  {
    id: 'microservices',
    title: 'Building Microservices with NotiRest',
    excerpt: 'Architect scalable applications using NotiRest as a microservices foundation.',
    date: '2026-03-01',
    readTime: 11,
    category: 'Architecture',
  },
  {
    id: 'saas-patterns',
    title: 'SaaS API Patterns: Multi-Tenancy and Isolation',
    excerpt: 'Implement secure multi-tenant architectures with NotiRest APIs.',
    date: '2026-02-26',
    readTime: 10,
    category: 'SaaS',
  },
  {
    id: 'api-gateway',
    title: 'API Gateway Patterns for Centralized Management',
    excerpt: 'Use API gateways to manage, throttle, and monitor your Notion APIs.',
    date: '2026-02-23',
    readTime: 8,
    category: 'Architecture',
  },
  {
    id: 'cost-optimization',
    title: 'Cost Optimization: Reduce Your API Infrastructure Expenses',
    excerpt: 'Strategies to minimize costs while maintaining performance and reliability.',
    date: '2026-02-20',
    readTime: 7,
    category: 'Operations',
  },
  {
    id: 'deployment',
    title: 'Deploying NotiRest APIs to Production: A Complete Guide',
    excerpt: 'Learn production deployment strategies, scaling, and reliability practices.',
    date: '2026-02-17',
    readTime: 12,
    category: 'DevOps',
  },
  {
    id: 'compliance',
    title: 'GDPR, CCPA, and Data Privacy Compliance for APIs',
    excerpt: 'Ensure your NotiRest APIs meet data protection and privacy regulations.',
    date: '2026-02-14',
    readTime: 10,
    category: 'Compliance',
  },
  {
    id: 'custom-domains',
    title: 'Using Custom Domains with Your NotiRest APIs',
    excerpt: 'Brand your APIs with custom domain names for professional appearance.',
    date: '2026-02-11',
    readTime: 5,
    category: 'Configuration',
  },
  {
    id: 'integrations',
    title: '50 Popular Tools That Integrate with NotiRest APIs',
    excerpt: 'Explore integrations with Zapier, Make, and hundreds of other platforms.',
    date: '2026-02-08',
    readTime: 9,
    category: 'Integrations',
  },
  {
    id: 'case-studies',
    title: 'Case Studies: How Companies Use NotiRest in Production',
    excerpt: 'Real-world examples of successful NotiRest implementations and results.',
    date: '2026-02-05',
    readTime: 8,
    category: 'Case Studies',
  },
  {
    id: 'community-showcase',
    title: 'Community Showcase: Amazing Projects Built with NotiRest',
    excerpt: 'Celebrate creative and innovative projects from the NotiRest community.',
    date: '2026-02-02',
    readTime: 6,
    category: 'Community',
  },
  {
    id: 'roadmap',
    title: 'NotiRest Roadmap 2026: Upcoming Features & Improvements',
    excerpt: 'Get a sneak peek at upcoming features, improvements, and product direction.',
    date: '2026-01-30',
    readTime: 7,
    category: 'Announcements',
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting Guide: Common NotiRest Issues & Solutions',
    excerpt: 'Solve common problems with detailed troubleshooting steps and solutions.',
    date: '2026-01-27',
    readTime: 10,
    category: 'Support',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            NotiRest Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Tutorials, guides, and best practices for building powerful APIs with Notion.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group h-full"
            >
              <article className="h-full p-6 bg-card border border-border rounded-2xl hover:shadow-lg transition-all duration-300 hover:border-primary/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime} min
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    {post.excerpt}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition" />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
