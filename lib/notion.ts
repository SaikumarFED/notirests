import { Client } from '@notionhq/client';

/**
 * Creates a Notion client with the given access token.
 */
export function getNotionClient(accessToken: string) {
  return new Client({ auth: accessToken });
}

/**
 * Cleans and flattens a Notion page properties object into a simple key-value JSON.
 */
export function cleanNotionProperties(properties: any): Record<string, any> {
  const clean: Record<string, any> = {};

  for (const [key, value] of Object.entries(properties)) {
    const prop = value as any;
    
    switch (prop.type) {
      case 'title':
        clean[key] = prop.title.map((t: any) => t.plain_text).join('');
        break;
      case 'rich_text':
        clean[key] = prop.rich_text.map((t: any) => t.plain_text).join('');
        break;
      case 'number':
        clean[key] = prop.number;
        break;
      case 'select':
        clean[key] = prop.select?.name || null;
        break;
      case 'multi_select':
        clean[key] = prop.multi_select.map((s: any) => s.name);
        break;
      case 'date':
        clean[key] = prop.date?.start || null;
        break;
      case 'checkbox':
        clean[key] = prop.checkbox;
        break;
      case 'url':
        clean[key] = prop.url;
        break;
      case 'email':
        clean[key] = prop.email;
        break;
      case 'phone_number':
        clean[key] = prop.phone_number;
        break;
      case 'formula':
        clean[key] = prop.formula[prop.formula.type];
        break;
      case 'relation':
        clean[key] = prop.relation.map((r: any) => r.id);
        break;
      case 'created_time':
        clean[key] = prop.created_time;
        break;
      case 'last_edited_time':
        clean[key] = prop.last_edited_time;
        break;
      default:
        // Fallback for unknown types or complex types not fully handled
        clean[key] = prop[prop.type] || null;
    }
  }

  return clean;
}

/**
 * Transforms a Notion Page response into a flat JSON object
 */
export function cleanNotionPage(page: any): Record<string, any> {
  return {
    id: page.id,
    created_time: page.created_time,
    last_edited_time: page.last_edited_time,
    url: page.url,
    ...cleanNotionProperties(page.properties)
  };
}
