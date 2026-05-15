interface JokeDTO {
  id: string;
  question: string;
  punchline: string;
}

export class Joke {
  private constructor(
    readonly id: string,
    readonly question: string,
    readonly punchline: string,
  ) {}

  static fromDTO(dto: JokeDTO): Joke {
    return new Joke(dto.id, dto.question, dto.punchline);
  }
}
