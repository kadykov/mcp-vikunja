import { ReadResourceTemplateCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Variables } from '@modelcontextprotocol/sdk/shared/uriTemplate.js';

/**
 * Handle project resource requests
 * Currently returns hardcoded response, will be updated to use translation layer
 */
export const handleProjectResource: ReadResourceTemplateCallback = (
  uri: URL,
  variables: Variables,
  _extra: { [key: string]: unknown }
) => {
  // Return a resolved promise since ReadResourceTemplateCallback expects a Promise
  return Promise.resolve({
    contents: [
      {
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify({
          id: Number(variables.id),
          title: 'Not implemented',
          description: 'Draft implementation',
        }),
      },
    ],
  });
};
