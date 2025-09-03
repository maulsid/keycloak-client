export const truncateUserId = (userId: string | undefined) => {
  if (!userId) return '';
  return userId.length > 8 ? `${userId.slice(0, 8)}...` : userId;
};