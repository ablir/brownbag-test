export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  phone: string;
  address: Address;
  company: string;
  jobTitle: string;
  bio: string;
  joinedDate: string;
  lastLogin: string;
}

export interface UserInfoState {
  userInfo: UserInfo | null;
  loading: boolean;
  error: string;
}
