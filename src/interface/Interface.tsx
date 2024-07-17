// interface
export interface groupDetailsInterface {
  id: number;
  name: string;
  totalgroupmembers: 1;
  groupmembers: [
    {
      fullname: string | null;
      profileimage: string | null;
    },
  ];
}
