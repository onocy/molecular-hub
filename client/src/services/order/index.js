export const getOrders = async () => {
  const playlists = await fetch('/playlists');
  const result = await playlists.json();
  console.log(result);
  return ({
    orders: result,
    ordersTotal: result.length
  });
};
