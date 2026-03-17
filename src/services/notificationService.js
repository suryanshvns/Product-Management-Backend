const notificationRepository = require('../repositories/notificationRepository');

const notificationService = {
  list: async (userId, opts) => {
    return notificationRepository.findManyByUserId(userId, opts);
  },

  markAsRead: async (id, userId) => {
    return notificationRepository.markAsRead(id, userId);
  },

  markAllAsRead: async (userId) => {
    return notificationRepository.markAllAsRead(userId);
  },
};

module.exports = notificationService;
