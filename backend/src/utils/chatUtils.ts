/**
 * Generates a normalized topic name for private chats.
 * Always uses the lower userId first to ensure consistency.
 */
export function generatePrivateChatTopic(userId1: number, userId2: number): string {
  if (userId1 == null || userId2 == null) {
    throw new Error('User IDs cannot be null');
  }

  const minId = Math.min(userId1, userId2);
  const maxId = Math.max(userId1, userId2);

  return `/topic/chat/private/${minId}/${maxId}`;
}

/**
 * Checks if a user is staff (not a regular usuario).
 */
export function isStaff(role: string | null | undefined): boolean {
  if (!role) {
    return false;
  }
  const upperRole = role.toUpperCase();
  return upperRole !== 'USER' && upperRole !== 'USUARIO';
}






