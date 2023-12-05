export interface Animal {
    name: string;
    url: string;
    value:number[]
  }

export type AnimalDraw = {
  key: string;
  value: string[];
};

export type AnimalDrawControl = {
  actualDraw: {
    [key: string]: string[];
  }[];
  CreatedAt: string[];
};

export type PostAnimalDrawRequest = AnimalDraw[];
export type PostAnimalDrawResponse = AnimalDraw[];