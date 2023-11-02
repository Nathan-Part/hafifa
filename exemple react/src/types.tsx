export interface PersonInterface {
    id: string,
    name: string,
    color?: string,
    groups?: GroupInterface[];
  }

export interface GroupInterface {
    color?: string;
    _id: string;
    name: string;
    groupFather?: string;
    groups?: GroupInterface[];
    persons: PersonBrutInterface[];
  }

// export type GroupBrutInterface = GroupInterface & {
//   _id: string;
// }

export type PersonBrutInterface = PersonInterface & {
  _id: string;
}
