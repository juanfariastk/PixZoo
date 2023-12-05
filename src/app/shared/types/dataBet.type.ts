export interface DataBet {
  userId: number;
  userCPF: string;
  userEmail: string;
  animalsSelected: DataBetAnimal[];
  amountBet: number;
}

export interface DataBetAnimal {
  key: string;
  value: string[];
}

export interface DataBetWithDate extends DataBet {
  date: string;
}