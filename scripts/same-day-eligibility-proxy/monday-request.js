'use strict';

const { PRODUCT_PARTS_RELATION } = require('./monday-stock');

async function mondayGraphql(token, query, variables) {
  const response = await fetch('https://api.monday.com/v2', {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
      'API-Version': '2024-01'
    },
    body: JSON.stringify({ query, variables })
  });
  const payload = await response.json();
  if (!response.ok || (payload.errors && payload.errors.length)) {
    throw new Error('Monday GraphQL error: ' + JSON.stringify(payload.errors || payload));
  }
  return payload;
}

function createLiveMondayRequest(opts = {}) {
  const token = opts.token || process.env.MONDAY_AUTOMATIONS_TOKEN || process.env.MONDAY_APP_TOKEN || '';
  const productsBoardId = opts.productsBoardId || process.env.SAME_DAY_PRODUCTS_BOARD_ID || '2477699024';
  const productIdColumnId = opts.productIdColumnId || process.env.SAME_DAY_PRODUCT_ID_COLUMN || 'text_mkzdte13';
  if (!token) return null;

  return async function mondayRequest(job) {
    if (job.kind === 'products') {
      const query = `
        query ProductLookups($boardId: ID!, $productIds: [String!]!) {
          items_page_by_column_values(
            board_id: $boardId,
            columns: [{column_id: "${productIdColumnId}", column_values: $productIds}],
            limit: 50
          ) {
            items {
              id
              name
              column_values(ids: ["${PRODUCT_PARTS_RELATION}"]) {
                id type text value
                ... on BoardRelationValue { linked_item_ids display_value }
              }
            }
          }
        }
      `;
      const payload = await mondayGraphql(token, query, {
        boardId: job.boardId || productsBoardId,
        productIds: job.shopifyProductIds
      });
      return { items: payload.data?.items_page_by_column_values?.items || [] };
    }
    if (job.kind === 'parts') {
      const query = `
        query Parts($ids: [ID!]!) {
          items(ids: $ids) {
            id
            name
            column_values(ids: ["quantity", "formula_mkv86xh7"]) {
              id type text value
            }
          }
        }
      `;
      const payload = await mondayGraphql(token, query, { ids: job.ids });
      return { items: payload.data?.items || [] };
    }
    throw new Error('unknown monday job');
  };
}

module.exports = { mondayGraphql, createLiveMondayRequest };
