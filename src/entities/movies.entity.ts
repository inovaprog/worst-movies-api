export class MovieDB {
  public id: number;
  public year: number;
  public title: string;
  public studios: string;
  public winner: number;

  constructor(
    id: number,
    year: number,
    title: string,
    studios: string,
    winner: number,
  ) {
    this.id = id;
    this.year = year;
    this.title = title;
    this.studios = studios;
    this.winner = winner;
  }
}
