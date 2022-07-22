import { IsNotEmpty } from 'class-validator';

export class AttributeMatchChallengeDto {
  @IsNotEmpty()
  def: string;

  @IsNotEmpty()
  result: Result[];
}

interface Result {
  set: string;
}
