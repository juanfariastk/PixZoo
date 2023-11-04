export interface Animal {
    name: string;
    url: string;
    value:number[]
  }

export type AnimalDraw = {
  key: string;
  value: string[];
};

export type PostAnimalDrawRequest = AnimalDraw[];
export type PostAnimalDrawResponse = AnimalDraw[];