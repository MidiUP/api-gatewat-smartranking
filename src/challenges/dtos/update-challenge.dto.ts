import { ChalengeUpdateStatus } from './../interfaces/challenge-update-status.enum';
import { IsDateString, IsEnum } from 'class-validator';

export class UpdateChallengeDto {
  @IsDateString()
  dateHourChallenge: Date;

  @IsEnum(ChalengeUpdateStatus, {})
  status: ChalengeUpdateStatus;
}
