export interface User {
  id: number;
  email: string | null;
  firstName: string;
  lastName: string;
  fullName?: string | null;
  role?: string;
  phone?: string | null;
  description?: string | null;
  profilePhoto?: string | null;
  profilePhotoThumb?: string | null;
  archived?: boolean;
  archivedAt?: string | null;
}
