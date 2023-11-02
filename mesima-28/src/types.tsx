export interface PersonInterface {
  _id: string;
  name: string;
  color?: string;
  groups?: GroupInterface[];
}

export interface GroupInterface {
  id: string;
  color?: string;
  _id: string;
  name: string;
  groupFather?: string;
  groups?: GroupInterface[];
  persons: PersonInterface[];
}
