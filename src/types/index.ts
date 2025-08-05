
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

export interface UserState {
  users: User[];
  filteredUsers: User[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  loading: boolean;
  error: string | null;
}