const notifications = [{
  id: 'DEV716627',
  title: 'New playlist has been added',
  when: '2 hours ago',
  type: 'playlistAdd',
  to: '/orders/DEV730658'
},
{
  id: 'DEV853890',
  title: 'New molecule has been added',
  when: '3 hours ago',
  type: 'molecule',
  to: '/users/DEV696649'
},
{
  id: 'DEV897704',
  title: 'Playlist has been triggered',
  when: '1 day ago',
  type: 'playlist',
  to: '/products/DEV654476'
}
];

export const getNotifications = (limit = 6) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        notifications: notifications.slice(0, limit),
        notificationsCount: notifications.length
      });
    }, 700);
  });
};
