const webhookRepository = require('./webhook.repository');
const { NotFoundError } = require('../../utils/errors');
const logger = require('../../utils/logger');

const webhookService = {
  create: async (data) => {
    return webhookRepository.create(data);
  },

  list: async (userId, organizationId) => {
    return webhookRepository.findMany(userId, organizationId);
  },

  getById: async (id) => {
    const w = await webhookRepository.findById(id);
    if (!w) throw new NotFoundError('Webhook not found');
    return w;
  },

  update: async (id, data) => {
    await webhookService.getById(id);
    return webhookRepository.update(id, data);
  },

  delete: async (id) => {
    await webhookService.getById(id);
    return webhookRepository.delete(id);
  },

  fire: async (event, payload) => {
    const endpoints = await webhookRepository.findActiveByEvent(event);
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, payload, timestamp: new Date().toISOString() }),
        });
        await webhookRepository.createDelivery({
          webhookEndpointId: endpoint.id,
          event,
          payload,
          responseStatus: res.status,
          responseBody: await res.text().catch(() => null),
        });
      } catch (err) {
        logger.warn({ err, webhookId: endpoint.id }, 'Webhook delivery failed');
        await webhookRepository.createDelivery({
          webhookEndpointId: endpoint.id,
          event,
          payload,
          responseStatus: null,
          responseBody: err.message,
        });
      }
    }
  },
};

module.exports = webhookService;
