export class Movie {
  public id: number;
  public year: number;
  public title: string;
  public studios: string;
  public winner: boolean;

  constructor(
    id: number,
    year: number,
    title: string,
    studios: string,
    winner: boolean,
  ) {
    this.id = id;
    this.year = year;
    this.title = title;
    this.studios = studios;
    this.winner = winner;
  }
}
