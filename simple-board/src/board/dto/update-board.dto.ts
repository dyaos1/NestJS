// import { PartialType, PickType } from "@nestjs/swagger";
import { IsOptional, MaxLength, MinLength } from 'class-validator';
// import { CreateBoardDto } from "./≥create-board.dto";

export class UpdateBoardDto {
  @IsOptional()
  @MinLength(2)
  @MaxLength(20)
  name?: string;

  @IsOptional()
  contents?: string;
}

// export class UpdateBoardDto extends PartialType(CreateBoardDto) {}
/** PartialType으로 가져오게 되면 기본적으로는 Optional하게 가져오는데,
 * validator들을 전부 고지식하게 적용시키기 때문에
 * CreateBoardDto에 @IsNotEmpty()를 붙여놨으면 충돌하여 Optional하지 않게 되므로
 * PartialType을 적용하려면 원본클래스에서 @IsNotEmpty()를 사용하지 않아야 한다. */

// export class UpdateBoardDto extends PickType(CreateBoardDto, ['name']) {}
// export class UpdateBoardDto extends OmitType(CreateBoardDto, ['contents']) {}
/** 각각 특정 필드를 픽 or 빼고 가져오는 형태 */
